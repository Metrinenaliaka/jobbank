from rest_framework import viewsets, permissions
from django.core.mail import send_mail
from django.conf import settings

from .models import Payment
from .serializers import PaymentSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Admin users see ALL payments.
        Normal users only see their own payments.
        """
        if self.request.user.is_staff:
            return Payment.objects.all().order_by("-created_at")

        return Payment.objects.filter(
            user=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        payment = serializer.save(user=self.request.user)

        # ✅ Payment received email
        send_mail(
            subject="Payment Received - Simizi",
            message=(
                f"Hi {payment.user.full_name},\n\n"
                f"We have received your payment reference: {payment.reference_code} "
                f"for {payment.get_service_type_display()}.\n\n"
                "Our team will verify your payment shortly.\n\n"
                "Thank you for choosing Simizi."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[payment.user.email],
            fail_silently=False,
        )

        # ✅ Document request email
        send_mail(
            subject="Next Step - Submit Your Documents",
            message=(
                "Please reply to this email with:\n\n"
                "- Your current resume (if any)\n"
                "- Job description\n"
                "- Relevant documents\n\n"
                "Our team will begin once payment is verified."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[payment.user.email],
            fail_silently=False,
        )

    def perform_update(self, serializer):
        """
        Trigger email only when admin verifies payment.
        """
        old_instance = self.get_object()
        old_status = old_instance.status

        payment = serializer.save()

        # Only trigger when status changes to verified
        if old_status != payment.status and payment.status == "verified":
            send_mail(
                subject="Payment Verified - Simizi",
                message=(
                    f"Hi {payment.user.full_name},\n\n"
                    "Your payment has been verified.\n"
                    "Our team will now begin working on your request.\n\n"
                    "Thank you for choosing Simizi."
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[payment.user.email],
                fail_silently=False,
            )