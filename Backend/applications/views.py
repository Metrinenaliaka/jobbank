from rest_framework import viewsets, permissions
from django.core.mail import send_mail
from django.conf import settings
from .models import Application
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

        # Send confirmation email
        send_mail(
            subject="Application Submitted Successfully",
            message=(
                f"You applied for {application.job.title}.\n\n"
                f"Status: Applied\n\n"
                "We will notify you if your status changes."
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
        application = serializer.save()

        # Send email only if status actually changed
        if old_status != application.status:

            send_mail(
                subject="Application Status Updated",
                message=(
                    f"Your application for {application.job.title} "
                    f"has been updated.\n\n"
                    f"New Status: {application.status.capitalize()}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[application.applicant.email],
                fail_silently=False,
            )