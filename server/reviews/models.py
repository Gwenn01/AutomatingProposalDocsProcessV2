from django.db import models
from reviewer.models import ProposalReviewer
from proposals_node.models import Proposal

class ProposalReview(models.Model):

    # ---------- Decision ----------
    DECISION_CHOICES = [
        ('pending', 'Pending'),
        ('needs_revision', 'Needs Revision'),
        ('approved', 'Approved'),
    ]

    PROPOSAL_TYPE_CHOICES = [
        ('Program', 'Program'),
        ('Project', 'Project'),
        ('Activity', 'Activity'),
    ]

    # ---------- Relations ----------
    proposal_reviewer = models.ForeignKey(
        ProposalReviewer,
        on_delete=models.CASCADE,
        related_name="proposal_reviewer"
    )
    proposal_node = models.ForeignKey(
        Proposal,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    # ---------- General Review ----------
    decision = models.CharField(
        max_length=20,
        choices=DECISION_CHOICES,
        default="pending"
    )
   
    # ---------- Review Info ----------
    review_round = models.CharField(
        max_length=10,
        null=True,
        blank=True
    )

    proposal_type = models.CharField(
        max_length=20,
        choices=PROPOSAL_TYPE_CHOICES,
        null=True,
        blank=True
    )

    # ---------- Section Feedback ----------
    profile_feedback = models.TextField(null=True, blank=True)
    
    implementing_agency_feedback = models.TextField(null=True, blank=True)
    
    extension_site_feedback = models.TextField(null=True, blank=True)
    
    tagging_cluster_extension_feedback = models.TextField(null=True, blank=True)
    
    sdg_academic_program_feedback = models.TextField(null=True, blank=True)
    
    rationale_feedback = models.TextField(null=True, blank=True)
    
    significance_feedback = models.TextField(null=True, blank=True)
    
    objectives_feedback = models.TextField(null=True, blank=True)
    
    general_objectives_feedback = models.TextField(null=True, blank=True)
    
    specific_objectives_feedback = models.TextField(null=True, blank=True)
    
    methodology_feedback = models.TextField(null=True, blank=True)
    
    expected_output_feedback = models.TextField(null=True, blank=True)
    
    sustainability_plan_feedback = models.TextField(null=True, blank=True)
    
    org_staffing_feedback = models.TextField(null=True, blank=True)
    
    work_plan_feedback = models.TextField(null=True, blank=True)
    
    budget_requirements_feedback = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review {self.review_round}"
