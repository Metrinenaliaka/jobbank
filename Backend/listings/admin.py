from django.contrib import admin
from .models import JobListing, Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name']


@admin.register(JobListing)
class JobListingAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'company_name',
        'location_city',
        'work_mode',
        'employment_type',
        'created_at',
        'is_active'
    ]

    list_filter = ['work_mode', 'employment_type', 'is_active']
    search_fields = ['title', 'company_name', 'location_city']
