from email.mime import message

from rest_framework import generics, status
from rest_framework.response import Response
from django.shortcuts import redirect
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from .models import User, EmailVerification, PasswordReset
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, ResendVerificationSerializer, AdminUserSerializer
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse
from django.utils.html import format_html
from django.contrib.auth.hashers import make_password
from users.services.telegram_service import send_telegram_message


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
        message = f"""
            Welcome to Simizi 🎉

            Verify your account:
            {verification_link}

            Simizi Team
            🌐 https://simizi.net\n
             
            """

        send_mail(
            subject="Verify Your Email",
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )
        # Send Telegram if linked
        if user.telegram_chat_id:
            send_telegram_message(user.telegram_chat_id, message)


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

        message = f"""
            Reset your Simizi password

            Click here:
            {reset_link}

            If you did not request this, ignore this message.
            """

        send_mail(
            subject="Reset Your Password",
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )

        if user.telegram_chat_id:
            send_telegram_message(user.telegram_chat_id, message)

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
class AdminUserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    filterset_fields = ["is_active", "is_staff"]
    search_fields = ["email", "full_name"]
    ordering_fields = ["date_joined", "last_login"]
    ordering = ["-date_joined"]

class AdminUserDetailView(RetrieveUpdateAPIView):

    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]

class TelegramWebhookView(APIView):

    permission_classes = [AllowAny]
    

    def post(self, request):

        data = request.data
        print("TELEGRAM HIT:", request.data)

        if "message" not in data:
            return Response({"status": "ignored"})

        message = data["message"]
        chat_id = message["chat"]["id"]

        text = message.get("text", "")

        if text.startswith("/start"):

            parts = text.split(" ")

            if len(parts) > 1:
                user_id = parts[1]

                user = get_object_or_404(User, id=user_id)

                user.telegram_chat_id = chat_id
                user.save()
                send_telegram_message(chat_id, "✅ Telegram successfully connected to your Simizi account!")

        return Response({"status": "ok"})