from rest_framework.routers import DefaultRouter
from .views import VisaApplicationViewSet, UploadVisaDocumentView, UpdateVisaStageView, VerifyVisaDocumentView
from django.urls import path

router = DefaultRouter()
router.register(r'visa-applications', VisaApplicationViewSet, basename='visa')

urlpatterns = [
    path("visa-upload/", UploadVisaDocumentView.as_view()),
    path("visa-stage/<int:pk>/update/", UpdateVisaStageView.as_view()),
    path("visa-document/<int:pk>/verify/", VerifyVisaDocumentView.as_view()),
]

urlpatterns += router.urls