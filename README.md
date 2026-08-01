# 📱 My Money Gueh - Personal Financial & Budget Manager (Android Native)

A modern, high-performance **Native Android Financial Management Application** built using **Kotlin**, **Jetpack Compose**, and **Material 3 Design**, fully integrated with **Supabase Cloud REST API** for real-time multi-table database synchronization.

---

## ✨ Features & Highlights

- **📊 Dynamic Economic Overview & Donut Chart**: Features a custom Canvas Donut Chart with a soft ambient radial gradient glow aura.
- **🔢 Automated Thousands Separator (`2.000.000`)**: Live formatting across all numeric input fields (Salary, Wishlists, Transactions) to prevent typing errors.
- **☁️ Full Supabase Cloud Sync**: Live bidirectional synchronization across 6 database tables (`transactions`, `wishlists`, `user_settings`, `salary_allocations`, `quick_actions`, `wallets`).
- **🔐 PIN Security & Local Persistence**: Master Security Lock persisted in Android `SharedPreferences` (`keuanganku_security_prefs`).
- **🎨 Sleek Dark Glassmorphism UI**: Floating bottom navigation bar with bouncy spring animations (`graphicsLayer` scale) and hardware-accelerated screen transitions (`Crossfade`).
- **📩 Email API Integration**: Receipt generation & report sync configuration.

---

## 🗄️ Supabase Database Setup Guide

Instead of maintaining separate `.sql` files, copy and paste the complete SQL DDL and Seed script below directly into your **Supabase SQL Editor** ([https://app.supabase.com](https://app.supabase.com)).

### 📜 Complete Supabase SQL DDL & Seed Script

```sql
-- Executable SQL Script with RLS ENABLED & PUBLIC POLICIES FOR SUPABASE
-- Run this script in your Supabase SQL Editor (https://app.supabase.com)

-- 1. DROP EXISTING TABLES
DROP TABLE IF EXISTS public.quick_actions CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.salary_allocations CASCADE;
DROP TABLE IF EXISTS public.user_settings CASCADE;
DROP TABLE IF EXISTS public.wishlists CASCADE;
DROP TABLE IF EXISTS public.wallets CASCADE;

-- 2. CREATE TRANSACTIONS TABLE
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- 4. CREATE QUICK ACTIONS TABLE
CREATE TABLE public.quick_actions (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    amount BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    color_hex VARCHAR(20) NOT NULL
);

-- 5. CREATE USER SETTINGS TABLE
CREATE TABLE public.user_settings (
    id INT PRIMARY KEY DEFAULT 1,
    base_salary BIGINT NOT NULL DEFAULT 10000000,
    payday_date INT NOT NULL DEFAULT 25,
    email_service_active BOOLEAN NOT NULL DEFAULT TRUE,
    recipient_email VARCHAR(255) NOT NULL DEFAULT 'user@example.com'
);

-- 6. CREATE WISHLISTS TABLE
CREATE TABLE public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    target_amount BIGINT NOT NULL,
    current_saved BIGINT DEFAULT 0,
    color_hex VARCHAR(20) DEFAULT '#5EB893',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- 8. CREATE RLS POLICIES FOR PUBLIC ACCESS
CREATE POLICY "Allow public SELECT transactions" ON public.transactions FOR SELECT TO public USING (true);
CREATE POLICY "Allow public INSERT transactions" ON public.transactions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public UPDATE transactions" ON public.transactions FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public DELETE transactions" ON public.transactions FOR DELETE TO public USING (true);

CREATE POLICY "Allow public ALL salary_allocations" ON public.salary_allocations FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public ALL quick_actions" ON public.quick_actions FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public ALL user_settings" ON public.user_settings FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public ALL wishlists" ON public.wishlists FOR ALL TO public USING (true) WITH CHECK (true);

-- 9. INSERT INITIAL SEED DATA
INSERT INTO public.transactions (id, merchant, amount, category, transaction_date, is_expense) VALUES
('27fa812b-cca0-4ca9-b9de-7a1767db6018', 'KPR BTN / Cicilan Rumah', 1200000, 'Cicilan & Utang', '2026-08-01', TRUE),
('5ec056fe-04f9-418b-8a9a-29b8fe1fdb01', 'JUMP START COFFEE 1 - QRIS', 9900, 'Self Reward & Hiburan', '2026-08-01', TRUE),
('79f3e488-2c66-4994-b98c-47f70af8c002', 'Bensin Pertamax Motor', 50000, 'Kebutuhan Pokok', '2026-07-31', TRUE),
('c02bea2c-b474-497c-9020-0708465f0003', 'Belanja Supermarket Indomaret', 350000, 'Kebutuhan Pokok', '2026-08-01', TRUE),
('c26eb23a-e879-4abe-81f3-ce6a83601004', 'Gaji Bulanan Utama', 10000000, 'Pemasukan Utama', '2026-07-25', FALSE),
('c2adcf47-680f-4f90-83fd-2edfa8998005', 'Bonus Freelance Project', 2500000, 'Pemasukan Ekstra', '2026-08-01', FALSE);

INSERT INTO public.salary_allocations (id, name, percentage, color_hex) VALUES
('c1', 'Kebutuhan Pokok', 40, '#10B981'),
('c2', 'Tabungan & Investasi', 20, '#3B82F6'),
('c3', 'Cicilan & Utang', 20, '#F43F5E'),
('c4', 'Self Reward & Hiburan', 10, '#F59E0B'),
('c5', 'Dana Darurat', 10, '#8B5CF6');

INSERT INTO public.quick_actions (id, title, amount, category, color_hex) VALUES
('q1', 'Kopi', 18000, 'Self Reward & Hiburan', '#F43F5E'),
('q2', 'Makan', 35000, 'Kebutuhan Pokok', '#10B981'),
('q3', 'Transport', 25000, 'Kebutuhan Pokok', '#3B82F6'),
('q4', 'Pulsa', 50000, 'Kebutuhan Pokok', '#F59E0B'),
('q5', 'Snack', 15000, 'Self Reward & Hiburan', '#8B5CF6'),
('q6', 'Bensin', 30000, 'Kebutuhan Pokok', '#10B981');

INSERT INTO public.user_settings (id, base_salary, payday_date, email_service_active, recipient_email) VALUES
(1, 10000000, 25, TRUE, 'user@example.com');
```

---

## 🛠️ How to Build & Run (Local Android Emulator / Device)

### Prerequisites
- Android Studio Hedgehog / Ladybug or Gradle 8.x
- Android SDK 34+
- Connected Android Emulator or Physical Device (with USB Debugging)

### Build Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/financial-app.git
   cd financial-app
   ```

2. **Build Debug APK**:
   ```bash
   cd android
   .\gradlew.bat assembleDebug
   ```

3. **Install to Emulator via ADB**:
   ```bash
   adb install -r app\build\outputs\apk\debug\app-debug.apk
   ```

---

## 🛡️ License & Author
- Built with ❤️ for personal financial management and open-source demonstration.
