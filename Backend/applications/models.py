from django.db import models
from django.conf import settings
from listings.models import JobListing
from django.utils import timezone


class Application(models.Model):
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

    cv = models.FileField(upload_to="applications/cv/")
    passport_photo = models.ImageField(upload_to="applications/passports/")
    certificates = models.FileField(upload_to="applications/certificates/")

    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('applicant', 'job')
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.applicant.email} - {self.job.title}"
