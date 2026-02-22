from rest_framework import serializers
from .models import Payment, PaymentMethod


class PaymentSerializer(serializers.ModelSerializer):

    user_full_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    job_title = serializers.SerializerMethodField()

    # ✅ Accept only active methods when creating payment
    payment_method = serializers.PrimaryKeyRelatedField(
        queryset=PaymentMethod.objects.filter(is_active=True)
    )

    payment_method_name = serializers.CharField(
        source="payment_method.name",
        read_only=True
    )

    class Meta:
        model = Payment
        fields = [
            "id",
            "user",
            "user_full_name",
            "user_email",
            "job",
            "job_title",
            "service_type",
            "payment_method",
            "payment_method_name",
            "reference_code",
            "status",
            "created_at",
        ]
        read_only_fields = ["created_at", "user"]

    def get_user_full_name(self, obj):
        return obj.user.full_name if obj.user else None

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None

    def get_job_title(self, obj):
        return obj.job.title if obj.job else None

    def update(self, instance, validated_data):
        request = self.context.get("request")

        if "status" in validated_data and not request.user.is_staff:
            validated_data.pop("status")

        return super().update(instance, validated_data)


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ["id", "name", "instructions", "is_active"]