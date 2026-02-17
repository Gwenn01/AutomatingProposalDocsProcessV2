from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import ProposalReviewerViewSet

urlpatterns = [
    path('assign-reviewer/', ProposalReviewerViewSet.as_view(), name='assign-reviewer'),
]

urlpatterns = format_suffix_patterns(urlpatterns)