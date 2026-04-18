import { useState } from "react";

interface SearchFormProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function SearchForm({
  onSearch,
  initialQuery = "",
}: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="search-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tìm kiếm ảnh..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Tìm kiếm</button>
      </form>
    </div>
  );
}
