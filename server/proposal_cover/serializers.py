from rest_framework import serializers
from .models import  ProposalCoverPage

class ProposalCoverSerializer(serializers.ModelSerializer):
    class Meta:
        model =  ProposalCoverPage
        fields = '__all__'