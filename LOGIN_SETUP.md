# GreenCart Login System Setup Guide

## Overview

Your GreenCart application now has a comprehensive login system with user registration, authentication, and session management.

## Features Implemented

### ✅ User Authentication

- User registration with validation
- User login with secure authentication
- JWT token-based session management
- Automatic session restoration on app startup
- Secure logout functionality

### ✅ Enhanced Security

- Password hashing with bcrypt
- JWT tokens with expiration (7 days)
- HTTP-only cookies for token storage
- CSRF protection
- Input validation and sanitization

### ✅ User Experience

- Responsive login/register modal
- Real-time form validation
- Password visibility toggle
- Loading states with spinners
- Toast notifications for feedback
- Error handling and user-friendly messages

## Environment Variables Setup

### Backend (.env)

```env
# JWT Secret (generate a strong secret)
JWT_SECRET=your_super_secret_jwt_key_here

# Database URL
MONGODB_URI=mongodb://localhost:27017/greencart

# Server Configuration
PORT=5000
NODE_ENV=development

# Seller Credentials (for seller login)
SELLER_EMAIL=admin@example.com
SELLER_PASSWORD=greatstack123
```

### Frontend (.env)

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:5000
```

## API Endpoints

### User Authentication

- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/is-auth` - Check authentication status
- `GET /api/user/logout` - User logout

### Request/Response Format

#### Registration

```javascript
// Request
POST /api/user/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

// Response
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login

```javascript
// Request
POST /api/user/login
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

// Response
{
  "success": true,
  "message": "User logged in successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Usage in Components

### Using the Login Component

```jsx
import { useAppcontext } from "../context/AppContext";

const MyComponent = () => {
  const { setShowUserLogin, user, userLogout } = useAppcontext();

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={userLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => setShowUserLogin(true)}>Login</button>
      )}
    </div>
  );
};
```

### Context Functions Available

- `setShowUserLogin(boolean)` - Show/hide login modal
- `user` - Current user object (null if not logged in)
- `userLogout()` - Logout user and clear session
- `checkUserAuth()` - Check if user is authenticated

## Validation Rules

### Email Validation

- Must be a valid email format
- Case-insensitive (automatically converted to lowercase)

### Password Validation (Registration)

- Minimum 6 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Can include special characters: @$!%\*?&

### Name Validation

- Required field
- Trimmed of whitespace

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 10
2. **JWT Tokens**: Secure token-based authentication with 7-day expiration
3. **HTTP-Only Cookies**: Tokens stored in secure, HTTP-only cookies
4. **CSRF Protection**: SameSite cookie attribute for CSRF protection
5. **Input Sanitization**: All inputs are validated and sanitized
6. **Error Handling**: Secure error messages that don't leak sensitive information

## Troubleshooting

### Common Issues

1. **Login not working**

   - Check if backend server is running
   - Verify environment variables are set correctly
   - Check browser console for network errors

2. **Session not persisting**

   - Ensure cookies are enabled in browser
   - Check if JWT_SECRET is set in backend
   - Verify CORS settings if using different domains

3. **Registration validation errors**
   - Ensure password meets complexity requirements
   - Check if email is already registered
   - Verify all required fields are filled

### Testing the Login System

1. Start the backend server: `npm run dev` (in server directory)
2. Start the frontend: `npm run dev` (in client directory)
3. Open the application and click "Login"
4. Try registering a new account
5. Test login with the registered account
6. Verify session persistence by refreshing the page

## Next Steps

Consider implementing these additional features:

- Password reset functionality
- Email verification
- Social login (Google, Facebook)
- Two-factor authentication
- Account settings and profile management
- Remember me functionality
- Session timeout warnings
