class ProjectHistoryMapper:
    @staticmethod
    def history_list_mapper(project, history):
        data = []
        data.append({
            "proposal_id": project['proposal'],
            "project_id": project['id'],
            "project_title": project['project_title'],
            "project_leader": project['project_leader'],
            "status": "current"
        })
        for h in history:
            data.append({
                "proposal_id": h['proposal_id'],
                "history_id": h['history_id'],
                "project_title": h['project_title'],
                "project_leader": h['project_leader'],
                "version": h['version'],
                "status": "history"
            })
        return data