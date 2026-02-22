from rest_framework import generics, status
from rest_framework.response import Response
from django.shortcuts import redirect
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings
from .models import User, EmailVerification
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, ResendVerificationSerializer
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import ValidationError


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
        verification = get_object_or_404(EmailVerification, token=token)

        if verification.is_expired():
            verification.delete()
            return redirect("http://127.0.0.1:5173/?verified=expired")

        user = verification.user
        user.is_active = True
        user.save()

        verification.delete()

        # 🔥 Redirect to frontend homepage
        return redirect("http://127.0.0.1:5173/?verified=true")

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