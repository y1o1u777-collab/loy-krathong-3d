# ลอยกระทง 3D — The Night of Wishes

เว็บแอป Interactive สำหรับออกแบบกระทง 3D ใส่คำอธิษฐาน แล้วปล่อยลงแม่น้ำชุมชนที่อัปเดตข้อมูลแบบ Realtime

## เทคโนโลยี

- React 18 + Vite + TypeScript
- Tailwind CSS
- Three.js, `@react-three/fiber`, `@react-three/drei`
- Framer Motion
- Supabase (`@supabase/supabase-js`) + PostgreSQL + Realtime + RLS

## ใช้งานบน iPhone, iPad และ Android

โปรเจกต์นี้เป็น **Progressive Web App (PWA)** จึงใช้เว็บชุดเดียวกันได้บน iOS และ Android โดยไม่ต้องสร้างแอปแยกใน App Store หรือ Google Play

### iPhone / iPad (iOS / iPadOS)

1. เปิด URL เว็บไซต์ที่ deploy แล้วด้วย **Safari**
2. แตะปุ่ม **แชร์** (สี่เหลี่ยมมีลูกศรชี้ขึ้น)
3. เลือก **เพิ่มไปยังหน้าจอโฮม (Add to Home Screen)**
4. เปิดตัวเลือก **Open as Web App / เปิดเป็นเว็บแอป** หากมี แล้วแตะ **Add / เพิ่ม**
5. เปิดไอคอน “ลอยกระทง 3D” จากหน้าจอโฮม

> บน iPhone/iPad ให้ติดตั้งผ่าน Safari เพื่อให้ได้ประสบการณ์เปิดแบบแอปเต็มหน้าจอ เบราว์เซอร์อื่นบน iOS อาจมีตัวเลือกติดตั้งต่างกันตามเวอร์ชันระบบ

### Android

1. เปิด URL เว็บไซต์ที่ deploy แล้วด้วย **Google Chrome**
2. แตะปุ่ม **ติดตั้ง** ที่แสดงบนหน้าเว็บ หรือเปิดเมนู ⋮ แล้วเลือก **Install app / ติดตั้งแอป** หรือ **Add to Home screen / เพิ่มไปยังหน้าจอหลัก**
3. ยืนยันการติดตั้ง แล้วเปิด “ลอยกระทง 3D” จากหน้าจอหลักหรือ App Drawer

### เงื่อนไขสำคัญสำหรับการติดตั้ง

- ต้องเปิดเว็บไซต์ผ่าน **HTTPS** (เช่น deploy บน Vercel หรือ Netlify) ยกเว้น `localhost` สำหรับการพัฒนาบนอุปกรณ์เดียวกัน
- การเปิดผ่าน IP ในวง Wi-Fi เช่น `http://192.168.x.x:5173` ใช้ทดสอบเว็บได้ แต่โดยทั่วไปจะไม่เปิดใช้ PWA install / service worker เพราะไม่ใช่ secure context
- ต้องใช้เบราว์เซอร์ที่รองรับ WebGL เพื่อแสดงฉาก Three.js 3D
- PWA ช่วยให้เปิดจากไอคอนและเก็บไฟล์หน้าเว็บบางส่วนไว้ในเครื่องได้ แต่การบันทึกกระทงและข้อมูลชุมชนแบบ Real-time ยังต้องเชื่อมต่ออินเทอร์เน็ตและ Supabase

## เริ่มต้นใช้งานสำหรับนักพัฒนา

ต้องติดตั้ง Node.js 20 ขึ้นไป

```bash
npm install
cp .env.example .env
npm run dev
```

เปิด `http://localhost:5173`

บน Windows PowerShell สามารถคัดลอกไฟล์ env ด้วยคำสั่ง:

```powershell
Copy-Item .env.example .env
```

### ตั้งค่า Supabase

