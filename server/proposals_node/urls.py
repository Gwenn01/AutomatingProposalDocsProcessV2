from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import (
    ProposalList,
    AdminProposalList,
)

urlpatterns = [
    # user access proposal
    path("proposals-node/<str:proposal_type>/", ProposalList.as_view(), name="proposal-list"),
    # admin access proposal
    path("admin/proposals-node/<str:proposal_type>/", AdminProposalList.as_view(), name="admin-proposal-list"),
]

urlpatterns = format_suffix_patterns(urlpatterns)