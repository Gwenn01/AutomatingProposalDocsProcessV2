from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import ProposalReviewList, ProposalReviewDetail

urlpatterns = [
    path('proposal-review/', ProposalReviewList.as_view(), name='proposal-review-list'),
    path('proposal-review/<int:pk>/', ProposalReviewDetail.as_view(), name='proposal-review-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)