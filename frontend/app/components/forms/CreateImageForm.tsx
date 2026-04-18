import { useState } from "react";
import { createImage, CreateImageRequest } from "../../services/api";

interface CreateImageFormProps {
  token: string;
  onImageCreated: () => void;
}

export default function CreateImageForm({
  token,
  onImageCreated,
}: CreateImageFormProps) {
  const [formData, setFormData] = useState<CreateImageRequest>({
    ten_hinh: "",
    duong_dan: "",
    mo_ta: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createImage(token, formData);
      setFormData({ ten_hinh: "", duong_dan: "", mo_ta: "" });
      onImageCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo ảnh thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="create-image-form">
      <h2>Tạo ảnh mới</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ten_hinh">Tên hình:</label>
          <input
            type="text"
            id="ten_hinh"
            name="ten_hinh"
            value={formData.ten_hinh}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="duong_dan">Đường dẫn ảnh:</label>
          <input
            type="url"
            id="duong_dan"
            name="duong_dan"
            value={formData.duong_dan}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="mo_ta">Mô tả:</label>
          <textarea
            id="mo_ta"
            name="mo_ta"
            value={formData.mo_ta}
            onChange={handleChange}
            rows={3}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Đang tạo..." : "Tạo ảnh"}
        </button>
      </form>
    </div>
  );
}
