from os import path
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView,
    VerifyEmailView,
    CustomLoginView,
    ResendVerificationView,
    RequestPasswordResetView,
    ConfirmPasswordResetView,
    AdminUserListView,
    AdminUserDetailView,
    TelegramWebhookView,
    me,
    MeUpdateView,
    ChangePasswordView
)
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-email/<uuid:token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('resend-verification/', ResendVerificationView.as_view(), name='resend-verification'),
    path("password-reset/", RequestPasswordResetView.as_view(), name="request-password-reset"),
    path("password-reset-confirm/<uuid:token>/", ConfirmPasswordResetView.as_view(), name="confirm-password-reset"),
    path("admin/users/<int:pk>/", AdminUserDetailView.as_view()),
    path("admin/users/", AdminUserListView.as_view(), name="admin-users"),
    path("telegram/webhook/", TelegramWebhookView.as_view()),
    path("me/", me, name="me"),
    path("me/update/", MeUpdateView.as_view()),
    path("change-password/", ChangePasswordView.as_view()),


]


