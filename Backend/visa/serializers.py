from rest_framework import serializers
from django.utils import timezone
from .models import VisaStage, VisaApplication, VisaDocument
from payments.models import Payment

class VisaDocumentSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = VisaDocument
        fields = "__all__"

class VisaStageSerializer(serializers.ModelSerializer):   
    uploads = VisaDocumentSerializer(many=True, read_only=True)
    lmia_payment_status = serializers.SerializerMethodField()
    visa_payment_status = serializers.SerializerMethodField()

    class Meta:
        model = VisaStage
        fields = "__all__"

    def get_lmia_payment_status(self, obj):
        payment = Payment.objects.filter(
            application=obj.visa_application.application,
            service_type="lmia_fee",
            status="verified"
        ).first()

        return "paid" if payment else "pending"

    def get_visa_payment_status(self, obj):
        payment = Payment.objects.filter(
            application=obj.visa_application.application,
            service_type="visa_fee",
            status="verified"
        ).first()

        return "paid" if payment else "pending"


class VisaApplicationSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(
        source="application.applicant.full_name"
    )
    email = serializers.CharField(
        source="application.applicant.email"
    )
    job_title = serializers.CharField(
        source="application.job.title"
    )

    stages = VisaStageSerializer(many=True, read_only=True)

    class Meta:
        model = VisaApplication
        fields = ["id", "application", "current_stage", "stages", "applicant_name", "email", "job_title"]



