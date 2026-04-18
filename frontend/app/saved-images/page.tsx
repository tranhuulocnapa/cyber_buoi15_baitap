"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSavedImages, Image } from "../services/api";
import ImageList from "../components/ImageList";

export default function SavedImagesPage() {
  const router = useRouter();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
      fetchSavedImages(storedToken);
    }
  }, [router]);

  const fetchSavedImages = async (authToken: string) => {
    try {
      const response = await getSavedImages(authToken);
      setImages(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải ảnh đã lưu");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div>Đang tải...</div>;
  }

  if (loading) {
    return <div className="loading">Đang tải ảnh đã lưu...</div>;
  }

  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  return (
    <div className="saved-images-page">
      <h1>Ảnh đã lưu</h1>
      <ImageList images={images} />
    </div>
  );
}
