# 📱 MyMoney - Modern Personal Financial & Budget Manager (Android Native)

[![Kotlin](https://img.shields.io/badge/Kotlin-1.9.22-7F52FF.svg?style=flat&logo=kotlin)](https://kotlinlang.org/)
[![Jetpack Compose](https://img.shields.io/badge/UI-Jetpack%20Compose-4285F4.svg?style=flat&logo=android)](https://developer.android.com/jetpack/compose)
[![Material 3](https://img.shields.io/badge/Design-Material%203-757575.svg?style=flat&logo=materialdesign)](https://m3.material.io/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase%20Cloud-3ECF8E.svg?style=flat&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A high-performance, ultra-sleek **Native Android Financial Management Application** engineered with **Kotlin**, **Jetpack Compose (Material 3)**, and integrated with **Supabase Cloud REST API** for real-time multi-table synchronization, coupled with an automated **Pure Gmail Receipt Parser Engine**.

---

## 📌 BAGIAN 1: OVERVIEW FITUR HIGHLIGHT & DISPLAY SCREENSHOTS

### ✨ Highlight Fitur Utama

1. **📊 Economic Overview & Interactive Donut Chart**:
   - Visualisasi alokasi keuangan real-time dengan Custom Canvas Donut Chart berdesain aura radial gradient modern.
   - Perhitungan otomatis **Base Salary**, **Extra Income**, **Total Monthly Expenses**, **Net Cash Flow**, dan **Closing Balance**.

2. **💳 Wallets & Asset Tracker**:
   - Pemisahan sumber dana (Cash, Bank Account, E-Wallet).
   - Pemilihan siklus bulan otomatis (**Auto-Generate Next Month Cycle** misal: September 2026) yang dapat diaktifkan melalui sakelar di Settings.

3. **🎯 Savings Vault & Wishlist Goals (Auto-Accumulated)**:
   - Pelacakan progress tabungan impian (Wishlist) yang secara otomatis menghitung akumulasi total tabungan dari alokasi gaji bulanan tanpa perlu input manual.

4. **⚖️ Customize Salary Allocation (Exclusive Budget Allocation)**:
   - Pembagian persentase gaji kustom (Kebutuhan Pokok 40%, Tabungan 20%, Cicilan 20%, Self Reward 10%, Dana Darurat 10%).
   - Rincian pengeluaran per kategori yang eksklusif mengikuti alokasi gaji yang dikustomisasi dan tersimpan permanen.

5. **📅 Date Picker Manual Transaction**:
   - Pilihan tanggal transaksi fleksibel menggunakan pop-up **Android Native DatePicker**. Memungkinkan pencatatan transaksi manual untuk tanggal mana pun di masa lalu maupun mendatang.

6. **🤖 Gmail Receipt Auto-Scanner & Regex Parsing Engine**:
   - Pemindaian struk pembayaran email secara otomatis (Bank BCA, myBCA, Mandiri, BRI, BNI, GoPay, ShopeePay, Google Play, Grab, Tokopedia, Mamikos).
   - Ekstraksi otomatis nama merchant, nominal (Rp), tanggal transaksi, dan penghapusan duplikasi transaksi.

7. **🔐 PIN Protection & Master Security**:
   - Pengaman pengaturan API & Database menggunakan kata sandi master yang tersimpan di Android `SharedPreferences`.

8. **🔢 Automated Thousands Separator (`2.000.000`)**:
   - Pemformatan angka otomatis saat mengetik untuk mencegah kesalahan input nominal.

---

### 📸 App Screenshots & UI Gallery

<div align="center">

| Economic Overview | Wallets & Asset Tracker | Wishlist Savings Vault | Customize Salary Allocation | Settings & API Protection |
| :---: | :---: | :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/46d9981b-40e8-4acb-a52f-1588b6cf8b31" width="180" alt="Overview" /> | <img src="https://github.com/user-attachments/assets/1aad61f4-1cf1-4e62-8801-a26d47369a37" width="180" alt="Wallets" /> | <img src="https://github.com/user-attachments/assets/94238186-121d-4919-acc2-8b6a47c15876" width="180" alt="Wishlist" /> | <img src="https://github.com/user-attachments/assets/5d4da204-8dc1-43dd-bb96-ff0bda865109" width="180" alt="Allocation" /> | <img src="https://github.com/user-attachments/assets/2c070881-8e24-41d8-9f86-cbf1539701ce" width="180" alt="Settings" /> |

</div>

---

## 📖 BAGIAN 2: PANDUAN TUTORIAL SETUP KREDENSIAL DEMI LANGKAH BUKAN TERBANYAK SAMPAI INSTALASI

Panduan lengkap dari pembuatan Kunci API Google Cloud (Gmail API), pembuatan Database Supabase, hingga cara install aplikasi ke smartphone Android Anda.

---

### 🔑 Langkah 1: Setup Google Cloud Console & Gmail API Key (OAuth 2.0)

Fitur pindaian struk otomatis membaca email pembayaran langsung dari Gmail Anda menggunakan **Google Cloud OAuth 2.0**. Ikuti langkah pembuatan kredensialnya di bawah ini:

1. **Buka Google Cloud Console**:
   - Kunjungi [Google Cloud Console](https://console.cloud.google.com) dan masuk menggunakan akun Google / Gmail Anda.

2. **Buat Project Baru**:
   - Klik menu drop-down project di bagian atas layar -> Klik **New Project**.
   - Beri nama project: `MyMoney Financial Manager` -> Klik **Create**.

3. **Aktifkan Gmail API**:
   - Di bilah pencarian atas, ketik **Gmail API** atau buka menu **APIs & Services** -> **Library**.
   - Cari **Gmail API** -> Klik tombol **Enable**.

4. **Konfigurasi OAuth Consent Screen**:
   - Buka menu **APIs & Services** -> **OAuth consent screen**.
   - Pilih User Type: **External** -> Klik **Create**.
   - Isi form data dasar:
     - **App name**: `MyMoney`
     - **User support email**: Email Gmail Anda.
     - **Developer contact information**: Email Gmail Anda.
   - Klik **Save and Continue**.
   - Pada halaman **Scopes**, klik **Add or Remove Scopes**, tambahkan scope berikut:
     - `https://www.googleapis.com/auth/gmail.readonly` (Hanya akses baca email struk pembayaran)
   - Tambahkan email Gmail Anda di bagian **Test users** agar dapat login saat mode testing.
   - Klik **Save and Continue**.

5. **Buat Credentials (OAuth Client ID)**:
   - Buka menu **APIs & Services** -> **Credentials** -> Klik **+ Create Credentials** -> Pilih **OAuth client ID**.
   - Pilih **Application type**: **Android** (atau **Web application**).
   - Isi detail:
     - **Name**: `MyMoney Android Client`
     - **Package name**: `com.financialapp.manager`
   - Klik **Create**.
   - Salin **Client ID** yang muncul (contoh format: `123456789012-abc123def456.apps.googleusercontent.com`). Salin kode ini untuk dimasukkan ke dalam aplikasi kelak.

---

### 🗄️ Langkah 2: Setup Database Supabase Cloud

Aplikasi ini menggunakan **Supabase Cloud** sebagai penyimpanan data utama secara online.

1. **Buat Akun & Project Supabase**:
   - Kunjungi [Supabase.com](https://supabase.com) dan daftar/login.
   - Klik **New Project** -> Beri nama `MyMoney DB`, tentukan password database -> Klik **Create New Project**.

2. **Ambil Credentials Supabase**:
   - Setelah project selesai dibuat, buka menu **Project Settings** (ikon roda gigi) -> **API**.
   - Salin **Project URL** (contoh: `https://xxxx.supabase.co`).
   - Salin **API Key (anon / public)** (contoh: `eyJhbGciOi...`).

3. **Jalankan Script SQL DDL & Seed**:
   - Buka menu **SQL Editor** di panel kiri Supabase -> Klik **New Query**.
   - Tempelkan kode SQL lengkap di bawah ini, lalu klik **Run**:

```sql
-- Executable SQL Script with RLS ENABLED & PUBLIC POLICIES FOR SUPABASE

-- 1. DROP EXISTING TABLES IF ANY
DROP TABLE IF EXISTS public.quick_actions CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.salary_allocations CASCADE;
DROP TABLE IF EXISTS public.user_settings CASCADE;
DROP TABLE IF EXISTS public.wishlists CASCADE;
DROP TABLE IF EXISTS public.wallets CASCADE;

-- 2. CREATE TRANSACTIONS TABLE
CREATE TABLE public.transactions (
    id VARCHAR(255) PRIMARY KEY,
    merchant VARCHAR(255) NOT NULL,
    amount BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_expense BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CREATE SALARY ALLOCATIONS TABLE
CREATE TABLE public.salary_allocations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    percentage INT NOT NULL,
    color_hex VARCHAR(20) NOT NULL
);

-- 4. CREATE USER SETTINGS TABLE
CREATE TABLE public.user_settings (
    id INT PRIMARY KEY DEFAULT 1,
    base_salary BIGINT NOT NULL DEFAULT 10000000,
    payday_date INT NOT NULL DEFAULT 25,
    email_service_active BOOLEAN NOT NULL DEFAULT TRUE,
    recipient_email VARCHAR(255) NOT NULL DEFAULT 'user@example.com'
);

-- 5. CREATE WISHLISTS TABLE
CREATE TABLE public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    target_amount BIGINT NOT NULL,
    current_saved BIGINT DEFAULT 0,
    color_hex VARCHAR(20) DEFAULT '#5EB893',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- 7. CREATE RLS POLICIES FOR PUBLIC ACCESS
CREATE POLICY "Allow public ALL transactions" ON public.transactions FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public ALL salary_allocations" ON public.salary_allocations FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public ALL user_settings" ON public.user_settings FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public ALL wishlists" ON public.wishlists FOR ALL TO public USING (true) WITH CHECK (true);

-- 8. INSERT SEED DATA
INSERT INTO public.salary_allocations (id, name, percentage, color_hex) VALUES
('c1', 'Kebutuhan Pokok', 40, '#10B981'),
('c2', 'Tabungan & Investasi', 20, '#3B82F6'),
('c3', 'Cicilan & Utang', 20, '#F43F5E'),
('c4', 'Self Reward & Hiburan', 10, '#F59E0B'),
('c5', 'Dana Darurat', 10, '#8B5CF6');

INSERT INTO public.user_settings (id, base_salary, payday_date, email_service_active, recipient_email) VALUES
(1, 10000000, 25, TRUE, 'user@example.com');
```

---

### ⚙️ Langkah 3: Konfigurasi Kredensial di Dalam Aplikasi

Setelah menginstal aplikasi ke smartphone Anda (lihat Langkah 4):

1. Buka aplikasi **MyMoney** di HP Android Anda.
2. Masuk ke tab **Settings** (Ikon Roda Gigi / Tab 5).
3. Klik **API Settings** dan masukkan Kata Sandi Security (Default PIN: `123456`).
4. Masukkan kredensial yang telah Anda buat pada langkah 1 & 2:
   - **Recipient Email Address**: Alamat Gmail Anda.
   - **Google OAuth Client ID**: Client ID dari Google Cloud Console.
   - **Supabase URL**: URL Project Supabase Anda.
   - **Supabase Key**: Anon Public Key Supabase Anda.
5. Klik **Test Database Connection** & **Verify Google Cloud Services Connection** untuk menguji apakah status berubah menjadi **ONLINE / Active**.

---

### 📲 Langkah 4: Kompilasi & Cara Install Berkas APK ke Smartphone

#### Prasyarat Sistem:
- JDK 17 / Java 17
- Android Studio Hedgehog / Ladybug atau Gradle 8.x
- Smartphone Android (Android 8.0 Oreo ke atas, SDK 26+)

#### Cara A: Mengompilasi & Menginstall via Terminal (Direkomendasikan)

1. **Clone Repositori Ini**:
   ```bash
   git clone https://github.com/Dexiusss/Personal_Financial_App.git
   cd Personal_Financial_App
   ```

2. **Kompilasi Berkas APK**:
   ```bash
   cd android
   .\gradlew.bat assembleDebug
   ```
   *Berkas APK akan dihasilkan di folder `android/app/build/outputs/apk/debug/app-debug.apk`.*

3. **Install Langsung ke HP via Kabel USB (ADB)**:
   - Aktifkan **USB Debugging** pada HP Android Anda (di Developer Options).
   - Hubungkan HP ke PC via kabel USB.
   - Jalankan perintah berikut di terminal:
     ```bash
     adb install -r app\build\outputs\apk\debug\app-debug.apk
     ```

#### Cara B: Transfer Manual APK ke HP

1. Salin berkas `MyMoney-v1.0.apk` dari komputer ke memori penyimpanan HP Anda (melalui kabel data, Google Drive, atau WhatsApp).
2. Buka **File Manager** di HP Anda -> Pilih berkas `MyMoney-v1.0.apk`.
3. Izinkan instalasi dari **Unknown Sources / Sumber Tidak Dikenal** jika diminta.
4. Klik **Install** dan buka aplikasinya.

---

## 🛡️ Lisensi & Kontributor

- Dikembangkan oleh **@Dexius** menggunakan Kotlin Native & Jetpack Compose.
- Berlisensi di bawah **MIT License**. Terbuka untuk kontribusi dan pengembangan lebih lanjut.

