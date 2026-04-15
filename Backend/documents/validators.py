import os
from rest_framework import serializers

def validate_document_file(file):
    allowed_types = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/webp"
    ]

    allowed_extensions = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".webp"]

    ext = os.path.splitext(file.name)[1].lower()

    if file.content_type not in allowed_types:
        raise serializers.ValidationError("Invalid file type.")

    if ext not in allowed_extensions:
        raise serializers.ValidationError("Invalid file extension.")

    # Optional: file size limit (e.g. 5MB)
    if file.size > 5 * 1024 * 1024:
        raise serializers.ValidationError("File size must be under 5MB.")

    return file