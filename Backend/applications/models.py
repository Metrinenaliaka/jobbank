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

    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('applicant', 'job')
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.applicant.email} - {self.job.title}"