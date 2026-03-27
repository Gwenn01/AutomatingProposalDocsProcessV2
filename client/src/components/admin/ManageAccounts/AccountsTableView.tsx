import { User2, Edit, Trash2 } from "lucide-react";
import { type ApiUser } from "@/api/admin-api";

interface AccountsTableViewProps {
    data: ApiUser[];
    onEdit: (user: ApiUser) => void;
    onDelete: (user: ApiUser) => void;
}

const AccountsTableView = ({
    data,
    onEdit,
    onDelete,
}: AccountsTableViewProps) => {
    return (
        <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300">
                <tr className="text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4 text-center">Role</th>
                    <th className="px-6 py-4 text-center">Details</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
                {data.map((user) => {
                    const role = user.profile.role;

                    const roleStyle =
                        role === "admin"
                            ? "bg-blue-500 text-white"
                            : role === "implementor"
                                ? "bg-emerald-500 text-white"
                                : "bg-amber-500 text-white";

                    return (
                        <tr
                            key={user.id}
                            className="hover:bg-gray-50/50 transition-colors group"
                        >
                            {/* USER INFO */}
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border group-hover:bg-emerald-50 transition">
                                        <User2 className="text-slate-500 group-hover:text-emerald-600" size={18} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition">
                                            {user.profile.name}
                                        </p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </div>
                                </div>
                            </td>

                            <td className="px-6 py-5 text-center">
                                <span
                                    className={`inline-flex items-center justify-center px-4 py-2 min-w-[130px] rounded-full text-xs font-semibold text-center ${roleStyle}`}
                                >
                                    {role}
                                </span>
                            </td>

                            {/* DETAILS */}
                            <td className="px-6 py-5 text-center text-xs text-slate-500">
                                <div>{user.profile.department || "General"}</div>
                                <div className="text-[10px] text-slate-400">
                                    {user.profile.campus || "Main"}
                                </div>
                            </td>

                            {/* ACTIONS */}
                            <td className="px-6 py-5 text-center">
                                <div className="flex items-center justify-center gap-2 flex-nowrap whitespace-nowrap">

                                    {/* Edit */}
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                    >
                                        <Edit size={14} />
                                        Edit
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={() => onDelete(user)}
                                        className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-red-600 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>

                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default AccountsTableView;