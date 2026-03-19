from rest_framework import viewsets, permissions
from django.core.mail import send_mail
from django.conf import settings
from .models import Application
from payments.models import Payment, PaymentMethod
from django.utils import timezone


from .serializers import ApplicationSerializer


class ApplicationViewSet(viewsets.ModelViewSet):

    serializer_class = ApplicationSerializer

    # =============================
    # PERMISSIONS
    # =============================
    def get_permissions(self):

        # Only admin can edit status or delete
        if self.action in ["update", "partial_update", "destroy"]:
            return [permissions.IsAdminUser()]

        return [permissions.IsAuthenticated()]

    # =============================
    # QUERYSET
    # =============================
    def get_queryset(self):

        # Admin sees all applications
        if self.request.user.is_staff:
            return Application.objects.select_related("job", "applicant")

        # Regular user sees only their own
        return Application.objects.select_related("job", "applicant").filter(
            applicant=self.request.user
        )

    # =============================
    # CREATE APPLICATION
    # =============================
    def perform_create(self, serializer):

        application = serializer.save(
            applicant=self.request.user
        )
        

        send_mail(
        subject="Application Received - Payment Required",
        message=(
            f"Dear {self.request.user.full_name},\n\n"
            f"We have received your documents for {application.job.title}.\n\n"
            "To proceed to the next stage, please pay 350 CAD.\n\n"
            "Once your payment is verified, you will be notified.\n\n"
            "Warm regards,\n"
            "The Simizi Team\n"
            "🌐 https://simizi.net\n"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[self.request.user.email],
        fail_silently=False,
    )

    # =============================
    # UPDATE STATUS (ADMIN ONLY)
    # =============================
    def perform_update(self, serializer):

        old_status = self.get_object().status
        old_payment_status = self.get_object().payment_status

        application =serializer.save()

        # =========================
        # PAYMENT STATUS CHANGE
        # =========================
        if old_payment_status != application.payment_status:

            if application.payment_status == "paid":
                application.payment_verified_at = timezone.now()
                application.save()

                send_mail(
                    subject="Payment Verified",
                    message=(
                        f"Dear {application.applicant.full_name},\n\n"
                        "Your payment has been verified.\n\n"
                        "Your application is now under review.\n\n"
                        "Warm regards,\n"
                        "The Simizi Team\n"
                        "🌐 https://simizi.net\n"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[application.applicant.email],
                    fail_silently=False,
                )

            elif application.payment_status == "rejected":
                send_mail(
                    subject="Payment Rejected",
                    message=(
                        f"Dear {application.applicant.full_name},\n\n"
                        "Your payment could not be verified.\n\n"
                        "Please contact support or try again.\n\n"
                        "Warm regards,\n"
                        "The Simizi Team\n"
                        "🌐 https://simizi.net\n"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[application.applicant.email],
                    fail_silently=False,
                )

        # =========================
        # APPLICATION STATUS CHANGE
        # =========================
        if old_status != application.status:
            send_mail(
                subject="Application Status Updated",
                message=(
                    f"Dear {application.applicant.full_name},\n\n"
                    f"Your application for {application.job.title} has been updated.\n\n"
                    f"New Status: {application.status.capitalize()}\n\n"
                    "Warm regards,\n"
                    "The Simizi Team\n"
                    "🌐 https://simizi.net\n"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[application.applicant.email],
                fail_silently=False,
            )