from rest_framework import serializers
from .models import ProposalReview


class ProposalReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProposalReview
        fields = '__all__'

    def update(self, instance, validated_data):
        # increase review round
        if instance.review_round:
            validated_data['review_round'] = instance.review_round + 1
        else:
            validated_data['review_round'] = 1

        return super().update(instance, validated_data)