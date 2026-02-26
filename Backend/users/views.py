from rest_framework import generics, status
from rest_framework.response import Response
from django.shortcuts import redirect
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings
from .models import User, EmailVerification, PasswordReset
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, ResendVerificationSerializer
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import ValidationError
from django.http import HttpResponse
from django.utils.html import format_html
from django.contrib.auth.hashers import make_password


class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()

        verification = EmailVerification.objects.create(user=user)

        verification_link = f"http://localhost:8000/api/users/verify-email/{verification.token}/"

        send_mail(
            subject="Verify Your Email",
            message=f"Click to verify your email: {verification_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )


class VerifyEmailView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, token):

        verification = EmailVerification.objects.filter(token=token).first()

        if not verification:
            return redirect("http://127.0.0.1:5173/email-verified?status=invalid")

        if verification.is_expired():
            verification.delete()
            return redirect("http://127.0.0.1:5173/email-verified?status=expired")

        user = verification.user
        user.is_active = True
        user.save()
        verification.delete()

        return redirect("http://127.0.0.1:5173/email-verified?status=success")
class ResendVerificationView(generics.GenericAPIView):
    serializer_class = ResendVerificationSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"message": "If the email exists, a verification link has been sent."},
                status=status.HTTP_200_OK
            )

        if user.is_active:
            return Response(
                {"message": "Account already verified."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Delete old token if exists
        EmailVerification.objects.filter(user=user).delete()

        verification = EmailVerification.objects.create(user=user)

        verification_link = f"http://localhost:8000/api/users/verify-email/{verification.token}/"

        send_mail(
            subject="Resend Email Verification",
            message=f"Click to verify your email: {verification_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )

        return Response(
            {"message": "Verification email sent."},
            status=status.HTTP_200_OK
        )

class RequestPasswordResetView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        print("Incoming reset email:", email)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal if email exists
            return Response(
                {"message": "If the email exists, a reset link has been sent."},
                status=status.HTTP_200_OK
            )

        PasswordReset.objects.filter(user=user).delete()

        reset = PasswordReset.objects.create(user=user)

        reset_link = f"http://127.0.0.1:5173/reset-password/{reset.token}/"

        print("Reset email being sent to:", user.email)

        send_mail(
            subject="Reset Your Password",
            message=f"Click to reset your password: {reset_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )

        return Response(
            {"message": "Reset link sent."},
            status=status.HTTP_200_OK
        )
class ConfirmPasswordResetView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, token):
        reset = get_object_or_404(PasswordReset, token=token)

        if reset.is_expired():
            reset.delete()
            return Response(
                {"error": "Reset link expired."},
                status=status.HTTP_400_BAD_REQUEST
            )

        new_password = request.data.get("password")

        if not new_password:
            raise ValidationError({"password": "Password required."})

        user = reset.user
        user.set_password(new_password)   # ✅ CORRECT METHOD
        user.save()

        reset.delete()

        return Response(
            {"message": "Password reset successful."},
            status=status.HTTP_200_OK
        )