const API_BASE_URL = "http://localhost:3069";

export const getImageUrl = (duong_dan: string) => {
  if (!duong_dan) {
    return "";
  }
  if (duong_dan.startsWith("http")) {
    return duong_dan;
  }
  return `${API_BASE_URL}${duong_dan}`;
};

export interface Image {
  hinh_id: number;
  ten_hinh: string;
  duong_dan: string;
  mo_ta?: string;
  nguoi_dung: {
    nguoi_dung_id: number;
    ho_ten: string;
    anh_dai_dien?: string;
  };
}

export interface ImagesResponse {
  status: boolean;
  message: string;
  data: {
    items: Image[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface User {
  nguoi_dung_id: number;
  email: string;
  ho_ten: string;
  tuoi?: number;
  anh_dai_dien?: string;
}

export interface Comment {
  binh_luan_id: number;
  noi_dung: string;
  ngay_binh_luan: string;
  nguoi_dung: {
    nguoi_dung_id: number;
    ho_ten: string;
    anh_dai_dien?: string;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  ho_ten: string;
  tuoi?: number;
  anh_dai_dien?: string;
}

export interface UpdateUserRequest {
  ho_ten?: string;
  tuoi?: number;
  anh_dai_dien?: string;
}

export interface CreateCommentRequest {
  noi_dung: string;
}

export interface SaveImageRequest {
  hinh_id: number;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}

export interface UserResponse {
  status: boolean;
  message: string;
  data: User;
}

export interface CommentsResponse {
  status: boolean;
  message: string;
  data: Comment[];
}

export interface SaveImageResponse {
  status: boolean;
  message: string;
  data: {
    saved: boolean;
    hinh_id?: number;
  };
}

export interface CheckSavedResponse {
  status: boolean;
  message: string;
  data: {
    saved: boolean;
  };
}

// Auth APIs
export const register = async (
  data: RegisterRequest,
): Promise<UserResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Đăng ký thất bại");
  }
  return response.json();
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Đăng nhập thất bại");
  }
  return response.json();
};

// User APIs
export const getCurrentUser = async (token: string): Promise<UserResponse> => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Không thể tải thông tin người dùng");
  }
  return response.json();
};

export const updateUser = async (
  token: string,
  data: UpdateUserRequest,
): Promise<UserResponse> => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Cập nhật thông tin thất bại");
  }
  return response.json();
};

export const getSavedImages = async (
  token: string,
): Promise<{
  status: boolean;
  message: string;
  data: { items: Image[]; pagination: Pagination };
}> => {
  const response = await fetch(`${API_BASE_URL}/users/saved-images`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Không thể tải ảnh đã lưu`);
  }
  return response.json();
};

export const getMyImages = async (
  token: string,
): Promise<{ status: boolean; message: string; data: Image[] }> => {
  const response = await fetch(`${API_BASE_URL}/users/my-images`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Không thể tải ảnh của bạn");
  }
  return response.json();
};

// Images APIs
export const getImages = async (
  page: number = 1,
  limit: number = 10,
): Promise<ImagesResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/images?page=${page}&limit=${limit}`,
  );
  if (!response.ok) {
    throw new Error("Không thể tải danh sách ảnh");
  }
  return response.json();
};

export const searchImages = async (
  name: string,
  page: number = 1,
  limit: number = 10,
): Promise<ImagesResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/images/search?name=${encodeURIComponent(name)}&page=${page}&limit=${limit}`,
  );
  if (!response.ok) {
    throw new Error("Không thể tìm kiếm ảnh");
  }
  return response.json();
};

export const getImageDetail = async (
  id: number,
): Promise<{ status: boolean; message: string; data: Image }> => {
  const response = await fetch(`${API_BASE_URL}/images/${id}`);
  if (!response.ok) {
    throw new Error("Không thể tải chi tiết ảnh");
  }
  return response.json();
};

export const createImage = async (
  token: string,
  data: FormData,
): Promise<{ status: boolean; message: string; data: Image }> => {
  const response = await fetch(`${API_BASE_URL}/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  if (!response.ok) {
    throw new Error("Tạo ảnh thất bại");
  }
  return response.json();
};

export const deleteImage = async (
  token: string,
  id: number,
): Promise<{ status: boolean; message: string; data: null }> => {
  const response = await fetch(`${API_BASE_URL}/images/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Xóa ảnh thất bại");
  }
  return response.json();
};

// Comments APIs
export const getComments = async (
  imageId: number,
): Promise<CommentsResponse> => {
  const response = await fetch(`${API_BASE_URL}/comments/${imageId}`);
  if (!response.ok) {
    throw new Error("Không thể tải bình luận");
  }
  return response.json();
};

export const createComment = async (
  token: string,
  imageId: number,
  data: CreateCommentRequest,
): Promise<{ status: boolean; message: string; data: Comment }> => {
  const response = await fetch(`${API_BASE_URL}/comments/${imageId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Tạo bình luận thất bại");
  }
  return response.json();
};

// Saved Images APIs
export const checkIfSaved = async (
  token: string,
  imageId: number,
): Promise<CheckSavedResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/saved-images/check/${imageId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Không thể kiểm tra trạng thái lưu");
  }
  return response.json();
};

export const saveImage = async (
  token: string,
  data: SaveImageRequest,
): Promise<SaveImageResponse> => {
  const response = await fetch(`${API_BASE_URL}/saved-images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Lưu ảnh thất bại");
  }
  return response.json();
};

export const unsaveImage = async (
  token: string,
  imageId: number,
): Promise<{ status: boolean; message: string; data: { hinh_id: number } }> => {
  const response = await fetch(`${API_BASE_URL}/saved-images/${imageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Xóa ảnh lưu thất bại");
  }
  return response.json();
};
