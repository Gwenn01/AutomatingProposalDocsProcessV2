from rest_framework import serializers
from .models import Proposal

class ProposalSerializer(serializers.ModelSerializer):
    
    child_id = serializers.SerializerMethodField()
    
    class Meta:
        model = Proposal
        fields = '__all__'
        extra_fields = ['child_id']
        
    def get_child_id(self, obj):

        if obj.proposal_type == "Program" and hasattr(obj, 'program_details'):
            return obj.program_details.id

        if obj.proposal_type == "Project" and hasattr(obj, 'project_details'):
            return obj.project_details.id

        if obj.proposal_type == "Activity" and hasattr(obj, 'activity_details'):
            return obj.activity_details.id

        return None