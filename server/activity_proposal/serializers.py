from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import ActivityProposal
from proposals_node.models import Proposal
from project_proposal.models import ProjectProposal
from activity_proposal.models import ActivityProposal, ActivityProposalHistory

class ActivityProposalSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ActivityProposal
        fields = "__all__" 
        

class ActivityProposalUpdateSaveHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityProposal
        fields = "__all__" 
        
    @transaction.atomic
    def update(self, instance, validated_data):
        title = validated_data.pop('title')
        
        latest_version = (
            ActivityProposalHistory.objects
            .filter(proposal=instance.proposal)
            .order_by("-version")
            .first()
        )
        next_version = 1 if not latest_version else latest_version.version + 1
        
        ActivityProposalHistory.objects.create(
            proposal=instance.proposal,
            version=next_version,

            activity_title=instance.activity_title,
            project_leader=instance.project_leader,
            members=instance.members,
            activity_duration_hours=instance.activity_duration_hours,
            activity_date=instance.activity_date,
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
            objectives_of_activity=instance.objectives_of_activity,
            methodology=instance.methodology,
            expected_output_6ps=instance.expected_output_6ps,
            sustainability_plan=instance.sustainability_plan,
            org_and_staffing=instance.org_and_staffing,
            plan_of_activity=instance.plan_of_activity,
            budget_requirements=instance.budget_requirements,
        )
        # rename the title form parent and save the version on the parent node
        if title:
            instance.proposal.title = title
        instance.proposal.version_no = next_version
        instance.proposal.save()
        
         # save the updated  
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance
        
class ActivityListDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityProposal
        fields = ['id', 'activity_title', 'project_leader', 'members', 'activity_duration_hours', 'activity_date']