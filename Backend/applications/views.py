from rest_framework import viewsets, permissions
from django.core.mail import send_mail
from django.conf import settings
from .models import Application
from .serializers import ApplicationSerializer


class ApplicationViewSet(viewsets.ModelViewSet):

    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own applications
        return Application.objects.filter(applicant=self.request.user)

    def perform_create(self, serializer):
        application = serializer.save(applicant=self.request.user)

        # 📧 Send confirmation email
        send_mail(
            subject="Application Submitted Successfully",
            message=f"You have successfully applied for {application.job.title}.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[self.request.user.email],
            fail_silently=False,
        )
