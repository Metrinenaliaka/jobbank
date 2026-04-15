from rest_framework import viewsets, permissions
from .models import Document, DocumentType
from .serializers import DocumentSerializer, DocumentTypeSerializer, AdminDocumentSerializer

from .permissions import IsAdminUserCustom


class AdminDocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all().select_related("user", "document_type")
    serializer_class = AdminDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(user=self.request.user).select_related("document_type")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DocumentTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DocumentType.objects.all()
    serializer_class = DocumentTypeSerializer
    permission_classes = [permissions.IsAuthenticated]