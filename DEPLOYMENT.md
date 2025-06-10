# GreenCart Deployment Guide

This guide explains how to deploy the GreenCart application (both frontend and backend) with proper environment variable configuration.

## Environment Variables Setup

### Frontend (Client) Environment Variables

Create a `.env` file in the `client` directory:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:5000
```

For production, update this to your deployed backend URL:

```env
VITE_BACKEND_URL=https://your-backend-domain.com
```

### Backend (Server) Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/grocery-mart

# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here

# Client URL for CORS (update for production)
CLIENT_URL=http://localhost:5173

# Admin credentials
SELLER_EMAIL=admin@example.com
SELLER_PASSWORD=greatstack123

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

For production, update these values:

```env
# Production Configuration
MONGODB_URI=your_production_mongodb_uri
PORT=5000
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=https://your-frontend-domain.com
```

## Development Setup

1. **Install dependencies:**

   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd client
   npm install
   ```

2. **Start MongoDB:**

   ```bash
   # Windows
   start-mongodb.bat

   # Or manually start MongoDB service
   ```

3. **Start the backend server:**

   ```bash
   cd server
   npm start
   ```

4. **Start the frontend development server:**
   ```bash
   cd client
   npm run dev
   ```

## Production Deployment

### Backend Deployment (Node.js/Express)

1. **Deploy to platforms like:**

   - Heroku
   - Vercel
   - Railway
   - DigitalOcean App Platform
   - AWS Elastic Beanstalk

2. **Set environment variables in your deployment platform**

3. **Update package.json scripts:**
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

### Frontend Deployment (Vite/React)

1. **Build the application:**

   ```bash
   cd client
   npm run build
   ```

2. **Deploy to platforms like:**

   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront

3. **Set environment variables in your deployment platform**

## CORS Configuration

The backend is configured to handle CORS for both development and production:

- **Development:** Allows `http://localhost:5173` and `http://localhost:3000`
- **Production:** Uses the `CLIENT_URL` environment variable

## Security Considerations

1. **JWT Secret:** Use a strong, unique secret in production
2. **Database:** Use a secure MongoDB connection string
3. **CORS:** Only allow necessary origins
4. **Environment Variables:** Never commit `.env` files to version control

## Testing

Use the provided test scripts to verify functionality:

```bash
# Test seller login
node test-seller-login.js

# Test seller logout
node test-seller-logout.js
```

## Troubleshooting

### Common Issues

1. **CORS Errors:**

   - Ensure `CLIENT_URL` is set correctly in backend
   - Check that the frontend URL matches the allowed origins

2. **Database Connection:**

   - Verify `MONGODB_URI` is correct
   - Ensure MongoDB is running

3. **Environment Variables:**
   - Check that all required variables are set
   - Restart servers after changing environment variables

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

This will show detailed logs for environment variables and server configuration.
