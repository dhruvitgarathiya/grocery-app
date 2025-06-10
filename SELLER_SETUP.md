# Seller Setup Guide

This guide explains how to set up seller authentication for the GreenCart e-commerce application.

## Seller Authentication System

The GreenCart application uses a single seller account system where seller credentials are configured through environment variables. This provides a simple and secure way to manage seller access.

## Environment Variables Setup

### Backend (.env)

Add these variables to your backend `.env` file:

```env
# Seller Credentials
SELLER_EMAIL=admin@greencart.com
SELLER_PASSWORD=your_secure_seller_password

# JWT Secret (for authentication)
JWT_SECRET=your_super_secret_jwt_key_here

# Other existing variables
MONGODB_URI=mongodb://localhost:27017/greencart
PORT=5000
NODE_ENV=development
```

## Seller Features

Once logged in as a seller, you can access:

### 1. Manage Orders

- View all incoming orders
- Update order status (processing → delivered)
- View order statistics
- Cancel orders if needed

### 2. Manage Products

- View all products in the store
- Update product details
- Manage product stock
- Delete products

### 3. Add Products

- Add new products to the store
- Upload product images
- Set product prices and descriptions
- Manage product categories

## Seller Login Process

1. **Click "Seller Login"** in the navbar
2. **Enter credentials**:
   - Email: Use the email set in `SELLER_EMAIL`
   - Password: Use the password set in `SELLER_PASSWORD`
3. **Access seller panel** with dropdown menu options

## Security Considerations

### Environment Variables

- Keep seller credentials secure
- Use strong passwords
- Don't commit `.env` files to version control
- Use different credentials for development and production

### Authentication

- Seller authentication uses JWT tokens
- Tokens are stored in HTTP-only cookies
- Automatic logout after 7 days
- Secure cookie settings for production

## API Endpoints

### Seller Authentication

```
POST /api/seller/login - Seller login
GET /api/seller/is-auth - Check seller authentication
GET /api/seller/logout - Seller logout
```

### Order Management

```
GET /api/order/seller - Get all orders (seller view)
PUT /api/order/status - Update order status
GET /api/order/stats - Get order statistics
```

### Product Management

```
GET /api/product - Get all products
POST /api/product - Add new product
PUT /api/product/:id - Update product
DELETE /api/product/:id - Delete product
```

## Testing Seller Login

1. **Set up environment variables** in your backend `.env` file
2. **Start the backend server**
3. **Click "Seller Login"** in the navbar
4. **Enter the credentials** you set in the environment variables
5. **Verify access** to seller panel and features

## Troubleshooting

### Common Issues

1. **"Invalid email or password"**

   - Check that `SELLER_EMAIL` and `SELLER_PASSWORD` are set correctly
   - Ensure the backend server is running
   - Verify environment variables are loaded

2. **"Server configuration error"**

   - Check that `JWT_SECRET` is set in environment variables
   - Restart the backend server after changing environment variables

3. **Seller panel not showing**
   - Check browser console for errors
   - Verify seller authentication is successful
   - Check if seller routes are properly configured

### Debug Steps

1. Check backend server logs for authentication errors
2. Verify environment variables are loaded correctly
3. Test seller login API endpoint directly
4. Check browser network tab for failed requests

## Production Deployment

### Environment Variables for Production

```env
# Seller Credentials (use strong, unique credentials)
SELLER_EMAIL=admin@yourdomain.com
SELLER_PASSWORD=your_very_secure_production_password

# JWT Secret (use a strong, random secret)
JWT_SECRET=your_production_jwt_secret_key

# Database
MONGODB_URI=your_production_mongodb_connection_string

# Server
PORT=5000
NODE_ENV=production
```

### Security Checklist

- [ ] Use strong, unique seller credentials
- [ ] Set secure JWT secret
- [ ] Enable HTTPS in production
- [ ] Use secure cookie settings
- [ ] Regularly rotate credentials
- [ ] Monitor authentication logs

## Support

For issues related to seller authentication or access:

1. Check environment variable configuration
2. Verify backend server is running
3. Check browser console for errors
4. Review server logs for authentication issues
