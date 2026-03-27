import { Edit, Trash2, User2 } from "lucide-react";
import { type ApiUser } from "@/api/admin-api";

interface AccountsCardViewProps {
    data: ApiUser[];
    onEdit: (user: ApiUser) => void;
    onDelete: (user: ApiUser) => void;
}

const AccountsCardView = ({
    data,
    onEdit,
    onDelete,
}: AccountsCardViewProps) => {
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
                        className="bg-white rounded-xl p-7 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border flex flex-col justify-between min-h-[260px]"
                    >
                        {/* TOP */}
                        <div>
                            <div className="flex justify-between items-center mb-5">
                                <span
                                    className={`px-4 py-2 rounded-full text-xs font-extrabold ${roleStyle}`}
                                >
                                    {role}
                                </span>

                                <span className="text-[10px] text-gray-400 font-bold">
                                    #{String(user.id).padStart(4, "0")}
                                </span>
                            </div>

                            {/* USER */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                                    <User2 className="text-slate-500" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">
                                        {user.profile.name}
                                    </h3>
                                    <p className="text-xs text-gray-400">{user.email}</p>
                                </div>
                            </div>

                            {/* DETAILS */}
                            <div className="text-xs text-gray-500 space-y-1">
                                <p>Department: {user.profile.department || "General"}</p>
                                <p>Campus: {user.profile.campus || "Main"}</p>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => onEdit(user)}
                                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-md text-xs font-bold hover:bg-green-700 transition"
                            >
                                <Edit size={16} />
                                Edit
                            </button>

                            <button
                                onClick={() => onDelete(user)}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-md text-xs font-bold hover:bg-red-600 transition"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default AccountsCardView;