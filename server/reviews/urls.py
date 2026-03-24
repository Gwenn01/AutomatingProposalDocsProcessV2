from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import (
    ProposalReviewList,
    ProposalReviewDetail,
    ProposalReviewByProposal,
    ProposalReviewHistoryByProposalHistory,
    ProposalReviewUpdate
)

urlpatterns = [
    path("proposal-review/", ProposalReviewList.as_view(), name="proposal-review-list"),
    
    path("proposal-review/<int:proposal>/", ProposalReviewDetail.as_view(), name="proposal-review-detail"),
    
    path(
        "proposal-review/proposal/<int:proposal_id>/<str:proposal_type>/",
        ProposalReviewByProposal.as_view(),
        name="proposal-review-by-proposal",
    ),
    
    path(
        "proposal-review/proposal-history/<int:proposal_id>/<int:history_id>/<int:version>/<str:proposal_type>/",
        ProposalReviewHistoryByProposalHistory.as_view(),
        name="proposal-review-history-by-proposal-history",
    ),
    path("proposal-review-update/<int:proposal>/<int:assignment>/", ProposalReviewUpdate.as_view(), name="proposal-review-update"),
]

urlpatterns = format_suffix_patterns(urlpatterns)