from rest_framework import serializers
from .models import Application
from django.utils import timezone


class ApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application
        fields = [
            'id',
            'job',
            'cv',
            'passport_photo',
            'certificates',
            'applied_at'
        ]
        read_only_fields = ['applied_at']

    def validate(self, attrs):
        job = attrs['job']

        # 🔒 Prevent applying to expired jobs
        if job.expires_at <= timezone.now():
            raise serializers.ValidationError("This job has expired.")

        if not job.is_active:
            raise serializers.ValidationError("This job is no longer active.")

        return attrs
