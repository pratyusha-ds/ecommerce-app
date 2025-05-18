# E-commerce Website

## Overview

This is a simple full-stack e-commerce website built using React, TypeScript, and other modern technologies. It includes a user-friendly storefront and an admin panel for managing products, categories, orders, and users. Payment processing is handled by Stripe, and the database is PostgreSQL, accessed via Prisma and GraphQL. Zustand is used for state management.

## Technologies Used

- **Frontend:**
  - React
  - TypeScript
  - Apollo Client
- **Backend:**
  - Node.js
  - GraphQL (Apollo Server)
  - Prisma with PostgreSQL
  - Stripe
- **State Management:**
  - Zustand

## Live links

- **Frontend (Netlify)**: [https://pd-e-commerce-app.netlify.app](https://pd-e-commerce-app.netlify.app)
- **Admin Panel (Netlify)**: [https://pd-e-commerce-admin.netlify.app ](https://pd-e-commerce-admin.netlify.app)
- **Backend (Render)**: [https://ecommerce-app-bt2j.onrender.com](https://ecommerce-app-bt2j.onrender.com)

## Features

### User Features

- **Product Catalog:** Browse and search for products.
- **Shopping Cart:** Add, remove, and manage items in your cart.
- **Checkout:** Securely process payments using Stripe.
- **User Authentication:** User registration and login.
- **User Profile:** View user information and past orders.

### Admin Features

- **Product Management:**
  - Add, edit, and delete products.
- **Category Management:**
  - Add, edit, and delete categories.
- **Order Management:**
  - View, delete and change order status (e.g., pending, processing, shipped, completed).
- **User Management:**
  - View and delete users.
- **Initial Database Setup**
  - `seed.ts` script to populate the database with:
    - Initial admin user.
    - Product categories.
    - Sample products.

## Contributing

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Commit your changes.
4.  Push to the branch.
5.  Submit a pull request.

## Credits

All images taken from the free license section of [Unsplash](https://unsplash.com/).
