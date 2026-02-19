from rest_framework import serializers
from .models import SupportTicket


class SupportTicketSerializer(serializers.ModelSerializer):

    class Meta:
        model = SupportTicket
        fields = [
            'id',
            'subject',
            'message',
            'admin_response',
            'status',
            'created_at',
            'resolved_at'
        ]
        read_only_fields = [
            'status',
            'admin_response',
            'created_at',
            'resolved_at'
        ]
