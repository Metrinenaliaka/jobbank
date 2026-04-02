from rest_framework.routers import DefaultRouter
from django.urls import include, path
from .views import ApplicationViewSet

router = DefaultRouter()
router.register(r'applications', ApplicationViewSet, basename='applications')


urlpatterns = router.urls


