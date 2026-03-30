from django.db import models

from django.contrib.auth.models import User
# Create your models here.

class Proposal(models.Model):

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('for_review', 'For Review'),
        ('under_review', 'Under Review'),
        ('for_revision', 'For Revision'),
        ('for_approval', 'For Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    PROPOSAL_TYPE_CHOICES = [
        ('Program', 'Program'),
        ('Project', 'Project'),
        ('Activity', 'Activity'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="proposals")
    title = models.CharField(max_length=255)
    file_path = models.CharField(max_length=255, null=True, blank=True)
    proposal_type = models.CharField(
        max_length=20,
        choices=PROPOSAL_TYPE_CHOICES,
        null=True,
        blank=True
    ) 
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    progress = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )
    budget_approved = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True, default=0)
    version_no = models.IntegerField(default=1)
    trigger_review_reset = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class YearConfig(models.Model):
    year = models.IntegerField()
    total_budget = models.DecimalField(   max_digits=12, decimal_places=2, default=0)
    used_budget = models.DecimalField(  max_digits=12, decimal_places=2, default=0)
    is_locked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.year)
