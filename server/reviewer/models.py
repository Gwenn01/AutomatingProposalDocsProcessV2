from django.db import models
from proposals_node.models import Proposal
from django.contrib.auth.models import User
# Create your models here.
class ProposalReviewer(models.Model):
    DECISION_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('revision', 'Revision Required'),
    ]
    PROPOSAL_TYPE_CHOICES = [
        ('program', 'Program'),
        ('project', 'Project'),
        ('activity', 'Activity'),
    ]
    
    proposal = models.ForeignKey(
        Proposal,
        on_delete=models.CASCADE,
        related_name="assigned_reviewers"
    )
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="assigned_proposals")
    assigned_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="reviewers_assigned"
    )
    is_review = models.BooleanField(default=False)
    proposal_type = models.CharField(max_length=100, choices=PROPOSAL_TYPE_CHOICES, default='program')
    decision = models.CharField(choices=DECISION_CHOICES, default='pending', max_length=20)
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['proposal', 'reviewer'], name='unique_proposal_reviewer')
        ]

        
    def __str__(self):
        return f"{self.proposal} - {self.reviewer}"
