# QR Generator Pro

A modern, responsive web application for creating, managing, and exporting QR codes for contact information and websites. Built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

---

## ✨ Features

- **Dynamic QR Code Generation**: Create QR codes for URLs, complete with associated contact details (Name, Phone Number).
- **Secure User Authentication**: Full signup and sign-in functionality using Supabase Auth.
- **Email Confirmation**: New users receive a professional HTML email to verify their account.
- **Cloud Storage**: Authenticated users can save their generated QR codes to the cloud, accessible from any device.
- **Full CRUD Functionality**: Create, Read, Update (labels), and Delete your saved QR codes.
- **Live Search & Filtering**: Instantly search through your saved codes by label, name, or URL.
- **Multiple View Modes**: View your saved QR codes in a responsive grid or a detailed list.
- **Powerful Export Options**:
  - Download any QR code as a high-quality **PNG** image.
  - Export all saved QR codes at once into a clean, multi-page, two-column **PDF** document.
- **Fully Responsive Design**: A seamless experience on desktops, tablets, and mobile devices.

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database**: [Supabase](https://supabase.io/)
- **UI Icons**: [Lucide React](https://lucide.dev/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) & [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for local development and migrations)

### Local Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Yogesh-1910/qr-generator-pro.git
    cd qr-generator-pro
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    -   Create a file named `.env` in the root of your project.
    -   Add your Supabase project URL and Anon Key to this file. You can get these from your Supabase project's Dashboard under **Settings -> API**.

    ```env
    # .env
    VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
    VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

---

## ☁️ Supabase Configuration

This project relies on a Supabase backend. If you are setting it up from scratch, follow these steps.

### 1. Database Schema

Create a table named `qr_codes` in your Supabase database with the following schema. **Note the `qr_code_data_url` column type must be `text` to store the long image data.**

```sql
CREATE TABLE public.qr_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url text NOT NULL,
  label text NOT NULL,
  qr_code_data_url text NOT NULL,
  qr_type text NOT NULL DEFAULT 'contact'::text,
  contact_name text NULL,
  phone_number text NULL,
  CONSTRAINT qr_codes_pkey PRIMARY KEY (id)
);
```

### 2. Row Level Security (RLS)

RLS is **enabled** for the `qr_codes` table for security. You must add the following policies from the Supabase Dashboard under **Authentication -> Policies**.

-   **Allow READ access for authenticated users:**
    -   **Policy Name:** `Allow individual read access`
    -   **Target Roles:** `authenticated`
    -   **USING expression:** `auth.uid() = user_id`

-   **Allow INSERT access for authenticated users:**
    -   **Policy Name:** `Allow individual insert access`
    -   **Target Roles:** `authenticated`
    -   **WITH CHECK expression:** `auth.uid() = user_id`

-   **Allow UPDATE access for authenticated users:**
    -   **Policy Name:** `Allow individual update access`
    -   **Target Roles:** `authenticated`
    -   **USING expression:** `auth.uid() = user_id`

-   **Allow DELETE access for authenticated users:**
    -   **Policy Name:** `Allow individual delete access`
    -   **Target Roles:** `authenticated`
    -   **USING expression:** `auth.uid() = user_id`

### 3. Email Confirmation

To enable email verification for new signups:
1.  Go to **Authentication -> Settings** in your Supabase dashboard.
2.  Toggle **Confirm email** to ON.
3.  (Optional) Customize the email template under **Authentication -> Templates -> Confirm signup**.

---
### Contributors
Yogesh S - 
https://github.com/Yogesh-1910

Danush G - 
https://github.com/Danush6123
