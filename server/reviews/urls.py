from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import ProposalReviewList, ProposalReviewDetail, ProposalReviewListByProposal

urlpatterns = [
    path('proposal-review/', ProposalReviewList.as_view(), name='proposal-review-list'),
    path('proposal-review/<int:pk>/', ProposalReviewDetail.as_view(), name='proposal-review-detail'),
    path('proposal-review/proposal/<int:proposal_id>/', ProposalReviewListByProposal.as_view(), name='proposal-review-list-by-proposal'),
]

urlpatterns = format_suffix_patterns(urlpatterns)