from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import ProjectProposal, ProjectProposalHistory
from proposals_node.models import Proposal
from program_proposal.models import ProgramProposal
from activity_proposal.models import ActivityProposal
from activity_proposal.serializers import ActivityListDataSerializer

class ProjectProposalSerializer(serializers.ModelSerializer):

    activity_list = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = ProjectProposal
        fields = '__all__'

    def update(self, instance, validated_data):
        activity_list = validated_data.pop('activity_list', [])

        request = self.context["request"]
        user = request.user

        # update normal project fields first
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # instance == project_proposal
        project_proposal = instance

        # create activities
        for activity in activity_list:
            activity_proposal_root = Proposal.objects.create(
                user=user,
                title=activity.get("activity_title"),
                proposal_type="Activity"
            )

            ActivityProposal.objects.create(
                proposal=activity_proposal_root,
                project_proposal=project_proposal,  # ← HERE
                activity_title=activity.get("activity_title"),
                project_leader=activity.get("project_leader"),
                members=activity.get("project_member", []),
                activity_duration_hours=activity.get("activity_duration"),
                activity_date=activity.get("activity_date"),
            )

        return instance
    
# implementor update the project proposal after reviews and save the history
class ProjectProposalUpdateSaveHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectProposal
        fields = "__all__"
       
    @transaction.atomic 
    def update(self, instance, validated_data):
        ...
        activity_list = validated_data.pop("activity_list", [])
        title = validated_data.pop("title")
        
        # calculate the version first
        latest_version = (
            ProjectProposalHistory.objects
            .filter(proposal=instance.proposal)
            .order_by("-version")
            .first()
        )
        next_version = 1 if not latest_version else latest_version.version + 1
       
        # dave the current project before updating it
        ProjectProposalHistory.objects.create(
            proposal=instance.proposal,
            version=next_version,

            project_title=instance.program_title,
            project_leader=instance.program_leader,
            members= instance.members,
            duration_months= instance.duration_months,
            start_date= instance.start_date,
            end_date= instance.end_date,
            activity_list= instance.activity_list,
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
        # rename the title form parent and save the version on the parent node
        if title:
            instance.proposal.title = title
         
        instance.proposal.version_no = next_version
        instance.proposal.save()
           
        # save the updated  
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # save the optional update of activity list 
        if activity_list:
            instance.activity_list.set(activity_list)
        return instance
        
        
# serializer for the data need in program proposal list
class ProjectsListDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectProposal
        fields = ['id', 'project_title', 'project_leader', 'members', 'duration_months', 'start_date', 'end_date']
   
# serializer to get the activities list
class ProjectActivitiesSerializer(serializers.ModelSerializer):
    activities = ActivityListDataSerializer(many=True, read_only=True)
    class Meta:
        model = ProjectProposal
        fields = ['id', 'project_title', 'activities']