from django.db import models
from proposals_node.models import Proposal
from program_proposal.models import ProgramProposal
from program_proposal.models import ProgramProposalHistory

# Create your models here.
class ProjectProposal(models.Model):
   ...
   proposal = models.OneToOneField(Proposal, on_delete=models.CASCADE, related_name="project_details")
   program_proposal = models.ForeignKey(
        ProgramProposal,
        on_delete=models.CASCADE,
        related_name="projects"
    )
   #profile
   project_title = models.CharField(max_length=255, null=True, blank=True)
   project_leader = models.CharField(max_length=255, null=True, blank=True)
   members = models.JSONField(null=True, blank=True)
   duration_months = models.IntegerField(null=True, blank=True)
   start_date = models.DateField(null=True, blank=True)
   end_date = models.DateField(null=True, blank=True)
   
   # agencies
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
      return self.project_title
   

class ProjectProposalHistory(models.Model):
   ...
   proposal = models.ForeignKey(Proposal, on_delete=models.CASCADE, related_name="project_history")
   program_proposal_history = models.ForeignKey(
        ProgramProposalHistory,
        on_delete=models.CASCADE,
        related_name="projects_history"
    )
   #profile
   project_title = models.CharField(max_length=255, null=True, blank=True)
   project_leader = models.CharField(max_length=255, null=True, blank=True)
   members = models.JSONField(null=True, blank=True)
   duration_months = models.IntegerField(null=True, blank=True)
   start_date = models.DateField(null=True, blank=True)
   end_date = models.DateField(null=True, blank=True)
   
   # agencies
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
      return self.project_title