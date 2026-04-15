from django.db import models
from django.conf import settings
from applications.models import Application


class VisaApplication(models.Model):
    application = models.OneToOneField(
        Application,
        on_delete=models.CASCADE,
        related_name="visa"
    )

    current_stage = models.CharField(max_length=50, default="job_offer")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Visa - {self.application.applicant.email}"


class VisaStage(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("declined", "Declined"),
    ]

    visa_application = models.ForeignKey(
        VisaApplication,
        on_delete=models.CASCADE,
        related_name="stages"
    )

    key = models.CharField(max_length=50)
    name = models.CharField(max_length=100)
    order = models.IntegerField()
    medical_booking_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    notes = models.TextField(blank=True)
    date_completed = models.DateTimeField(null=True, blank=True)
    biometrics_booking_date = models.DateField(null=True, blank=True)  # <-- ADD THIS
    biometrics_status = models.CharField(  # <-- ADD THIS
        max_length=20,
        choices=[("pending", "Pending"), ("approved", "Approved"), ("declined", "Declined")],
        default="pending"
    )
    medical_status = models.CharField(  # <-- ADD THIS
        max_length=20,
        choices=[("pending", "Pending"), ("approved", "Approved"), ("rejected", "Rejected")],
        default="pending"
    )
    ielts_status = models.CharField(
    max_length=20,
    choices=[("pending", "Pending"), ("approved", "Approved"), ("rejected", "Rejected")],
    default="pending"
)
    decision_status = models.CharField(
    max_length=20,
    choices=[("pending", "Pending"), ("approved", "Approved"), ("rejected", "Rejected")],
    default="pending"
)

    def __str__(self):
        return self.name


class VisaDocument(models.Model):
    stage = models.ForeignKey(
        VisaStage,
        on_delete=models.CASCADE,
        related_name="uploads"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    VERIFICATION_CHOICES = [
    ("pending", "Pending"),
    ("approved", "Approved"),
    ("rejected", "Rejected"),
    ]

    verification_status = models.CharField(
        max_length=20,
        choices=VERIFICATION_CHOICES,
        default="pending"
    )

    file = models.FileField(upload_to="visa_uploads/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by_admin = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    admin_note = models.TextField(blank=True, null=True)