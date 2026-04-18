import { useState } from "react";
import { register, RegisterRequest } from "../../services/api";

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

export default function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    password: "",
    ho_ten: "",
    tuoi: undefined,
    anh_dai_dien: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(formData);
      onRegisterSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "tuoi" ? (value ? Number(value) : undefined) : value,
    });
  };

  return (
    <div className="auth-form">
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="ho_ten">Họ tên:</label>
          <input
            type="text"
            id="ho_ten"
            name="ho_ten"
            value={formData.ho_ten}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tuoi">Tuổi:</label>
          <input
            type="number"
            id="tuoi"
            name="tuoi"
            value={formData.tuoi || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="anh_dai_dien">Ảnh đại diện (URL):</label>
          <input
            type="url"
            id="anh_dai_dien"
            name="anh_dai_dien"
            value={formData.anh_dai_dien}
            onChange={handleChange}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
}
