# 🛒 বাজার দর (BazarDor)

A web application for exploring daily commodity prices in Bangladesh. Browse products by category, view product details, and access your account through authentication pages.

## ✨ Features

- **Product Listing:** Browse available products and their prices.
- **Category Filtering:** Explore products by category.
- **Product Details:** Open individual product detail pages.
- **Price Ticker:** View a price ticker on the homepage.
- **Authentication:** Sign-in and sign-up pages.
- **User Profile:** Access and update profile information.
- **Responsive Design:** Layout designed for mobile, tablet, and desktop screens.
- **Bangla Interface:** A user-friendly interface for Bangladeshi users.

## 🛠️ Technologies Used

- Next.js
- React
- TypeScript
- CSS
- npm
- BazarDor API

## 🚀 Getting Started

### Prerequisites

Install Node.js and npm before starting.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sajidraian/BazarDor.git
   ```

2. Navigate to the project directory:

   ```bash
   cd BazarDor
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure any required environment variables in a local `.env.local` file. Never commit secret keys or credentials to GitHub.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```text
bazardor/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── category/
│   │   ├── product/
│   │   ├── profile/
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   └── lib/
├── package.json
└── README.md
```

## 🔗 API

The project uses the BazarDor API provided for the Programming Hero assignment. API availability and endpoint configuration may affect the data displayed.

## 🏗️ Build

To create a production build, run:

```bash
npm run build
```

## 🌐 Deployment

The application can be deployed on a platform that supports Next.js, such as Vercel. Configure all required environment variables in the deployment platform before deploying.

## 👨‍💻 Author

**Sajid Al Raian**

GitHub: [@sajidraian](https://github.com/sajidraian)

## 📄 License

This project was created for educational purposes as part of a Programming Hero assignment.