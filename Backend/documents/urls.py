from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet, DocumentTypeViewSet, AdminDocumentViewSet

router = DefaultRouter()
router.register(r"documents", DocumentViewSet, basename="documents")
router.register(r"document-types", DocumentTypeViewSet, basename="document-types")
router.register(r"admin-documents", AdminDocumentViewSet, basename="admin-documents")

urlpatterns = router.urls