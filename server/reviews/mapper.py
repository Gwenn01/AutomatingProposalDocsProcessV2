class ProposalReviewMapper:
    REVIEW_FIELD_MAP = {
        "profile": "profile_feedback",
        "implementing_agency": "implementing_agency_feedback",
        "extension_site": "extension_site_feedback",
        "tagging_cluster_extension": "tagging_cluster_extension_feedback",
        "sdg_academic_program": "sdg_academic_program_feedback",
        "rationale": "rationale_feedback",
        "significance": "significance_feedback",
        "general_objectives": "general_objectives_feedback",
        "specific_objectives": "specific_objectives_feedback",
        "methodology": "methodology_feedback",
        "expected_output_6ps": "expected_output_feedback",
        "sustainability_plan": "sustainability_plan_feedback",
        "org_and_staffing": "org_staffing_feedback",
        "work_plan": "work_plan_feedback",
        "plan_of_activity": "plan_of_activity_feedback",
        "objectives": "objectives_feedback",
        "budget": "budget_requirements_feedback",
    }

    @staticmethod
    def get_review_per_docs_mapper(proposal_reviews_queryset):
        review_data = {key: [] for key in ProposalReviewMapper.REVIEW_FIELD_MAP.keys()}

        for r in proposal_reviews_queryset:
            reviewer_name = r.proposal_reviewer.reviewer.profile.name

            for section, field_name in ProposalReviewMapper.REVIEW_FIELD_MAP.items():
                if hasattr(r, field_name):
                    review_data[section].append({
                        "reviewer_name": reviewer_name,
                        "comment": getattr(r, field_name)
                    })

        return review_data
    
    @staticmethod
    def get_review_per_docs_program_mapper(program_proposal, proposal_reviews_queryset):
        reviews = ProposalReviewMapper.get_review_per_docs_mapper(proposal_reviews_queryset)
        return {
            "program_title": program_proposal.program_title,
            
            "profile": {
                "program_title": program_proposal.program_title,
                "program_leader": program_proposal.program_leader,
                "project_list": program_proposal.project_list,
                "reviews": reviews["profile"],
            },
            
            "agencies": {
                "implementing_agency": program_proposal.implementing_agency,
                "cooperating_agency": program_proposal.cooperating_agencies,
                "reviews": reviews["implementing_agency"]
            },
            
            "tagging_clustering_extension": {
                "tags": program_proposal.tags,
                "clusters": program_proposal.clusters,
                "agendas": program_proposal.agendas,
                "reviews": reviews["tagging_cluster_extension"]
            },
            
            "rationale": {
                "content": program_proposal.rationale,
                "reviews": reviews["rationale"]
            },

            "significance": {
                "content": program_proposal.significance,
                "reviews": reviews["significance"]
            },

            "objectives": {
                "general": program_proposal.general_objectives,
                "reviews_general": reviews["general_objectives"],
                "specific": program_proposal.specific_objectives,
                "reviews_specific": reviews["specific_objectives"],
            },

            "methodology": {
                "content": program_proposal.methodology,
                "reviews": reviews["methodology"]
            },

            "expected_output_6ps": {
                "content": program_proposal.expected_output_6ps,
                "reviews": reviews["expected_output_6ps"]
            },

            "sustainability_plan": {
                "content": program_proposal.sustainability_plan,
                "reviews": reviews["sustainability_plan"]
            },

            "organization_and_staffing": {
                "content": program_proposal.org_and_staffing,
                "reviews": reviews["org_and_staffing"]
            },

            "work_plan": {
                "content": program_proposal.workplan,
                "reviews": reviews["work_plan"]
            },

            "budget_requirements": {
                "content": program_proposal.budget_requirements,
                "reviews": reviews["budget"]
            }
        }
       
        
    @staticmethod
    def get_review_per_docs_project_mapper(project_proposal, proposal_reviews_queryset):
        reviews = ProposalReviewMapper.get_review_per_docs_mapper(proposal_reviews_queryset)
        return {
            "project_title": project_proposal.project_title,

            "profile": {
                "project_title": project_proposal.project_title,
                "project_leader": project_proposal.project_leader,
                "members": project_proposal.members,
                "duration_months": project_proposal.duration_months,
                "start_date": project_proposal.start_date,
                "end_date": project_proposal.end_date,
                "reviews": reviews["profile"],
            },

            "agencies": {
                "implementing_agency": project_proposal.implementing_agency,
                "cooperating_agencies": project_proposal.cooperating_agencies,
                "reviews": reviews["implementing_agency"]
            },

            "extension_sites": {
                "content": project_proposal.extension_sites,
                "reviews": reviews["extension_site"]
            },

            "tagging_clustering_extension": {
                "tags": project_proposal.tags,
                "clusters": project_proposal.clusters,
                "agendas": project_proposal.agendas,
                "reviews": reviews["tagging_cluster_extension"]
            },

            "sdg_and_academic_program": {
                "sdg_addressed": project_proposal.sdg_addressed,
                "mandated_academic_program": project_proposal.mandated_academic_program,
                "reviews": reviews["sdg_academic_program"]
            },

            "rationale": {
                "content": project_proposal.rationale,
                "reviews": reviews["rationale"]
            },

            "significance": {
                "content": project_proposal.significance,
                "reviews": reviews["significance"]
            },

            "objectives": {
                "general": project_proposal.general_objectives,
                "reviews_general": reviews["general_objectives"],
                "specific": project_proposal.specific_objectives,
                "reviews_specific": reviews["specific_objectives"],
            },

            "methodology": {
                "content": project_proposal.methodology,
                "reviews": reviews["methodology"]
            },

            "expected_output_6ps": {
                "content": project_proposal.expected_output_6ps,
                "reviews": reviews["expected_output_6ps"]
            },

            "sustainability_plan": {
                "content": project_proposal.sustainability_plan,
                "reviews": reviews["sustainability_plan"]
            },

            "organization_and_staffing": {
                "content": project_proposal.org_and_staffing,
                "reviews": reviews["org_and_staffing"]
            },

            "work_plan": {
                "content": project_proposal.workplan,
                "reviews": reviews["work_plan"]
            },

            "budget_requirements": {
                "content": project_proposal.budget_requirements,
                "reviews": reviews["budget"]
            }
        }
    
    @staticmethod
    def get_review_per_docs_activity_mapper(activity_proposal, proposal_reviews_queryset):
        reviews = ProposalReviewMapper.get_review_per_docs_mapper(proposal_reviews_queryset)

        return {
            "activity_title": activity_proposal.activity_title,

            "profile": {
                "activity_title": activity_proposal.activity_title,
                "project_leader": activity_proposal.project_leader,
                "members": activity_proposal.members,
                "activity_duration_hours": activity_proposal.activity_duration_hours,
                "activity_date": activity_proposal.activity_date,
                "reviews": reviews["profile"],
            },

            "agencies": {
                "implementing_agency": activity_proposal.implementing_agency,
                "cooperating_agencies": activity_proposal.cooperating_agencies,
                "reviews": reviews["implementing_agency"]
            },

            "extension_sites": {
                "content": activity_proposal.extension_sites,
                "reviews": reviews["extension_site"]
            },

            "tagging_clustering_extension": {
                "tags": activity_proposal.tags,
                "clusters": activity_proposal.clusters,
                "agendas": activity_proposal.agendas,
                "reviews": reviews["tagging_cluster_extension"]
            },

            "sdg_and_academic_program": {
                "sdg_addressed": activity_proposal.sdg_addressed,
                "mandated_academic_program": activity_proposal.mandated_academic_program,
                "reviews": reviews["sdg_academic_program"]
            },

            "rationale": {
                "content": activity_proposal.rationale,
                "reviews": reviews["rationale"]
            },

            "significance": {
                "content": activity_proposal.significance,
                "reviews": reviews["significance"]
            },

            "objectives": {
                "content": activity_proposal.objectives_of_activity,
                "reviews": reviews["general_objectives"]
            },

            "methodology": {
                "content": activity_proposal.methodology,
                "reviews": reviews["methodology"]
            },

            "expected_output_6ps": {
                "content": activity_proposal.expected_output_6ps,
                "reviews": reviews["expected_output_6ps"]
            },

            "sustainability_plan": {
                "content": activity_proposal.sustainability_plan,
                "reviews": reviews["sustainability_plan"]
            },

            "organization_and_staffing": {
                "content": activity_proposal.org_and_staffing,
                "reviews": reviews["org_and_staffing"]
            },

            "plan_of_activity": {
                "content": activity_proposal.plan_of_activity,
                "reviews": reviews["plan_of_activity"]
            },

            "budget_requirements": {
                "content": activity_proposal.budget_requirements,
                "reviews": reviews["budget"]
            }
        }