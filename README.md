# 🛒 BazarDor — বাজার দর

### Smart Commodity Price Explorer for Bangladesh 🇧🇩

<p align="center">
  <strong>Know the Price. Make Smarter Choices.</strong>
</p>

<p align="center">
  A modern, responsive web application for exploring commodity prices in Bangladesh, browsing product categories, and accessing account features through a Bangla-friendly interface.
</p>

<p align="center">
  <a href="https://bazardor26.vercel.app/">
    <img src="https://img.shields.io/badge/Live_Demo-Visit_BazarDor-16a34a?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/sajidraian/BazarDor">
    <img src="https://img.shields.io/badge/GitHub-Source_Code-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel" alt="Vercel" />
</p>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Project Preview](#-project-preview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Integration](#-api-integration)
- [Project Structure](#-project-structure)
- [Build and Run](#-build-and-run)
- [Deployment](#-deployment)
- [Security](#-security)
- [Learning Objectives](#-learning-objectives)
- [Author](#-author)
- [License](#-license)

---

## 📖 Overview

**BazarDor (বাজার দর)** is a web application designed to make commodity price information easier to explore for people in Bangladesh.

The application brings product listings, category-based browsing, product details, price information, and account-related pages together in one responsive interface.

Built with Next.js, React, and TypeScript, BazarDor demonstrates the development of a modern web application that integrates external APIs, authentication functionality, and responsive UI design.

**Live Application:** [https://bazardor26.vercel.app/](https://bazardor26.vercel.app/)

## 🖥️ Project Preview

<p align="center">
  <img src="public/assets/preview (2).png" alt="BazarDor application preview" width="100%" />
</p>

<p align="center">
  <em>BazarDor — A commodity price explorer for Bangladesh.</em>
</p>



## ✨ Features

### 🛍️ Product Discovery
Browse available commodities and explore their displayed prices.

### 🗂️ Category-Based Browsing
Filter products by category to find relevant items more easily.

### 🔎 Product Details
Open individual product pages to explore product-specific information.

### 📈 Price Ticker
View commodity price information through the homepage ticker.

### 🔐 Authentication
Dedicated sign-up and sign-in pages powered by the project's authentication setup.

### 👤 User Profile
Access profile-related functionality through a dedicated profile section.

### 📱 Responsive Interface
A responsive layout designed for mobile, tablet, and desktop screens.

### 🇧🇩 Bangla-Friendly Experience
An interface designed with Bangladeshi users and local commodity information in mind.

---

## 🧰 Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Web application framework and routing |
| React | Component-based user interface |
| TypeScript | Type-safe application development |
| CSS | Styling and responsive layouts |
| Better Auth | Authentication functionality |
| MongoDB | Database integration |
| BazarDor API | Commodity and category data |
| npm | Dependency management |
| Git and GitHub | Version control and source code hosting |
| Vercel | Application deployment |

---

## 🚀 Getting Started

Follow these instructions to run BazarDor on your local machine.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/sajidraian/BazarDor.git
```

### 2. Navigate to the Project Directory

```bash
cd BazarDor
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory of the project.

Add the variables required by your local configuration. See the [Environment Variables](#-environment-variables) section below.

### 5. Start the Development Server

```bash
npm run dev
```

### 6. Open the Application

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

BazarDor uses environment variables for authentication, database connectivity, and provider configuration.

Create a `.env.local` file in the project root:

```env
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_auth_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Replace each placeholder with the appropriate value from your configuration.

**Important:**

- Use the local application URL for local development.
- Configure the production authentication URL separately in Vercel.
- Set up Google and GitHub OAuth credentials if you intend to use those providers.
- Use a strong, private authentication secret.
- Never commit `.env.local` or expose database credentials and secret keys in a public repository.
- Ensure `.env.local` is excluded through `.gitignore`.

---

## 🔌 API Integration

BazarDor integrates with the API provided for the Programming Hero assignment to retrieve commodity and category information.

### Base URL

```text
https://openapi.programming-hero.com/api/bazardor
```

### Available Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | Retrieve the product collection |
| GET | `/products?category=chal` | Retrieve products filtered by category |
| GET | `/products/1` | Retrieve a specific product |
| GET | `/categories` | Retrieve available categories |
| GET | `/categories/chal` | Retrieve category-specific information |

### API Availability

The application depends on the availability and response format of the configured API. If the API becomes unavailable or returns unexpected data, some product information or category features may not work as expected.

---

## 📁 Project Structure

```text
BazarDor/
├── public/
│   └── assets/
│       └── preview.png
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   ├── category/
│   │   ├── product/
│   │   ├── profile/
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   └── lib/
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

*This is an overview of the expected main directories. Your actual project may contain additional files or a slightly different structure.*

---

## 🏗️ Build and Run

### Run in Development Mode

```bash
npm run dev
```

### Create a Production Build

```bash
npm run build
```

### Start the Production Server Locally

```bash
npm run start
```

Run the production server after successfully creating a production build.

---

## 🌐 Deployment

BazarDor is deployed on [Vercel](https://vercel.com/).

### Live URL

**[https://bazardor26.vercel.app/](https://bazardor26.vercel.app/)**

### Deployment Steps

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure all required production environment variables.
4. Verify the production URL and authentication provider configuration.
5. Deploy the application.
6. Test product listings, category navigation, and authentication flows.

### Authentication Configuration

For production authentication:

- Set the correct production URL in the relevant environment variables.
- Configure the appropriate trusted origins in Better Auth when required.
- Verify Google and GitHub OAuth callback URLs if social authentication is enabled.
- Test session retrieval and sign-in/sign-up requests after deployment.

---

## 🔒 Security

Security is important when building applications with authentication and database access.

- Keep credentials and secrets in environment variables.
- Never upload `.env.local` to GitHub.
- Never expose MongoDB connection strings or OAuth client secrets.
- Store production secrets in Vercel Environment Variables.
- Use separate configuration values for local development and production.
- Verify authentication origins and provider callback URLs before deployment.

---

## 🎯 Learning Objectives

This project provides practical experience with:

- Building a web application using Next.js and React.
- Writing application code with TypeScript.
- Creating reusable UI components.
- Integrating external APIs.
- Implementing authentication-related workflows.
- Working with database configuration.
- Designing responsive interfaces.
- Managing code with Git and GitHub.
- Deploying a web application to Vercel.

---

## 👨‍💻 Author

### Sajid Al Raian

Developer of BazarDor.

<p>
  <a href="https://github.com/sajidraian">
    <img src="https://img.shields.io/badge/GitHub-sajidraian-181717?style=for-the-badge&logo=github" alt="GitHub Profile" />
  </a>
  <a href="https://bazardor26.vercel.app/">
    <img src="https://img.shields.io/badge/Live_Project-BazarDor-16a34a?style=for-the-badge&logo=vercel" alt="Live Project" />
  </a>
</p>

- **GitHub Profile:** [github.com/sajidraian](https://github.com/sajidraian)
- **Repository:** [github.com/sajidraian/BazarDor](https://github.com/sajidraian/BazarDor)
- **Live Application:** [bazardor26.vercel.app](https://bazardor26.vercel.app/)

---

## 📄 License

This project was created for educational purposes as part of a Programming Hero assignment.

No separate open-source license has been specified for this repository. All rights and permissions remain subject to the applicable terms of the project dependencies and any third-party assets used.

---

<p align="center">
  <strong>Made with ❤️ for Bangladesh 🇧🇩</strong>
</p>

<p align="center">
  <sub>BazarDor — Making commodity information easier to explore.</sub>
</p>