from django.db import models
from proposals_node.models import Proposal

# Create your models here.
class ProgramProposal(models.Model):
   ...
   proposal = models.OneToOneField(Proposal, on_delete=models.CASCADE, related_name="program_details")
   # profile 
   program_title = models.CharField(max_length=255, null=True, blank=True)
   program_leader = models.CharField(max_length=255, null=True, blank=True)

    # list of projects
   project_list = models.JSONField(null=True, blank=True)
   
   implementing_agency = models.JSONField(null=True, blank=True)

   cooperating_agencies = models.JSONField(null=True, blank=True)

   extension_sites = models.JSONField(null=True, blank=True)
   
   tags = models.JSONField(null=True, blank=True)
   clusters = models.JSONField(null=True, blank=True)
   agendas = models.JSONField(null=True, blank=True)
   
   sdg_addressed = models.CharField(max_length=255, blank=True, null=True)
   mandated_academic_program = models.CharField(max_length=255, blank=True, null=True)
   
   rationale = models.TextField(null=True, blank=True)
   
   significance = models.TextField(null=True, blank=True)
   
   general_objectives = models.TextField(null=True, blank=True)
   
   specific_objectives = models.TextField(null=True, blank=True)

   methodology = models.JSONField(null=True, blank=True)
   
   expected_output_6ps = models.JSONField(null=True, blank=True)

   sustainability_plan = models.TextField(null=True, blank=True)
   
   org_and_staffing = models.JSONField(null=True, blank=True)

   workplan = models.JSONField(null=True, blank=True)
   
   budget_requirements = models.JSONField(null=True, blank=True)
   
   created_at = models.DateTimeField(auto_now_add=True)
   def __str__(self):
      return self.program_title
   
class ProgramProposalHistory(models.Model):
   ...
   proposal = models.ForeignKey(
        Proposal,
        on_delete=models.CASCADE,
        related_name="program_history"
    )

   version = models.IntegerField()
   # profile 
   program_title = models.CharField(max_length=255, null=True, blank=True)
   program_leader = models.CharField(max_length=255, null=True, blank=True)
   
   # list of projects
   project_list = models.JSONField(null=True, blank=True)
   
   implementing_agency = models.JSONField(null=True, blank=True)

   cooperating_agencies = models.JSONField(null=True, blank=True)

   extension_sites = models.JSONField(null=True, blank=True)
   
   tags = models.JSONField(null=True, blank=True)
   clusters = models.JSONField(null=True, blank=True)
   agendas = models.JSONField(null=True, blank=True)
   
   sdg_addressed = models.CharField(max_length=255, blank=True, null=True)
   mandated_academic_program = models.CharField(max_length=255, blank=True, null=True)
   
   rationale = models.TextField(null=True, blank=True)
   
   significance = models.TextField(null=True, blank=True)
   
   general_objectives = models.TextField(null=True, blank=True)
   
   specific_objectives = models.TextField(null=True, blank=True)

   methodology = models.JSONField(null=True, blank=True)
   
   expected_output_6ps = models.JSONField(null=True, blank=True)

   sustainability_plan = models.TextField(null=True, blank=True)
   
   org_and_staffing = models.JSONField(null=True, blank=True)

   workplan = models.JSONField(null=True, blank=True)
   
   budget_requirements = models.JSONField(null=True, blank=True)
   
   created_at = models.DateTimeField(auto_now_add=True)
   def __str__(self):
      return self.program_title