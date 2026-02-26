from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from proposals_node.models import Proposal
from reviews.models import ProposalReview, ProposalReviewHistory


@receiver(post_save, sender=Proposal)
def move_reviews_to_history(sender, instance, created, **kwargs):

    # If newly created proposal → do nothing
    if created:
        return

    # Get all reviews for this proposal
    reviews = ProposalReview.objects.filter(proposal_node=instance)

    for review in reviews:

        # Skip if review is already empty (avoid duplicate history entries)
        if not any([
            review.profile_feedback,
            review.implementing_agency_feedback,
            review.extension_site_feedback,
            review.tagging_cluster_extension_feedback,
            review.sdg_academic_program_feedback,
            review.rationale_feedback,
            review.significance_feedback,
            review.general_objectives_feedback,
            review.specific_objectives_feedback,
            review.methodology_feedback,
            review.expected_output_feedback,
            review.sustainability_plan_feedback,
            review.org_staffing_feedback,
            review.work_plan_feedback,
            review.budget_requirements_feedback,
        ]):
            continue

        #  Count existing history correctly
        history_count = ProposalReviewHistory.objects.filter(
            proposal_node=review.proposal_node
        ).count()

        new_round = history_count + 1

        # 1️⃣ Create history record
        ProposalReviewHistory.objects.create(
            proposal_node=review.proposal_node,
            review_round=new_round,
            profile_feedback=review.profile_feedback,
            implementing_agency_feedback=review.implementing_agency_feedback,
            extension_site_feedback=review.extension_site_feedback,
            tagging_cluster_extension_feedback=review.tagging_cluster_extension_feedback,
            sdg_academic_program_feedback=review.sdg_academic_program_feedback,
            rationale_feedback=review.rationale_feedback,
            significance_feedback=review.significance_feedback,
            general_objectives_feedback=review.general_objectives_feedback,
            specific_objectives_feedback=review.specific_objectives_feedback,
            methodology_feedback=review.methodology_feedback,
            expected_output_feedback=review.expected_output_feedback,
            sustainability_plan_feedback=review.sustainability_plan_feedback,
            org_staffing_feedback=review.org_staffing_feedback,
            work_plan_feedback=review.work_plan_feedback,
            budget_requirements_feedback=review.budget_requirements_feedback,
        )

        # 2️⃣ Clear current review fields
        review.profile_feedback = None
        review.implementing_agency_feedback = None
        review.extension_site_feedback = None
        review.tagging_cluster_extension_feedback = None
        review.sdg_academic_program_feedback = None
        review.rationale_feedback = None
        review.significance_feedback = None
        review.general_objectives_feedback = None
        review.specific_objectives_feedback = None
        review.methodology_feedback = None
        review.expected_output_feedback = None
        review.sustainability_plan_feedback = None
        review.org_staffing_feedback = None
        review.work_plan_feedback = None
        review.budget_requirements_feedback = None

        review.save()