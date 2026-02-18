from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import (
    AssignReviewerView, 
    ReviewerListView,
    ReviewerProposalList,
    AssignedReviewerProposalDetails
)

urlpatterns = [
    # admin
    path('assign-reviewer/', AssignReviewerView.as_view(), name='assign-reviewer'),
    path('reviewers/', ReviewerListView.as_view(), name='reviewer-list'),
    
    # reviewer get the proposal 
    path('reviewer-proposals/', ReviewerProposalList.as_view(), name='reviewer-proposal-list'),
    
    # general get the list of assigned reviewers for a proposal
    path('reviewer-proposal-list/<int:proposal_id>/', AssignedReviewerProposalDetails.as_view(), name='assigned-reviewer-proposal-list'),
]

urlpatterns = format_suffix_patterns(urlpatterns)