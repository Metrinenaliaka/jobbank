from rest_framework import serializers
from .models import Application
from django.utils import timezone


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
            "applicant",
            "applicant_email",
            "cv",
            "passport_photo",
            "certificates",
            "status",
            "applied_at"
        ]
        read_only_fields = ["applied_at"]

    def validate(self, attrs):

        job = attrs.get("job")

        # admin patch status → skip
        if not job:
            return attrs

        request = self.context.get("request")
        user = request.user

        # expired check
        if job.expires_at <= timezone.now():
            raise serializers.ValidationError(
                {"detail": "This job has expired."}
            )

        if not job.is_active:
            raise serializers.ValidationError(
                {"detail": "This job is no longer active."}
            )

        # prevent duplicates
        if Application.objects.filter(
            applicant=user,
            job=job
        ).exists():
            raise serializers.ValidationError(
                {"detail": "You already applied to this job."}
            )

        return attrs