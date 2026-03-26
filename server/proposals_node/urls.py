from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import (
    ProposalList,
    AdminProposalList,
    AdminOverviewView,
    AdminYearConfigView,
    AdminSetImplementorProposalBudgetView,
    ReviewerApproveProposalView
)

urlpatterns = [
    # user access proposal
    path("proposals-node/<str:proposal_type>/", ProposalList.as_view(), name="proposal-list"),
    # reviewer access proposal
    path("reviewer-approve/<int:proposal_id>/", ReviewerApproveProposalView.as_view(), name="reviewer-approve-proposal"),
    # admin access proposal
    path("admin/proposals-node/<str:proposal_type>/", AdminProposalList.as_view(), name="admin-proposal-list"),
    path("admin/overview-proposals/<int:year>/", AdminOverviewView.as_view(), name="admin-overview"),
    path("admin/set-year-config/",  AdminYearConfigView.as_view(), name="admin-set-year-config"),
    path("admin/get-year-config/<int:year>/",  AdminYearConfigView.as_view(), name="admin-get-year-config"),
    path("admin/set-proposal-budget/<int:proposal_id>/<int:budget>/",  AdminSetImplementorProposalBudgetView.as_view(), name="admin-set-implementor-proposal-budget"),
]

urlpatterns = format_suffix_patterns(urlpatterns)