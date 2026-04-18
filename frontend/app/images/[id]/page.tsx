"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getImageDetail,
  getComments,
  Image,
  Comment,
} from "../../services/api";
import CommentsList from "../../components/CommentsList";
import CreateCommentForm from "../../components/forms/CreateCommentForm";
import SaveButton from "../../components/SaveButton";

export default function ImageDetailPage() {
  const params = useParams();
  const imageId = Number(params.id);

  const [image, setImage] = useState<Image | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    fetchImageDetail();
    fetchComments();
  }, [imageId]);

  const fetchImageDetail = async () => {
    try {
      const response = await getImageDetail(imageId);
      setImage(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải chi tiết ảnh");
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(imageId);
      setComments(response.data);
    } catch (err) {
      console.error("Lỗi tải bình luận:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentCreated = () => {
    fetchComments();
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error || !image) {
    return <div className="error">Lỗi: {error || "Ảnh không tồn tại"}</div>;
  }

  return (
    <div className="image-detail-page">
      <div className="image-detail">
        <img
          src={image.duong_dan}
          alt={image.ten_hinh}
          className="image-detail__img"
        />
        <div className="image-detail__info">
          <h1>{image.ten_hinh}</h1>
          {image.mo_ta && <p className="description">{image.mo_ta}</p>}
          <div className="author">
            <img
              src={image.nguoi_dung.anh_dai_dien || "/default-avatar.png"}
              alt={image.nguoi_dung.ho_ten}
              className="author-avatar"
            />
            <span>{image.nguoi_dung.ho_ten}</span>
          </div>
          {token && <SaveButton token={token} imageId={imageId} />}
        </div>
      </div>

      <div className="comments-section">
        <CommentsList comments={comments} />
        {token && (
          <CreateCommentForm
            token={token}
            imageId={imageId}
            onCommentCreated={handleCommentCreated}
          />
        )}
      </div>
    </div>
  );
}
