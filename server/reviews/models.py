from django.db import models
from reviewer.models import ProposalReviewer
class ProposalReview(models.Model):

    # ---------- Decision ----------
    DECISION_CHOICES = [
        ('pending', 'Pending'),
        ('needs_revision', 'Needs Revision'),
        ('approved', 'Approved'),
    ]

    REVIEW_ROUND_CHOICES = [
        ('1st', '1st Review'),
        ('2nd', '2nd Review'),
        ('3rd', '3rd Review'),
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

    # ---------- General Review ----------
    decision = models.CharField(
        max_length=20,
        choices=DECISION_CHOICES,
        default="pending"
    )
   
    # ---------- Review Info ----------
    review_round = models.CharField(
        max_length=10,
        choices=REVIEW_ROUND_CHOICES,
        default='1st'
    )

    proposal_type = models.CharField(
        max_length=20,
        choices=PROPOSAL_TYPE_CHOICES,
        null=True,
        blank=True
    )

    source_of_fund = models.TextField(null=True, blank=True)

    # ---------- Section Feedback ----------
    project_profile_feedback = models.TextField(null=True, blank=True)
    rationale_feedback = models.TextField(null=True, blank=True)
    significance_feedback = models.TextField(null=True, blank=True)
    general_objectives_feedback = models.TextField(null=True, blank=True)
    specific_objectives_feedback = models.TextField(null=True, blank=True)
    methodology_feedback = models.TextField(null=True, blank=True)
    expected_output_feedback = models.TextField(null=True, blank=True)
    potential_impact_feedback = models.TextField(null=True, blank=True)
    sustainability_plan_feedback = models.TextField(null=True, blank=True)
    org_staffing_feedback = models.TextField(null=True, blank=True)
    work_financial_plan_feedback = models.TextField(null=True, blank=True)
    budget_summary_feedback = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Review {self.id} - {self.proposal} - {self.user}"
