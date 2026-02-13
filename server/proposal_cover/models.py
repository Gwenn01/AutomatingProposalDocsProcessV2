from django.db import models
from proposals_node.models import Proposal
# Create your models here.
class ProposalCoverPage(models.Model):

    proposal = models.OneToOneField(Proposal, on_delete=models.CASCADE, related_name="cover")

    submission_date = models.DateField(null=True, blank=True)

    board_resolution_title = models.TextField(null=True, blank=True)
    board_resolution_no = models.CharField(max_length=100, default="Resolution No. 1436, s. 2025")

    approved_budget_words = models.TextField(null=True, blank=True)
    approved_budget_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    duration_words = models.CharField(max_length=255, null=True, blank=True)
    duration_years = models.IntegerField(null=True, blank=True)
    date_from_to = models.CharField(max_length=100, null=True, blank=True)

    activity_title = models.CharField(max_length=255, null=True, blank=True)
    activity_date = models.CharField(max_length=100, null=True, blank=True)
    activity_venue = models.CharField(max_length=255, null=True, blank=True)

    activity_value_statement = models.TextField(null=True, blank=True)
    requested_activity_budget = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    prmsu_participants_words = models.CharField(max_length=255, null=True, blank=True)
    prmsu_participants_num = models.IntegerField(null=True, blank=True)

    partner_agency_participants_words = models.CharField(max_length=255, null=True, blank=True)
    partner_agency_participants_num = models.IntegerField(null=True, blank=True)
    partner_agency_name = models.CharField(max_length=255, null=True, blank=True)

    trainees_words = models.CharField(max_length=255, null=True, blank=True)
    trainees_num = models.IntegerField(null=True, blank=True)
