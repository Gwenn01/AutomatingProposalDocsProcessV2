from django.shortcuts import get_object_or_404

# app
from .models import ProposalReview
from proposals_node.models import Proposal
from program_proposal.models import ProgramProposal
from project_proposal.models import ProjectProposal
from activity_proposal.models import ActivityProposal


class ProposalReviewSelectors:
    # Return QuerySet (NOT dict)
    @staticmethod
    def get_reviews_queryset(proposal):
        return ProposalReview.objects.select_related(
            "proposal_reviewer__reviewer__profile"
        ).filter(proposal_node=proposal)

    @staticmethod
    def get_proposal(proposal_id):
        return get_object_or_404(Proposal, pk=proposal_id)

    @staticmethod
    def get_program_proposal(proposal):
        return get_object_or_404(ProgramProposal, proposal=proposal)

    @staticmethod
    def get_project_proposal(proposal):
        return get_object_or_404(ProjectProposal, proposal=proposal)

    @staticmethod
    def get_activity_proposal(proposal):
        return get_object_or_404(ActivityProposal, proposal=proposal)

    @staticmethod
    def proposal_type(proposal, proposal_type):
        if proposal_type == 'program':
            return ProposalReviewSelectors.get_program_proposal(proposal)
        elif proposal_type == 'project':
            return ProposalReviewSelectors.get_project_proposal(proposal)
        elif proposal_type == 'activity':
            return ProposalReviewSelectors.get_activity_proposal(proposal)
        else:
            raise ValueError('Invalid proposal type')

    @staticmethod
    def get_review_per_docs_proposal_mapper(program_proposal, proposal_reviews_queryset):
        
        review_for_profile = []
        review_for_implementing_agency = []
        review_for_extension_site = []
        review_for_tagging_cluster_extension = []
        review_for_sdg_academic_program = []
        review_for_rationale = []
        review_for_significance = []
        review_for_general_objectives = []
        review_for_specific_objectives = []
        review_for_methodology = []
        review_for_expected_output_6ps = []
        review_for_sustainability_plan = []
        review_for_org_and_staffing = []
        review_for_work_plan = []
        review_for_budget = []

        for r in proposal_reviews_queryset:
            reviewer_name = r.proposal_reviewer.reviewer.profile.name
            
            review_for_profile.append({
                "reviewer_name": reviewer_name,
                "comment": r.profile_feedback,
            })

            review_for_implementing_agency.append({
                "reviewer_name": reviewer_name,
                "comment": r.implementing_agency_feedback,
            })

            review_for_extension_site.append({
                "reviewer_name": reviewer_name,
                "comment": r.extension_site_feedback,
            })
            
            review_for_tagging_cluster_extension.append({
                "reviewer_name": reviewer_name,
                "comment": r.tagging_cluster_extension_feedback,
            })
            
            review_for_sdg_academic_program.append({
                "reviewer_name": reviewer_name,
                "comment": r.sdg_academic_program_feedback,
            })

            review_for_rationale.append({
                "reviewer_name": reviewer_name,
                "comment": r.rationale_feedback,
            })

            review_for_significance.append({
                "reviewer_name": reviewer_name,
                "comment": r.significance_feedback,
            })

            review_for_general_objectives.append({
                "reviewer_name": reviewer_name,
                "comment": r.general_objectives_feedback,
            })

            review_for_specific_objectives.append({
                "reviewer_name": reviewer_name,
                "comment": r.specific_objectives_feedback,
            })

            review_for_methodology.append({
                "reviewer_name": reviewer_name,
                "comment": r.methodology_feedback,
            })

            review_for_expected_output_6ps.append({
                "reviewer_name": reviewer_name,
                "comment": r.expected_output_feedback,
            })

            review_for_sustainability_plan.append({
                "reviewer_name": reviewer_name,
                "comment": r.sustainability_plan_feedback,
            })

            review_for_org_and_staffing.append({
                "reviewer_name": reviewer_name,
                "comment": r.org_staffing_feedback,
            })

            review_for_work_plan.append({
                "reviewer_name": reviewer_name,
                "comment": r.work_plan_feedback,
            })

            review_for_budget.append({
                "reviewer_name": reviewer_name,
                "comment": r.budget_requirements_feedback,
            })

        return {
            "program_title": program_proposal.program_title,
            
            "profile": {
                "program_title": program_proposal.program_title,
                "program_leader": program_proposal.program_leader,
                "project_list": program_proposal.project_list,
                "reviews": review_for_profile,
            },
            
            "agencies": {
                "implementing_agency": program_proposal.implementing_agency,
                "cooperating_agency": program_proposal.cooperating_agencies,
                "reviews": review_for_implementing_agency
            },
            
            "tagging_clustering_extension": {
                "tags": program_proposal.tags,
                "clusters": program_proposal.clusters,
                "agendas": program_proposal.agendas,
                "reviews": review_for_tagging_cluster_extension
            },
            
            "rationale": {
                "content": program_proposal.rationale,
                "reviews": review_for_rationale
            },

            "significance": {
                "content": program_proposal.significance,
                "reviews": review_for_significance
            },

            "objectives": {
                "general": program_proposal.general_objectives,
                "reviews_general": review_for_general_objectives,
                "specific": program_proposal.specific_objectives,
                "reviews_specific": review_for_specific_objectives,
            },

            "methodology": {
                "content": program_proposal.methodology,
                "reviews": review_for_methodology
            },

            "expected_output_6ps": {
                "content": program_proposal.expected_output_6ps,
                "reviews": review_for_expected_output_6ps
            },

            "sustainability_plan": {
                "content": program_proposal.sustainability_plan,
                "reviews": review_for_sustainability_plan
            },

            "organization_and_staffing": {
                "content": program_proposal.org_and_staffing,
                "reviews": review_for_org_and_staffing
            },

            "work_plan": {
                "content": program_proposal.workplan,
                "reviews": review_for_work_plan
            },

            "budget_requirements": {
                "content": program_proposal.budget_requirements,
                "reviews": review_for_budget
            }
        }

    @staticmethod
    def proposal_reviews_mapper(proposal_id, proposal_type):
        proposal = ProposalReviewSelectors.get_proposal(proposal_id)
        proposal_content = ProposalReviewSelectors.proposal_type(proposal, proposal_type)

        #Now returns queryset (correct type)
        proposal_reviews_queryset = ProposalReviewSelectors.get_reviews_queryset(proposal)
        return ProposalReviewSelectors.get_review_per_docs_proposal_mapper(
            proposal_content,
            proposal_reviews_queryset
        )`                          `