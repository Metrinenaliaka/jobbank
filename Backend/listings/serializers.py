from rest_framework import serializers
from .models import JobListing, Tag


class TagSerializer(serializers.ModelSerializer):
     
      class Meta:
        model = Tag
        fields = '__all__'


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
            'employment_type',
            'created_at',
            'tags',
            
        ]


class JobDetailSerializer(serializers.ModelSerializer):

    # ⭐ FIX CREATED_BY
    created_by = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    tags = TagSerializer(many=True, read_only=True)
    

    class Meta:
        model = JobListing
        fields = '__all__'
