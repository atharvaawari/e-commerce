# MERN Stack Ecommerce Application

A full-stack Ecommerce application built with MongoDB, Express, React, and Node.js.

## Features

- **User Authentication**: Register, Login (JWT-based), Logout.
- **Role-Based Access Control**: 
  - **Admin**: Manage products (Add, Edit, Delete, Sync), View Dashboard.
  - **User**: Browse products, Add to Cart, Wishlist, Checkout.
- **Product Management**: 
  - CRUD operations for products.
  - **Sync API**: Fetch products from external API (FakeStoreAPI).
  - Rich product details (Images, Variations).
- **Shopping Experience**:
  - Home Page with Featured Products.
  - Product Details Page.
  - **Cart**: Add/Remove items, Update quantity, Real-time total.
  - **Wishlist**: Save favorite items.
  - **Checkout**: Place orders (Simulation).
- **Communication**:
  - **Enquiry Form**: Send messages to admin (via Nodemailer).
  - **Chatbot**: Rule-based assistant for quick FAQs.

## Tech Stack

- **Frontend**: React (Vite), Ant Design, TanStack Query, TailwindCSS.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Nodemailer.

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (Atlas)

### 1. Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   - Update `MONGODB_URI` with your connection string.
   - Update `EMAIL_USER` and `EMAIL_PASS` for enquiry emails.
4. Start the server:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:4000`.

### 2. Frontend Setup

1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   - Ensure `VITE_API_BASE_URL` points to your backend (default: `http://localhost:4000/api/v1`).
4. Start the development server:
   ```bash
   npm run dev
   ```
   App will run on `http://localhost:5173`.

## Admin Access

- **Admin Login**:
  - Email: `admin@example.com`
  - Password: `admin123`
  - (This user is created automatically by the seed script if not present).

## Project Structure

- `Backend/src`: Models, Controllers, Routes.
- `Frontend/src`: Pages, Components, Context, API hooks.


