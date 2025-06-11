# GreenCart - E-Commerce Platform

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

4. **Start the development servers**

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

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## 📚 API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/is-auth` - Check user authentication
- `POST /api/seller/login` - Seller login
- `GET /api/seller/is-auth` - Check seller authentication

### Products
- `GET /api/product/list` - Get all products
- `POST /api/product/add` - Add new product (seller only)
- `POST /api/product/stock` - Update product stock (seller only)

### Orders
- `POST /api/order/cod` - Place COD order
- `GET /api/order/user` - Get user orders
- `GET /api/order/seller` - Get all orders (seller only)
- `PUT /api/order/status` - Update order status (seller only)
- `PUT /api/order/cancel` - Cancel order
- `GET /api/order/stats` - Get order statistics (seller only)

### Addresses
- `POST /api/address/add` - Add new address
- `POST /api/address/get` - Get user addresses
- `DELETE /api/address/delete` - Delete address

## 🔐 Authentication

### User Authentication
- JWT token-based authentication
- Tokens stored in localStorage
- Automatic token refresh and validation
- Secure password hashing with bcrypt

### Seller Authentication
- Environment-based credentials
- Secure seller login with JWT tokens
- Protected seller-only endpoints
- Role-based access control

## 🛒 Shopping Flow

1. **Browse Products**: Users can browse products with search and filtering
2. **Add to Cart**: Add products to shopping cart with quantity selection
3. **Manage Addresses**: Add and select delivery addresses
4. **Place Order**: Complete checkout with COD payment
5. **Track Orders**: Monitor order status and history
6. **Seller Management**: Sellers can manage products and orders

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🚀 Deployment

### Backend Deployment
- Deploy to platforms like Render
- Set up environment variables
- Configure MongoDB connection
- Set up Cloudinary for image storage

### Frontend Deployment
- Build the application: `npm run build`
- Deploy to platforms like Vercel, Netlify, or GitHub Pages
- Configure environment variables for production

## 🔧 Configuration


## 📖 Additional Documentation

- [Address Management](ADDRESS_MANAGEMENT_README.md)
- [Seller Setup](SELLER_SETUP.md)
- [Payment Setup](PAYMENT_SETUP.md)
- [Order Management](ORDER_MANAGEMENT.md)
- [Login Setup](LOGIN_SETUP.md)
- [Deployment Guide](DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the documentation files
- Review the API endpoints
- Check the console for error messages
- Ensure all environment variables are set correctly

## 🎯 Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Email notifications
- Order tracking with real-time updates
- Product reviews and ratings
- Advanced search and filtering
- Inventory management system
- Analytics dashboard
- Mobile app development

---

**GreenCart** - Your complete e-commerce solution for grocery shopping! 🛒✨
