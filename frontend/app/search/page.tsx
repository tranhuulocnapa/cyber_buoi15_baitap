"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { searchImages, Image } from "../services/api";
import SearchForm from "../components/SearchForm";
import ImageList from "../components/ImageList";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await searchImages(searchQuery);
      setImages(response.data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tìm kiếm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query]);

  return (
    <div className="search-page">
      <h1>Tìm kiếm ảnh</h1>
      <SearchForm onSearch={handleSearch} initialQuery={query} />

      {loading && <div className="loading">Đang tìm kiếm...</div>}

      {error && <div className="error">Lỗi: {error}</div>}

      {!loading && !error && (
        <div>
          {query ? (
            <>
              <p>Kết quả cho: &quot;{query}&quot;</p>
              <ImageList images={images} />
            </>
          ) : (
            <p className="no-images">Nhập từ khóa để bắt đầu tìm kiếm.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="loading">Đang tải...</div>}>
      <SearchContent />
    </Suspense>
  );
}
