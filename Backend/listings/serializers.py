from rest_framework import serializers
from .models import JobListing, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class JobSmallSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = JobListing
        fields = [
            'id',
            'title',
            'company_name',
            'location_city',
            'location_province',
            'salary',
            'salary_type',
            'work_mode',
            'created_at',
            'tags'
        ]


class JobDetailSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = JobListing
        fields = '__all__'
class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobListing
        fields = '__all__'