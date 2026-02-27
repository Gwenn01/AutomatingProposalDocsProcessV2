class ProgramHistoryMapper:
    @staticmethod
    def history_list_mapper(program, history):
        data = []
        data.append({
            "program_id": program['id'],
            "program_title": program['program_title'],
            "program_leader": program['program_leader'],
            "status": "current"
        })
        for h in history:
            data.append({
                "program_history_id": h['id'],
                "program_title": h['program_title'],
                "program_leader": h['program_leader'],
                "version": h['version'],
                "status": "history"
            })
        return data