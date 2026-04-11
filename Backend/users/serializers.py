from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.timezone import now



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        

        if not self.user.is_active:
            raise serializers.ValidationError(
                "Email is not verified. Please verify your email before logging in."
            )
        
        # Update last login
        self.user.last_login = now()
        self.user.save(update_fields=["last_login"])

        # Optional: add extra user info in token response
        data.update({
            "user": {
                "id": self.user.id,
                "email": self.user.email,
                "full_name": self.user.full_name,
                "is_staff": self.user.is_staff,   # ⭐ IMPORTANT
            }
        })


        return data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'full_name',
            'email',
            'year_of_birth',
            'languages',
            'phone_number',
            'gender',
            'nationality',
            'password'
        ]

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate_year_of_birth(self, value):
        if value > 2010:
            raise serializers.ValidationError("Invalid year of birth.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        return user

class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()

class AdminUserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    telegram_chat_id = serializers.CharField(read_only=True)
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "is_active",
            "is_staff",
            "date_joined",
            "last_login",
            "telegram_chat_id",
        ]
    def get_full_name(self, obj):
        return f"{obj.full_name}"

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "full_name",
            "email",
            "phone_number",
            "nationality",
        ]

        def validate_email(self, value):
            if User.objects.filter(email=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("Email already in use.")
            return value