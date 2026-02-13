from django.db import models
from proposals_node.models import Proposal
from program_proposal.models import ProgramProposal

# Create your models here.
class ProjectProposal(models.Model):
   ...
   proposal = models.OneToOneField(Proposal, on_delete=models.CASCADE, related_name="project_proposal")
   program_proposal = models.ForeignKey(
        ProgramProposal,
        on_delete=models.CASCADE,
        related_name="project_proposal"
    )
   program_title = models.CharField(max_length=255, null=True, blank=True)
   project_title = models.CharField(max_length=255, null=True, blank=True)
   activity_title = models.CharField(max_length=255, null=True, blank=True)

   sdg_alignment = models.TextField(null=True, blank=True)
   extension_agenda = models.TextField(null=True, blank=True)

   project_leader = models.CharField(max_length=255, null=True, blank=True)
   members = models.TextField(null=True, blank=True)

   college_campus_program = models.CharField(max_length=255, null=True, blank=True)
   collaborating_agencies = models.CharField(max_length=255, null=True, blank=True)
   community_location = models.CharField(max_length=255, null=True, blank=True)

   target_sector = models.CharField(max_length=255, null=True, blank=True)
   number_of_beneficiaries = models.IntegerField(null=True, blank=True)

   implementation_period = models.CharField(max_length=100, null=True, blank=True)
   total_budget_requested = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

   rationale = models.TextField(null=True, blank=True)
   significance = models.TextField(null=True, blank=True)
   general_objectives = models.TextField(null=True, blank=True)
   specific_objectives = models.TextField(null=True, blank=True)

   methodology = models.JSONField(null=True, blank=True)
   expected_output_6ps = models.JSONField(null=True, blank=True)

   sustainability_plan = models.TextField(null=True, blank=True)
   org_and_staffing_json = models.JSONField(null=True, blank=True)

   activity_schedule_json = models.JSONField(null=True, blank=True)
   budget_breakdown_json = models.JSONField(null=True, blank=True)

   prmsu_participants_count = models.IntegerField(null=True, blank=True)
   partner_agency_participants_count = models.IntegerField(null=True, blank=True)
   trainees_count = models.IntegerField(null=True, blank=True)
   
   def __str__(self):
      return self.program_title