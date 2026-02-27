from django.db import transaction
from rest_framework import serializers
from proposals_node.models import Proposal
from .models import (
    ProgramProposal,
    ProgramProposalHistory
)
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

    @transaction.atomic
    def update(self, instance, validated_data):
        project_list = validated_data.pop("project_list", None)
        title = validated_data.pop("title", None)

        # ---------------------------------------
        # STEP 1: Get next version number safely
        # ---------------------------------------
        latest_version = (
            ProgramProposalHistory.objects
            .filter(proposal=instance.proposal)
            .order_by("-version")
            .first()
        )

        next_version = 1 if not latest_version else latest_version.version + 1

        # ---------------------------------------
        # STEP 2: Save CURRENT data into history
        # ---------------------------------------
        ProgramProposalHistory.objects.create(
            proposal=instance.proposal,
            version=next_version,

            program_title=instance.program_title,
            program_leader=instance.program_leader,
            project_list=project_list,
            implementing_agency=instance.implementing_agency,
            cooperating_agencies=instance.cooperating_agencies,
            extension_sites=instance.extension_sites,
            tags=instance.tags,
            clusters=instance.clusters,
            agendas=instance.agendas,
            sdg_addressed=instance.sdg_addressed,
            mandated_academic_program=instance.mandated_academic_program,
            rationale=instance.rationale,
            significance=instance.significance,
            general_objectives=instance.general_objectives,
            specific_objectives=instance.specific_objectives,
            methodology=instance.methodology,
            expected_output_6ps=instance.expected_output_6ps,
            sustainability_plan=instance.sustainability_plan,
            org_and_staffing=instance.org_and_staffing,
            workplan=instance.workplan,
            budget_requirements=instance.budget_requirements,
        )

        # ---------------------------------------
        # STEP 3: Update root Proposal
        # ---------------------------------------
        if title:
            instance.proposal.title = title

        # FIXED  remove +1 (it was wrong before)
        instance.proposal.version_no = next_version
        instance.proposal.save()

        # ---------------------------------------
        # STEP 4: Update ProgramProposal fields
        # ---------------------------------------
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        # ---------------------------------------
        # STEP 5: Update project list safely
        # ---------------------------------------
        # if project_list is not None:
        #     instance.project_list = project_list

        return instance

# get the list of project 
class ProgramProjectsSerializer(serializers.ModelSerializer):
    projects = ProjectsListDataSerializer(many=True, read_only=True)
    class Meta:
        model = ProgramProposal
        fields = ["id", "program_title", "projects"]


# proposal history list
class ProgramProposalHistoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramProposalHistory
        fields = ["id", "version", "program_title", "program_leader"]
    
class ProgramProposalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramProposalHistory
        fields = "__all__"
        