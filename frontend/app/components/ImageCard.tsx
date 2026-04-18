import { Image, getImageUrl } from "../services/api";
import SaveButton from "./SaveButton";

interface ImageCardProps {
  image: Image;
  token?: string | null;
  onDelete?: (imageId: number) => void;
}

export default function ImageCard({ image, token, onDelete }: ImageCardProps) {
  const imageUrl = getImageUrl(image.duong_dan);

  const handleDelete = () => {
    if (onDelete && confirm("Bạn có chắc muốn xóa ảnh này?")) {
      onDelete(image.hinh_id);
    }
  };

  return (
    <div className="image-card">
      <img src={imageUrl} alt={image.ten_hinh} className="image-card__img" />
      <div className="image-card__content">
        <h3 className="image-card__title">{image.ten_hinh}</h3>
        {image.mo_ta && (
          <p className="image-card__description">{image.mo_ta}</p>
        )}
        <p className="image-card__author">Tác giả: {image.nguoi_dung.ho_ten}</p>
        <div className="image-card__actions">
          {token && <SaveButton token={token} imageId={image.hinh_id} />}
          {onDelete && (
            <button onClick={handleDelete} className="delete-button">
              Xóa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
