from rest_framework import serializers
from .models import ProposalReview
from reviewer.models import ProposalReviewer

class ProposalReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProposalReview
        fields = '__all__'