import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react"
import {
  X,
  UserPlus,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { createAdminAccount, type CreateAdminUserPayload } from "@/utils/admin-api";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddAccountModal =({ isOpen, onClose, onSuccess }: AddAccountModalProps) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateAdminUserPayload>({
        username: "",
        email: "",
        password: "",
        role: "reviewer",
        name: "",
        campus: "Iba Campus",
        department: "",
        position: "",
    })

    if (!isOpen) return null;

    const handleChange = (e:  ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value,}))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createAdminAccount(formData);
            onSuccess();
            onClose();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <UserPlus size={28} className="mx-auto text-green-600 mb-2" />
          <h2 className="text-2xl font-bold">Create Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            required
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full border rounded-lg p-3"
          />

          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border rounded-lg p-3"
          />

          <input
            required
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-lg p-3"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="reviewer">Reviewer</option>
            <option value="implementor">Implementor</option>
            <option value="admin">Admin</option>
          </select>

          <input
            required
            name="campus"
            value={formData.campus}
            onChange={handleChange}
            placeholder="Campus"
            className="w-full border rounded-lg p-3"
          />

          <input
            required
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Department"
            className="w-full border rounded-lg p-3"
          />

          <input
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Position"
            className="w-full border rounded-lg p-3"
          />

          <div className="relative">
            <input
              required
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border rounded-lg p-3 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg flex justify-center items-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddAccountModal