class ProjectHistoryMapper:
    @staticmethod
    def history_list_mapper(project, history):
        data = []
        data.append({
            "project_id": project['id'],
            "project_title": project['project_title'],
            "project_leader": project['project_leader'],
            "status": "current"
        })
        for h in history:
            data.append({
                "project_history_id": h['id'],
                "project_title": h['project_title'],
                "project_leader": h['project_leader'],
                "version": h['version'],
                "status": "history"
            })
        return data