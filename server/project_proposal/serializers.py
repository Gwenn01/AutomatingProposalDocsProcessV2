from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import ProjectProposal
from proposals_node.models import Proposal
from program_proposal.models import ProgramProposal

class ProjectProposalSerializer(serializers.ModelSerializer):
    
    title = serializers.CharField(write_only=True)
    program_proposal_id = serializers.IntegerField(write_only=True)
    
    proposal = serializers.PrimaryKeyRelatedField(read_only=True)
    program_proposal = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = ProjectProposal
        fields = '__all__'
    
    def validate(self, data):
        title = data.get("title")
        program_proposal_id = data.get("program_proposal_id")
        project_title = data.get("project_title")
        
        if not title:
            raise serializers.ValidationError({"title": "This field is required."})
        
        if not program_proposal_id:
            raise serializers.ValidationError({"program_proposal_id": "This field is required."})
        
        try:
            program_proposal = ProgramProposal.objects.get(id=program_proposal_id)
        except ProgramProposal.DoesNotExist:
            raise ValidationError({"program_proposal_id": "Program Proposal does not exist"})
        
        if ProjectProposal.objects.filter(
            program_proposal=program_proposal,
            project_title=project_title,
        ).exists():
            raise ValidationError({
                "duplicate": "This project already exists for this program on this date"
            })
        return data
        
        
    def create(self, validated_data):
        # extract proposal fields
        title = validated_data.pop("title")
        program_proposal_id = validated_data.pop("program_proposal_id")
    
        request = self.context["request"]
        user = request.user
        
        # create proposal
        proposal = Proposal.objects.create(title=title, user=user, proposal_type="Project")

        # create program proposal
        try:
            program_proposal = ProgramProposal.objects.get(id=program_proposal_id)
        except ProgramProposal.DoesNotExist:
            raise serializers.ValidationError("Program Proposal does not exist.")
        
        project = ProjectProposal.objects.create(proposal=proposal, program_proposal=program_proposal, **validated_data)
        
        return project

class ProjectsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectProposal
        fields = ['id', 'project_title', 'project_leader']