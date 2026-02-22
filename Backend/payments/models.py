from django.db import models
from listings.models import JobListing
from django.conf import settings


class PaymentMethod(models.Model):
    name = models.CharField(max_length=100)    
    instructions = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Payment(models.Model):

    SERVICE_CHOICES = (
        ("resume", "Resume Writing"),
        ("cover_letter", "Cover Letter Writing"),
    )

    STATUS_CHOICES = (
        ("pending", "Pending Verification"),
        ("verified", "Verified"),
        ("rejected", "Rejected"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    job = models.ForeignKey(
        JobListing,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="payments"
    )

    service_type = models.CharField(max_length=20, choices=SERVICE_CHOICES)

    # ✅ CHANGED TO FOREIGN KEY
    payment_method = models.ForeignKey(
        PaymentMethod,
        on_delete=models.SET_NULL,
        null=True,
        related_name="payments"
    )

    reference_code = models.CharField(max_length=100)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.service_type} - {self.status}"