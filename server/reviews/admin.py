from django.contrib import admin
from .models import ProposalReview
from .models import ProposalReviewHistory

admin.site.register(ProposalReview)
admin.site.register(ProposalReviewHistory)
# Register your models here.
