import { Comment } from "../services/api";

interface CommentsListProps {
  comments: Comment[];
}

export default function CommentsList({ comments }: CommentsListProps) {
  if (comments.length === 0) {
    return <p className="no-comments">Chưa có bình luận nào.</p>;
  }

  return (
    <div className="comments-list">
      <h3>Bình luận ({comments.length})</h3>
      {comments.map((comment) => (
        <div key={comment.binh_luan_id} className="comment-item">
          <div className="comment-header">
            <img
              src={comment.nguoi_dung.anh_dai_dien || "/default-avatar.png"}
              alt={comment.nguoi_dung.ho_ten}
              className="comment-avatar"
            />
            <div className="comment-info">
              <span className="comment-author">
                {comment.nguoi_dung.ho_ten}
              </span>
              <span className="comment-date">
                {new Date(comment.ngay_binh_luan).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
          <div className="comment-content">{comment.noi_dung}</div>
        </div>
      ))}
    </div>
  );
}