1. สร้างโปรเจกต์ที่ [supabase.com](https://supabase.com/)
2. เปิด **Project Settings → API** แล้วคัดลอก Project URL และ anon/public key
3. ใส่ค่าในไฟล์ `.env`:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
```

4. เปิด **SQL Editor** ใน Supabase แล้ววางเนื้อหาจาก `supabase/schema.sql` และกด Run
5. รีสตาร์ต Vite หลังแก้ `.env` (`Ctrl+C` แล้ว `npm run dev`)

เมื่อกำหนดค่าถูกต้อง หน้าแม่น้ำจะอ่านข้อมูลจาก `public.krathongs` และฟังเหตุการณ์ INSERT ผ่าน Supabase Realtime โดยอัตโนมัติ

> ใช้เฉพาะ anon/publishable key ใน Frontend เท่านั้น ห้ามใส่ `service_role` key ใน `.env` ของ Vite หรือ commit ไฟล์ `.env` ขึ้น GitHub นโยบาย RLS ใน SQL เปิดให้อ่านและเพิ่มข้อมูลได้แบบสาธารณะตามโจทย์ จึงไม่ควรเก็บข้อมูลส่วนตัวหรือข้อมูลอ่อนไหวในคำอธิษฐาน

## เผยแพร่เป็น Website บน GitHub Pages (แนะนำ)

โปรเจกต์นี้เตรียม GitHub Actions ไว้แล้ว เมื่อ push โค้ดไปที่ branch `main` ระบบจะ build และเผยแพร่เว็บไซต์ให้อัตโนมัติ

### 1. สร้าง Repository บน GitHub

1. เข้า [github.com/new](https://github.com/new) แล้วสร้าง Repository ใหม่ เช่น `loy-krathong-3d`
2. ตั้งเป็น **Public** (แนะนำสำหรับ GitHub Pages)
3. อย่าเลือกสร้าง README, `.gitignore` หรือ License เพิ่ม เพราะมีไฟล์เหล่านี้ในโปรเจกต์แล้ว
4. แตก ZIP โปรเจกต์นี้ แล้วเปิด Terminal ในโฟลเดอร์ `loy-krathong-3d` (อัปโหลดโฟลเดอร์ `.github` ไปด้วย เพื่อให้ระบบ deploy อัตโนมัติ)

### 2. อัปโหลดโค้ดขึ้น GitHub

ติดตั้ง [Git](https://git-scm.com/downloads) ก่อน จากนั้นรันคำสั่งต่อไปนี้ โดยเปลี่ยน `YOUR-USERNAME` เป็นชื่อบัญชี GitHub ของคุณ และ `loy-krathong-3d` ให้ตรงกับชื่อ Repository ที่สร้างไว้

```bash
git init
git add .
git commit -m "Initial Loy Krathong 3D website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/loy-krathong-3d.git
git push -u origin main
```

### 3. เปิดใช้ GitHub Pages

1. เข้า Repository บน GitHub
2. ไปที่ **Settings → Pages**
3. ในหัวข้อ **Build and deployment → Source** เลือก **GitHub Actions**
4. ไปที่แท็บ **Actions** แล้วเปิด workflow `Deploy website to GitHub Pages` หาก GitHub ขออนุญาต
5. รอ workflow ทำงานจนเป็นเครื่องหมายถูกสีเขียว
6. เปิด URL เว็บไซต์รูปแบบ `https://YOUR-USERNAME.github.io/loy-krathong-3d/`

> อย่าอัปโหลดไฟล์ `.env` หรือโฟลเดอร์ `node_modules` ขึ้น GitHub; `.gitignore` ได้ตั้งค่าไม่ให้ส่งไฟล์เหล่านี้แล้ว
>
> Workflow จะคำนวณ base path จากชื่อ Repository ให้อัตโนมัติ รองรับทั้ง Repository site (`username.github.io/repo/`) และ User site (`username.github.io/`) ไม่ต้องแก้ `vite.config.ts` เอง

### 4. เชื่อม Supabase ให้ทุกเครื่องเห็นกระทงร่วมกัน (แนะนำ)

หากยังไม่ใส่ค่า Supabase เว็บไซต์จะเปิดใน Local Demo Mode ซึ่งข้อมูลจะอยู่แค่ในเบราว์เซอร์เครื่องนั้น

เพื่อให้บันทึกและเห็นกระทงร่วมกันทุกคน:

1. สร้างโปรเจกต์ที่ [supabase.com](https://supabase.com/)
2. เปิด **Project Settings → API** แล้วคัดลอก Project URL และ anon/public key
3. ไปที่ GitHub Repository → **Settings → Secrets and variables → Actions → New repository secret**
4. เพิ่ม Secret สองรายการนี้:
   - `VITE_SUPABASE_URL` = Project URL ของ Supabase
   - `VITE_SUPABASE_ANON_KEY` = anon/public key (ห้ามใช้ `service_role`)
5. เปิด **SQL Editor** ใน Supabase แล้วรันไฟล์ `supabase/schema.sql`
6. ไปที่ GitHub → **Actions** → เลือก workflow แล้วกด **Run workflow** เพื่อ build/deploy ใหม่ หรือ push commit ใหม่หนึ่งครั้ง

หลัง deploy สำเร็จ เว็บจะใช้ Supabase ร่วมกันได้ทั้ง iOS, Android และคอมพิวเตอร์

### 5. อัปเดตเว็บไซต์ในอนาคต

เมื่อแก้โค้ดแล้ว ให้ใช้คำสั่งนี้เพื่อส่งเวอร์ชันใหม่ขึ้น GitHub:

```bash
git add .
git commit -m "Update website"
git push
```

GitHub Actions จะ deploy เวอร์ชันใหม่ให้อัตโนมัติ

### ทางเลือก: Vercel / Netlify

หากต้องการใช้ Vercel หรือ Netlify ก็ยังทำได้ โดยตั้ง Build Command เป็น `npm run build` และ Output Directory เป็น `dist` พร้อมกำหนด Environment Variables ของ Supabase

## โหมดทดลองโดยไม่เชื่อม Supabase

ถ้ายังไม่ใส่ค่า Supabase แอปจะทำงานใน Local Demo Mode:

- แสดงตัวอย่างกระทงในแม่น้ำ
- บันทึกกระทงใหม่ไว้ใน `localStorage` ของเบราว์เซอร์
- ทดลองหน้า Customize, แอนิเมชันลอยกระทง และ Community River ได้
- ข้อมูลจะไม่ถูกส่งไปยังผู้ใช้คนอื่นหรือ Supabase จนกว่าจะตั้งค่าโปรเจกต์

## ฟีเจอร์หลัก

- **Landing:** ฉากค่ำคืน 3D, แสงจันทร์และแสงสะท้อนบนผิวน้ำ
- **Customizer:** เลือกฐานใบตอง / ดอกบัว / กะลามะพร้าว และดอกดาวเรือง / กล้วยไม้ / บานไม่รู้โรยแบบ Real-time
- **3D Model:** หมุนดูได้ 360°, เปลวเทียนไหว, แสง Point Light และการลอยขึ้นลงตามคลื่น
- **Wish flow:** กรอกชื่อและคำอธิษฐาน บันทึก แล้วชมแอนิเมชันการลอยกระทง
- **Community River:** แสดงกระทงจากฐานข้อมูล เลือกกระทงเพื่ออ่านข้อความ และรับ INSERT event แบบ Realtime
- **Responsive + PWA:** รองรับ iPhone/iPad/Android/Desktop, Add to Home Screen, ไอคอนติดตั้ง, Service Worker และ safe-area สำหรับ iOS
- **Mobile performance:** ลด pixel ratio, ปิด shadow map และลดจำนวนดาว/mesh บนอุปกรณ์จอเล็กเพื่อลดภาระ GPU

## คำสั่ง

```bash
npm run dev       # เริ่ม dev server
npm run typecheck # ตรวจ TypeScript
npm run build     # สร้าง production build ที่ dist/
npm run preview   # ทดลองเปิด production build
```

## โครงสร้างไฟล์

```text
loy-krathong-3d/
├── .github/workflows/deploy.yml
├── public/
│   ├── .nojekyll
│   ├── icons/ (192px, 512px, maskable)
│   ├── apple-touch-icon.png
│   ├── manifest.webmanifest
│   ├── sw.js
│   ├── _redirects
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── PWAInstallPrompt.tsx
│   │   ├── KrathongModel.tsx
│   │   └── RiverCanvas.tsx
│   ├── hooks/
│   │   └── useKrathongs.ts
│   ├── lib/
│   │   ├── krathongs.ts
│   │   └── supabase.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── supabase/schema.sql
├── .env.example
├── package.json
└── vite.config.ts
```

## หมายเหตุด้านการพัฒนาต่อ

- ฉากน้ำและองค์ประกอบ 3D ในเวอร์ชันนี้สร้างจาก geometry/material ของ Three.js ภายในแอป ไม่ต้องดาวน์โหลดโมเดล GLB เพิ่ม
- Community River แสดงกระทงล่าสุดสูงสุด 18 ใบในฉาก 3D เพื่อรักษาประสิทธิภาพ และแสดงรายการคำอธิษฐานล่าสุดสูงสุด 8 รายการในแถบด้านข้าง
- Realtime ที่เปิดใช้งานตอนนี้เป็นการรับเหตุการณ์ INSERT; การอ่านข้อมูลเริ่มต้นทำผ่าน SELECT
- โปรเจกต์นี้เป็น Starter App ที่พร้อมต่อยอด production ได้ ควรเพิ่ม rate limit / CAPTCHA หรือระบบยืนยันตัวตนก่อนเปิดรับข้อมูลสาธารณะในวงกว้าง
