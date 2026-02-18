from rest_framework.routers import DefaultRouter
from .views import JobListingViewSet

router = DefaultRouter()
router.register(r'jobs', JobListingViewSet, basename='jobs')

urlpatterns = router.urls
