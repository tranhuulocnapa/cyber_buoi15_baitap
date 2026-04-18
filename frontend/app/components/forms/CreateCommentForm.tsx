import { useState } from "react";
import { createComment, CreateCommentRequest } from "../../services/api";

interface CreateCommentFormProps {
  token: string;
  imageId: number;
  onCommentCreated: () => void;
}

export default function CreateCommentForm({
  token,
  imageId,
  onCommentCreated,
}: CreateCommentFormProps) {
  const [noi_dung, setNoiDung] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noi_dung.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await createComment(token, imageId, { noi_dung });
      setNoiDung("");
      onCommentCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo bình luận thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-comment-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            placeholder="Viết bình luận của bạn..."
            value={noi_dung}
            onChange={(e) => setNoiDung(e.target.value)}
            rows={3}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading || !noi_dung.trim()}>
          {loading ? "Đang gửi..." : "Gửi bình luận"}
        </button>
      </form>
    </div>
  );
}
