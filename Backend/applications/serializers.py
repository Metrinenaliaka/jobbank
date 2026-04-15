from rest_framework import serializers
from django.utils import timezone
from .models import Application
from payments.models import Payment, PaymentMethod


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
        user = obj.applicant

        # ✅ FIRST: check if ANY verified payment exists
        has_verified = Payment.objects.filter(
            user=user,
            service_type="application_fee",
            status="verified"
        ).exists()

        if has_verified:
            return "verified"

        # ✅ THEN check pending
        has_pending = Payment.objects.filter(
            user=user,
            service_type="application_fee",
            status="pending"
        ).exists()

        if has_pending:
            return "pending"

        # ✅ THEN check rejected
        has_rejected = Payment.objects.filter(
            user=user,
            service_type="application_fee",
            status="rejected"
        ).exists()

        if has_rejected:
            return "rejected"

        return "not_paid"

    # -----------------------------
    # VALIDATION
    # -----------------------------

    def validate(self, attrs):
        job = attrs.get("job")
        if not job:
            return attrs

        request = self.context.get("request")
        user = request.user

        

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

