import { Image } from "../services/api";
import ImageCard from "./ImageCard";

interface ImageListProps {
  images: Image[];
}

export default function ImageList({ images }: ImageListProps) {
  if (images.length === 0) {
    return <p className="no-images">Không có ảnh nào để hiển thị.</p>;
  }

  return (
    <div className="image-list">
      {images.map((image) => (
        <ImageCard key={image.hinh_id} image={image} />
      ))}
    </div>
  );
}
