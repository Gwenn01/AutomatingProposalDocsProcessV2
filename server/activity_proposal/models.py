from django.db import models
from proposals_node.models import Proposal
from project_proposal.models import ProjectProposal

# Create your models here.
class ActivityProposal(models.Model):
   ...
   proposal = models.OneToOneField(Proposal, on_delete=models.CASCADE, related_name="activity_details")
   project_proposal = models.ForeignKey(
        ProjectProposal,
        on_delete=models.CASCADE,
        related_name="activities"
    )
   #profile
   activity_title = models.CharField(max_length=255)

   project_leader = models.CharField(max_length=255, null=True, blank=True)

   members = models.JSONField(default=list, blank=True)

   activity_duration_hours = models.IntegerField(null=True, blank=True)

   activity_date = models.DateField(null=True, blank=True)
   
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
   
   objectives_of_activity = models.TextField(null=True, blank=True)

   methodology = models.CharField(max_length=255, null=True, blank=True)
   
   expected_output_6ps = models.JSONField(null=True, blank=True)

   sustainability_plan = models.TextField(null=True, blank=True)
   
   org_and_staffing = models.JSONField(null=True, blank=True)

   plan_of_activity = models.JSONField(null=True, blank=True)
   
   budget_requirements = models.JSONField(null=True, blank=True)
   
   created_at = models.DateTimeField(auto_now_add=True)
   
   def __str__(self):
      return self.activity_title