from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import ProposalList

urlpatterns = [
    path("proposals-node/", ProposalList.as_view(), name="proposal-list"),
]

urlpatterns = format_suffix_patterns(urlpatterns)