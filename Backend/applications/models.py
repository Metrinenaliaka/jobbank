from django.db import models
from django.conf import settings
from listings.models import JobListing


class Application(models.Model):

    STATUS_CHOICES = [
        ("applied", "Applied"),
        ("reviewed", "Reviewed"),
        ("assessment", "Assessment"),
        ("interview", "Interview"),
        ("accepted", "Accepted"),
        ("declined", "Declined"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("rejected", "Rejected"),
    ]

    applicant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    job = models.ForeignKey(
        JobListing,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    # Required Documents
    cv = models.FileField(upload_to="applications/cv/")
    cover_letter = models.FileField(upload_to="applications/cover_letters/")
    passport_photo = models.ImageField(upload_to="applications/passports/")

    # Optional
    other_documents = models.FileField(
        upload_to="applications/others/",
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="applied"
    )
    payment_status = models.CharField(
    max_length=20,
    choices=PAYMENT_STATUS_CHOICES,
    default="pending"
    )
    payment_verified_at = models.DateTimeField(
        blank=True,
        null=True
    )

    payment_rejection_reason = models.TextField(
        blank=True,
        null=True
    )

    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('applicant', 'job')
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.applicant.email} - {self.job.title}"