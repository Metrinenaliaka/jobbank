from django.db import models
from django.conf import settings
import uuid
from django.utils import timezone
from datetime import timedelta


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class JobListing(models.Model):

    class Meta:
        ordering = ['-created_at']
        indexes = [
        models.Index(fields=['location_city']),
        models.Index(fields=['location_province']),
        models.Index(fields=['created_at']),
        models.Index(fields=['expires_at']),
        ]



    WORK_MODE_CHOICES = (
        ('on_site', 'On Site'),
        ('hybrid', 'Hybrid'),
        ('remote', 'Remote'),
    )

    EMPLOYMENT_TYPE_CHOICES = (
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('permanent', 'Permanent'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Basic Info
    title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    location_city = models.CharField(max_length=100)
    location_province = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_type = models.CharField(max_length=50, blank=True)  # hourly / annually
    hours_per_week = models.PositiveIntegerField(null=True, blank=True)

    work_mode = models.CharField(max_length=20, choices=WORK_MODE_CHOICES)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES)

    vacancies = models.PositiveIntegerField(default=1)
    start_date = models.CharField(max_length=100, blank=True)

    benefits = models.TextField(blank=True)

    # Overview Section
    languages = models.CharField(max_length=255, blank=True)
    education = models.TextField(blank=True)
    experience = models.CharField(max_length=255, blank=True)
    work_environment = models.TextField(blank=True)
    work_setting = models.CharField(max_length=255, blank=True)

    # Detailed Sections
    responsibilities = models.TextField(blank=True)
    supervision = models.CharField(max_length=255, blank=True)
    specialization = models.TextField(blank=True)

    # Metadata
    tags = models.ManyToManyField(Tag, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posted_jobs"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(days=30)
        super().save(*args, **kwargs)

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return self.title
