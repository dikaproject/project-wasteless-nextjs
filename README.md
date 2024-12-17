# WasteLess - Food Waste Reduction Platform 🌱

## Overview
WasteLess is a marketplace platform designed to reduce food waste by connecting local food businesses with consumers. Sellers can list their products that are approaching their best-before date at discounted prices.

---

## Table of Contents
- [Account](#account)
- [Reminder](#reminder)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Products](#products)
  - [Orders](#orders)
- [Contributors](#contributors)
- [License](#license)

---

## Account

Link Demo Website : https://wasteless.intechsosmed.my.id

---
- email : demoadminhackathon2024@gmail.com (Demo Admin)
- passsword : adminhackathon2024
---
- email : intechofficialteam@gmail.com (Demo Seller)
- password : nuha1234
---
- email : dikagilang2007@gmail.com (Demo User)
- password : dika1234

---

## Reminder 
- if error Unhandled Runtime Error ChunkLoadError use **incognito** or **refresh the page**

## Features

### For Customers 👥
- Browse discounted food products
- Search and filter by location, category, and price
- View product details and seller information
- Cart management
- Order tracking
- Location-based product discovery
- Transaction history

### For Sellers 🏪
- Product management
- Order management
- Dashboard analytics
- Sales performance
- Product statistics
- Order tracking
- Discount management
- Profile management

### For Admin 👨‍💼
- Seller approval system
- Product moderation
- Category management
- User management
- Sales analytics
- Email notifications

---

## Tech Stack

### Frontend 🎨
- **Next.js 13 (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **React Hook Form**
- **React Hot Toast**

### Backend 💾
- **Node.js**
- **Express.js**
- **MySQL**
- **JSON Web Token**
- **Multer**
- **Nodemailer**

---

## Features 🚀
- **Authentication & Authorization**
- **File Upload**
- **Email Notifications**
- **Real-time Form Validation**
- **Responsive Design**
- **API Integration**
- **Location-based Services**

---

## Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/wasteless.git
   ```
2. Navigate to the project directory:
   ```bash
   cd wasteless
   ```
3. Install dependencies for the frontend and backend:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
4. Create a .env.local file in the project root with the following variables:
   ```bash
    NEXT_PUBLIC_API_URL=http://localhost:5000
    MIDTRANS_CLIENT_KEY=your_midtrans_client_key
   ```

6. Run the development server:
   ```bash
   cd frontend && npm run dev
   cd ../backend && npm start
   ```

---

## Database Schema
To be added.

---

## API Documentation

### Authentication
Details for login, signup, and token management.

### Products
APIs for managing products, including listing, updating, and deleting.

### Orders
Endpoints for creating, viewing, and managing orders.

---

## Contributors
- [Arya Fathdhillah Adi Saputra](https://github.com/afasarya)
- [Rasya Dika Pratama](https://github.com/dikaproject)
- [Sofwan Nuha Al Faruq](https://github.com/theonlyshannon)

---

## License
- This project is licensed under the [MIT License](LICENSE).
- API Wilayah Indonesia [API](https://github.com/emsifa/api-wilayah-indonesia.git)
---

Made with 💚 for a sustainable future.
