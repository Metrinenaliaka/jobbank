from requests import Response

from rest_framework import viewsets, permissions
from django.core.mail import send_mail
from django.conf import settings
from .models import Application
from payments.models import Payment, PaymentMethod
from django.utils import timezone
from .serializers import ApplicationSerializer
from visa.models import VisaApplication, VisaStage




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
            if application.status == "accepted":

                visa, created = VisaApplication.objects.get_or_create(
                    application=application
                )

                if created:
                    stages = [
                        ("job_offer", "Job Offer Letter"),
                        ("work_permit", "Work Permit Application"),
                        ("ielts", "IELTS Test"),
                        ("medical", "Medical Examination"),
                        ("biometrics", "Biometrics"),
                        ("lmia", "LMIA Approval"),
                        ("visa_processing", "Visa Processing"),
                        ("decision", "Decision Made"),
                    ]

                    for index, (key, label) in enumerate(stages):
                        VisaStage.objects.create(
                            visa_application=visa,
                            key=key,
                            name=label,
                            order=index
                        )
            message = f"""
Dear {application.applicant.full_name},

We are pleased to inform you that your application has been successfully processed, and the hiring company has issued your Job Offer Letter.

📌 Action Required
• Log in to your account:
  https://www.simizi.net  
• Access your dashboard  
• Download your Job Offer Letter  
• Review and sign the document  
• Upload or return the signed copy  

⏳ Deadline  
Kindly submit the signed letter within 3 days to avoid delays or cancellation of your application.

Once received, we will proceed with your Work Permit Application.

If you need assistance, please contact our support team.

Kind regards,  
Simizi Support Team  
https://www.simizi.net
"""
                    
            send_mail(
                subject="Job Offer Letter Issued – Action Required",
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[application.applicant.email],
                fail_silently=False,
            )