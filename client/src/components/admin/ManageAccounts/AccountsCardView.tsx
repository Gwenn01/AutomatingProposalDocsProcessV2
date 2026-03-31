import { Edit, Trash2, User2 } from "lucide-react";
import { type ApiUser } from "@/api/admin-api";

interface AccountsCardViewProps {
    data: ApiUser[];
    onEdit: (user: ApiUser) => void;
    onDelete: (user: ApiUser) => void;
}

const AccountsCardView = ({ data, onEdit, onDelete }: AccountsCardViewProps) => {
    return (
        <>
            {data.map((user) => {
                const role = user.profile.role;

                const roleStyle =
                    role === "admin"
                        ? "bg-blue-500 text-white"
                        : role === "implementor"
                            ? "bg-emerald-500 text-white"
                            : "bg-amber-500 text-white";

                return (
                    <div
                        key={user.id}
                        className="bg-white rounded-xl p-7 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border flex flex-col justify-between min-h-[260px] transition-all hover:shadow-[0_2px_25px_rgba(0,0,0,0.07)]"
                    >
                        {/* TOP SECTION */}
                        <div>
                            <div className="flex justify-between items-start mb-5">
                                <span className={`px-4 py-2.5 rounded-full text-xs font-extrabold tracking-wide uppercase ${roleStyle}`}>
                                    {role}
                                </span>
                                <span className="text-gray-400 text-xs font-bold">
                                    ID: #{String(user.id).padStart(4, "0")}
                                </span>
                            </div>

                            {/* USER INFO */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/50">
                                    <User2 className="text-slate-500" size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="text-base font-bold text-gray-900 leading-tight truncate">
                                        {user.profile.name}
                                    </h3>
                                    <p className="text-xs text-gray-400 font-medium truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS - Matched to Proposals Style */}
                        <div className="flex space-x-3">
                            <button
                                onClick={() => onEdit(user)}
                                className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-md font-bold text-xs hover:bg-green-700 transition-colors"
                            >
                                <Edit size={18} />
                                <span>Edit</span>
                            </button>

                            <button
                                onClick={() => onDelete(user)}
                                className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white py-3 rounded-md font-bold text-xs hover:bg-red-600 transition-colors"
                            >
                                <Trash2 size={18} />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default AccountsCardView;