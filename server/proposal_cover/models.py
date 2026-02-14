from django.db import models
from proposals_node.models import Proposal
# Create your models here.
class ProposalCoverPage(models.Model):

    proposal = models.OneToOneField(Proposal, on_delete=models.CASCADE, related_name="cover_details")
    cover_page_body = models.TextField(null=True, blank=True)
    submission_date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.proposal.title} cover page"
