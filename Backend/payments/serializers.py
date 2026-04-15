from rest_framework import serializers
from .models import Payment, PaymentMethod


from rest_framework import serializers
from .models import Payment, PaymentMethod


class PaymentSerializer(serializers.ModelSerializer):

    user_full_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    job_title = serializers.SerializerMethodField()

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
            "application",
            "job_title",
            "service_type",
            "payment_method",
            "payment_method_name",
            "reference_code",
            "status",
            "created_at",
        ]
        read_only_fields = ["created_at", "user"]

    # 🔒 PREVENT DUPLICATE APPLICATION FEE PAYMENTS
    def validate(self, attrs):
        request = self.context["request"]
        user = request.user

        service_type = attrs.get("service_type")
        application = attrs.get("application")

        # ===============================
        # 🔥 APPLICATION FEE (NEW LOGIC)
        # ===============================
        if service_type == "application_fee":

            # ✅ Block ONLY if there's a pending payment
            pending_payment = Payment.objects.filter(
                user=user,
                service_type="application_fee",
                status="pending"
            ).exists()

            if pending_payment:
                raise serializers.ValidationError(
                    "Your previous payment is still being verified."
                )

            # ✅ Block if already verified (user has paid once)
            already_verified = Payment.objects.filter(
                user=user,
                service_type="application_fee",
                status="verified"
            ).exists()

            if already_verified:
                raise serializers.ValidationError(
                    "Application fee already paid."
                )

            return attrs  # 🚨 EXIT EARLY (important)

        # ===============================
        # 🔥 OTHER PAYMENTS (UNCHANGED)
        # ===============================
        if application:
            pending_payment = Payment.objects.filter(
                user=user,
                application=application,
                service_type=service_type,
                status="pending"
            ).exists()

            if pending_payment:
                raise serializers.ValidationError(
                    "A payment for this application is still being processed."
                )

        return attrs

        

    def get_user_full_name(self, obj):
        return obj.user.full_name if obj.user else None

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None

    def get_job_title(self, obj):
        return obj.job.title if obj.job else None

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ["id", "name", "instructions", "is_active"]