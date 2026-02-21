from rest_framework import serializers
from .models import SupportTicket


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