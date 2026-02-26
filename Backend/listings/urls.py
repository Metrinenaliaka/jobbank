from rest_framework.routers import DefaultRouter
from .views import JobListingViewSet, TagViewSet

router = DefaultRouter()
router.register(r'jobs', JobListingViewSet, basename='jobs')
router.register(r'tags', TagViewSet)

urlpatterns = router.urls
