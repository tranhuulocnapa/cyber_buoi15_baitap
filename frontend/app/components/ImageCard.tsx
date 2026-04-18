import { Image } from "../services/api";

interface ImageCardProps {
  image: Image;
}

export default function ImageCard({ image }: ImageCardProps) {
  return (
    <div className="image-card">
      <img
        src={image.duong_dan}
        alt={image.ten_hinh}
        className="image-card__img"
      />
      <div className="image-card__content">
        <h3 className="image-card__title">{image.ten_hinh}</h3>
        {image.mo_ta && (
          <p className="image-card__description">{image.mo_ta}</p>
        )}
        <p className="image-card__author">Tác giả: {image.nguoi_dung.ho_ten}</p>
      </div>
    </div>
  );
}
