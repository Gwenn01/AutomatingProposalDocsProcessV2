from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import (
    AssignReviewerView,
    GetAssignedReviewerView,
    UnassignReviewerView,
    ReviewerListView,
    MyAssignedProgramProposalsView,
    MyAssignedProjectProposalsView,
    MyAssignedActivityProposalsView,
    AssignedReviewerProposalView
)

urlpatterns = [
    # admin
    path('assign-reviewer/', AssignReviewerView.as_view(), name='assign-reviewer'),
    path('assigned-reviewer/<int:proposal>/', GetAssignedReviewerView.as_view(), name='assigned-reviewer-detail'),
    path('unassign-reviewer/<int:pk>/', UnassignReviewerView.as_view(), name='unassign-reviewer'),
    path('reviewers/', ReviewerListView.as_view(), name='reviewer-list'),
    
    # reviewer get the proposal 
    path('reviewer-proposals/program/', MyAssignedProgramProposalsView.as_view(), name='reviewer-program-proposal-list'),
    path('reviewer-proposals/project/<int:program_id>/', MyAssignedProjectProposalsView.as_view(), name='reviewer-project-proposal-list'),
    path('reviewer-proposals/activity/<int:project_id>/', MyAssignedActivityProposalsView.as_view(), name='reviewer-activity-proposal-list'),
    
    # general get the list of assigned reviewers for a proposal
    path('reviewer-proposal-list/<int:proposal_id>/', AssignedReviewerProposalView.as_view(), name='assigned-reviewer-proposal-list'),
]

urlpatterns = format_suffix_patterns(urlpatterns)