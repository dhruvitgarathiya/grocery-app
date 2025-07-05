# GreenCart - E-Commerce Platform

## 🌐 Live Demo

**Project Link**: https://grocery-app-1-w432.onrender.com/

A full-stack e-commerce application built with React, Node.js, and MongoDB. GreenCart provides a complete online grocery shopping experience with user and seller authentication, product management, order processing, and address management.

## 🌟 Features

### Customer Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Product Browsing**: Browse products with search and filtering capabilities
- **Shopping Cart**: Add, remove, and manage cart items
- **Address Management**: Add, edit, and manage delivery addresses
- **Order Management**: Place orders, track status, and cancel orders
- **Payment**: Cash on Delivery (COD) payment system
- **Responsive Design**: Mobile-friendly interface

### Seller Features

- **Seller Authentication**: Secure seller login with environment-based credentials
- **Product Management**: Add, edit, and manage product inventory
- **Order Management**: View all orders, update status, and track statistics
- **Stock Management**: Update product availability and stock levels
- **Dashboard**: Comprehensive seller dashboard with order analytics

### Technical Features

- **JWT Authentication**: Secure token-based authentication
- **File Upload**: Product image upload with Cloudinary integration
- **Real-time Updates**: Live order status updates
- **Error Handling**: Comprehensive error handling and user feedback
- **Responsive UI**: Modern, responsive design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware
- **Cloudinary** - Cloud image storage
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
greencart/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context for state management
│   │   ├── assets/        # Static assets and dummy data
│   │   └── App.jsx        # Main application component
│   ├── package.json
│   └── vite.config.js
├── server/                # Backend Node.js application
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   ├── uploads/          # File upload directory
│   ├── server.js         # Main server file
│   └── package.json
├── README.md
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd greencart
   ```

2. **Install backend dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create `.env` file in the server directory:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   SELLER_EMAIL=admin@example.com
   SELLER_PASSWORD=greatstack123
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

   Create `.env` file in the client directory:

   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

5. **Start the development servers**

   Start the backend server:

   ```bash
   cd server
   npm run server
   ```

   Start the frontend development server:

   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## 📚 API Endpoints

### Authentication

- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/seller/login` - Seller login

### Products

- `GET /api/product/list` - Get all products
- `POST /api/product/add` - Add new product (seller only)
- `POST /api/product/stock` - Update product stock (seller only)

### Orders

- `POST /api/order/cod` - Place COD order
- `GET /api/order/user` - Get user orders
- `GET /api/order/seller` - Get all orders (seller only)
- `POST /api/order/status` - Update order status (seller only)

### Cart

- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `POST /api/cart/get` - Get user cart

### Addresses

- `POST /api/address/add` - Add new address
- `POST /api/address/get` - Get user addresses
- `POST /api/address/delete` - Delete address

## 🔐 Authentication

### User Authentication

- JWT token-based authentication
- Tokens stored in localStorage
- Automatic token refresh
- Protected routes with middleware

### Seller Authentication

- Environment-based credentials
- Secure seller login with JWT tokens
- Protected seller routes
- Session management

## 📱 Responsive Design

The application is fully responsive and works on:

- Mobile phones
- Desktop computers
- Tablets

## 🚀 Deployment

### Backend Deployment

- Deploy to platforms like Render, Heroku, or Railway
- Set up environment variables
- Configure MongoDB connection
- Set up Cloudinary for image storage

### Frontend Deployment

- Build the application: `npm run build`
- Deploy to platforms like Vercel, Netlify, or GitHub Pages
- Configure environment variables
- Set up custom domain (optional)

## 🔧 Environment Variables

**Backend (.env)**

- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `SELLER_EMAIL`: Seller login email
- `SELLER_PASSWORD`: Seller login password
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

**Frontend (.env)**

- `VITE_BACKEND_URL`: Backend API URL

## 📖 Additional Documentation

- Check the documentation files
- Review the API endpoints
- Test the application features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Dhruvit Garathiya**

- GitHub: [@dhruvitgarathiya](https://github.com/dhruvitgarathiya)
- Project: [GreenCart](https://github.com/dhruvitgarathiya/grocery-app)
