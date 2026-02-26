from rest_framework import serializers
from .models import SupportTicket, SiteSetting


class SupportTicketSerializer(serializers.ModelSerializer):

    user_email = serializers.CharField(
        source="user.email",
        read_only=True
    )

    class Meta:
        model = SupportTicket
        fields = [
            "id",
            "subject",
            "message",
            "admin_response",
            "status",
            "created_at",
            "resolved_at",
            "user_email",
        ]
        read_only_fields = [
            "created_at",
            "resolved_at",
            "user_email",
        ]

class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = ["id", "whatsapp_link", "is_whatsapp_active"]