import { useState } from "react";
import { createImage } from "../../services/api";

interface CreateImageFormProps {
  token: string;
  onImageCreated: () => void;
}

export default function CreateImageForm({
  token,
  onImageCreated,
}: CreateImageFormProps) {
  const [formData, setFormData] = useState({
    ten_hinh: "",
    mo_ta: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Vui lòng chọn file ảnh");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("ten_hinh", formData.ten_hinh);
      formDataToSend.append("mo_ta", formData.mo_ta);
      formDataToSend.append("file", file);

      await createImage(token, formDataToSend);
      setFormData({ ten_hinh: "", mo_ta: "" });
      setFile(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        setError("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File không được vượt quá 5MB");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
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
          <label htmlFor="file">Chọn ảnh:</label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {file && <p>Đã chọn: {file.name}</p>}
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
