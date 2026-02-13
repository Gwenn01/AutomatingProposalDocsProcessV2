from django.db import models
from proposals_node.models import Proposal
from django.contrib.auth.models import User
# Create your models here.
class ProposalReviewer(models.Model):
    proposal = models.ForeignKey(
        Proposal,
        on_delete=models.CASCADE,
        related_name="assigned_reviewers"
    )

    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)

    assigned_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="assigned_reviewers"
    )
    is_review = models.BooleanField(default=False)
    
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('proposal', 'reviewer')
        
    def __str__(self):
        return f"{self.proposal} - {self.reviewer}"
