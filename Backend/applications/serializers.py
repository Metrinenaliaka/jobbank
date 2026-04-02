from rest_framework import serializers
from django.utils import timezone
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):

    job_title = serializers.CharField(source="job.title", read_only=True)
    company_name = serializers.CharField(source="job.company_name", read_only=True)
    latest_payment_status = serializers.SerializerMethodField()

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
            "latest_payment_status",
            "applied_at"
        ]
        read_only_fields = ["applied_at"]

    def get_latest_payment_status(self, obj):
        payment = obj.payments.filter(
            service_type="application_fee"
        ).order_by("-created_at").first()

        if not payment:
            return "not_paid"

        return payment.status

    # -----------------------------
    # VALIDATION
    # -----------------------------

    def validate(self, attrs):
        job = attrs.get("job")
        if not job:
            return attrs

        request = self.context.get("request")
        user = request.user

        if job.expires_at <= timezone.now():
            raise serializers.ValidationError(
                {"detail": "This job has expired."}
            )

        if not job.is_active:
            raise serializers.ValidationError(
                {"detail": "This job is no longer active."}
            )

        if Application.objects.filter(
            applicant=user,
            job=job
        ).exists():
            raise serializers.ValidationError(
                {"detail": "You already applied to this job."}
            )

        return attrs

