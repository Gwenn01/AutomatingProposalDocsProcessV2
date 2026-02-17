from rest_framework import serializers
from .models import Reviewer

class ReviewerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reviewer
        fields = '__all__'

    # def create(self, validated_data):
    #     return Reviewer.objects.create(**validated_data)