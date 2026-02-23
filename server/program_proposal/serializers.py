from rest_framework import serializers
from proposals_node.models import Proposal
from .models import ProgramProposal
from project_proposal.models import ProjectProposal

from proposals_node.serializers import ProposalSerializer
from project_proposal.serializers import (
    ProjectsListDataSerializer
)

class ProgramProposalSerializer(serializers.ModelSerializer):
     # fields that belong to Proposal
    title = serializers.CharField(write_only=True)
    proposal = serializers.PrimaryKeyRelatedField(read_only=True)

    project_list = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False
    )
    # proposal_node = ProposalSerializer(source='proposal', read_only=True)
    class Meta:
        model = ProgramProposal
        fields = '__all__'
    
    def validate(self, data):
        title = data.get("title")
        program_title = data.get("program_title")

        if not title:
            raise serializers.ValidationError({"title": "This field is required."})

        # if ProgramProposal.objects.filter(
        #     program_title=program_title,
        # ).exists():
        #     raise serializers.ValidationError({
        #         "duplicate": "This program already exists on this date"
        #     })
        return data
    
    def create(self, validated_data):
        # remove non-model fields first
        project_list = validated_data.pop("project_list", [])
        
        # extract proposal fields
        title = validated_data.pop("title")
        request = self.context["request"]
        user = request.user
        
        # create root proposal to program proposal
        proposal = Proposal.objects.create(
            user=user,
            title=title,
            proposal_type='Program',
        )
        # create program proposal
        program_proposal = ProgramProposal.objects.create(
            proposal=proposal,
            project_list=project_list,
            **validated_data
        )
        # loop through project list and create project proposal root on it
        for project in project_list:
            project_proposal_root = Proposal.objects.create(
                user=user,
                title=project.get("project_title"),
                proposal_type="Project"
            )
            ProjectProposal.objects.create(
                proposal=project_proposal_root,
                program_proposal=program_proposal,
                project_title=project.get("project_title"),
                project_leader=project.get("project_leader"),
                members=project.get("project_member", []),
                duration_months=project.get("project_duration"),
                start_date=project.get("project_start_date"),
                end_date=project.get("project_end_date"),
            )
        return program_proposal  

# get the list of project 
class ProgramProjectsSerializer(serializers.ModelSerializer):
    projects = ProjectsListDataSerializer(many=True, read_only=True)
    class Meta:
        model = ProgramProposal
        fields = ["id", "program_title", "projects"]

    

        