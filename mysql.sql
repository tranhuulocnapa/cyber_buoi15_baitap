CREATE DATABASE quan_ly_hinh_anh;
USE quan_ly_hinh_anh;

CREATE TABLE nguoi_dung (
    nguoi_dung_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    mat_khau VARCHAR(255) NOT NULL,
    ho_ten VARCHAR(255),
    tuoi INT,
    anh_dai_dien VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE hinh_anh (
    hinh_id INT AUTO_INCREMENT PRIMARY KEY,
    ten_hinh VARCHAR(255),
    duong_dan VARCHAR(500),
    mo_ta VARCHAR(500),
    nguoi_dung_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_hinh_nguoi_dung
    FOREIGN KEY (nguoi_dung_id)
    REFERENCES nguoi_dung(nguoi_dung_id)
    ON DELETE CASCADE
);

CREATE TABLE binh_luan (
    binh_luan_id INT AUTO_INCREMENT PRIMARY KEY,
    nguoi_dung_id INT,
    hinh_id INT,
    ngay_binh_luan DATETIME DEFAULT CURRENT_TIMESTAMP,
    noi_dung VARCHAR(500),

    CONSTRAINT fk_bl_nguoi_dung
    FOREIGN KEY (nguoi_dung_id)
    REFERENCES nguoi_dung(nguoi_dung_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_bl_hinh
    FOREIGN KEY (hinh_id)
    REFERENCES hinh_anh(hinh_id)
    ON DELETE CASCADE
);

CREATE TABLE luu_anh (
    nguoi_dung_id INT,
    hinh_id INT,
    ngay_luu DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (nguoi_dung_id, hinh_id),

    CONSTRAINT fk_luu_nguoi_dung
    FOREIGN KEY (nguoi_dung_id)
    REFERENCES nguoi_dung(nguoi_dung_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_luu_hinh
    FOREIGN KEY (hinh_id)
    REFERENCES hinh_anh(hinh_id)
    ON DELETE CASCADE
);

CREATE INDEX idx_ten_hinh ON hinh_anh(ten_hinh);
CREATE INDEX idx_email ON nguoi_dung(email);


ALTER TABLE nguoi_dung ADD role VARCHAR(50) DEFAULT 'user';

ALTER TABLE hinh_anh ADD is_deleted BOOLEAN DEFAULT FALSE;











