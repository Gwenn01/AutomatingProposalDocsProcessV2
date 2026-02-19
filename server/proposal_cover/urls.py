from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import ProposalCoverList, ProposalCoverDetail

urlpatterns = [
    path('proposal-cover/', ProposalCoverList.as_view(), name='proposal-cover-list'),
    path('proposal-cover/<int:pk>/', ProposalCoverDetail.as_view(), name='proposal-cover-detail'),
]
urlpatterns = format_suffix_patterns(urlpatterns)