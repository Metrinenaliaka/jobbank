from rest_framework import serializers
from django.utils import timezone
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):

    job_title = serializers.CharField(source="job.title", read_only=True)
    company_name = serializers.CharField(source="job.company_name", read_only=True)

    applicant_email = serializers.CharField(
        source="applicant.email",
        read_only=True
    )

    class Meta:
        model = Application
        fields = [
            "id",
            "job",
            "job_title",
            "company_name",
            "applicant_email",
            "cv",
            "cover_letter",
            "passport_photo",
            "other_documents",
            "status",
            "applied_at"
        ]
        read_only_fields = ["applied_at"]

    # -----------------------------
    # FILE VALIDATION
    # -----------------------------

    def validate_cv(self, value):
        if value.content_type != "application/pdf":
            raise serializers.ValidationError("CV must be a PDF file.")
        return value

    def validate_cover_letter(self, value):
        if value.content_type != "application/pdf":
            raise serializers.ValidationError("Cover letter must be a PDF file.")
        return value

    def validate_passport_photo(self, value):
        if not value.content_type.startswith("image/"):
            raise serializers.ValidationError("Passport photo must be an image file.")
        return value

    # -----------------------------
    # GENERAL VALIDATION
    # -----------------------------

    def validate(self, attrs):

        job = attrs.get("job")

        if not job:
            return attrs

        request = self.context.get("request")
        user = request.user

        # Expired check
        if job.expires_at <= timezone.now():
            raise serializers.ValidationError(
                {"detail": "This job has expired."}
            )

        # Active check
        if not job.is_active:
            raise serializers.ValidationError(
                {"detail": "This job is no longer active."}
            )

        # Duplicate prevention
        if Application.objects.filter(
            applicant=user,
            job=job
        ).exists():
            raise serializers.ValidationError(
                {"detail": "You already applied to this job."}
            )

        return attrs