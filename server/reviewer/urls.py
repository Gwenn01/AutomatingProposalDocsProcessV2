from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import (
    AssignReviewerView, 
    ReviewerListView,
    ReviewerProposalList,
)

urlpatterns = [
    path('assign-reviewer/', AssignReviewerView.as_view(), name='assign-reviewer'),
    path('reviewers/', ReviewerListView.as_view(), name='reviewer-list'),
    path('reviewer-proposals/', ReviewerProposalList.as_view(), name='reviewer-proposal-list'),
]

urlpatterns = format_suffix_patterns(urlpatterns)