from rest_framework import serializers
from .models import Document, DocumentType
from .validators import validate_document_file



class DocumentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentType
        fields = ["id", "name", "is_required"]

class DocumentSerializer(serializers.ModelSerializer):
    document_type_name = serializers.CharField(source="document_type.name", read_only=True)

    class Meta:
        model = Document
        fields = [
            "id",
            "document_type",
            "document_type_name",
            "file",
            "status",
            "uploaded_at",
        ]
        read_only_fields = ["status", "uploaded_at"]

    def validate_file(self, file):
        return validate_document_file(file)

    def create(self, validated_data):
        user = self.context["request"].user

        # 🔥 Prevent duplicates per type (replace instead)
        document, created = Document.objects.update_or_create(
            user=user,
            document_type=validated_data["document_type"],
            defaults={
                "file": validated_data["file"],
                "status": "pending",
            },
        )
        return document

class AdminDocumentSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_full_name = serializers.CharField(source="user.full_name", read_only=True)
    document_type_name = serializers.CharField(source="document_type.name", read_only=True)

    class Meta:
        model = Document
        fields = "__all__"