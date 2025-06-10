# Payment Setup Guide

This guide explains how to set up payment methods for the GreenCart e-commerce application.

## Available Payment Methods

- **COD** - Cash on Delivery (Pay when you receive your order)

## Payment Configuration

### 1. COD (Cash on Delivery)

COD is the only payment method available in this application. Users can place orders and pay when they receive their delivery.

#### COD Order Flow

1. User adds items to cart
2. User selects delivery address
3. User selects "COD" payment method
4. User places order
5. Order is created with `paymentType: "COD"` and `isPaid: false`
6. Seller processes and delivers the order
7. User pays cash on delivery

## Order Status Flow

### COD Orders

- **Order Placed**: Initial status when order is created
- **Processing**: Seller is preparing the order
- **Delivered**: Order has been delivered and paid
- **Cancelled**: Order was cancelled (can be cancelled before delivery)

## API Endpoints

### Order Management

```
POST /api/order/cod - Place COD order
GET /api/order/user - Get user orders
PUT /api/order/cancel - Cancel order
GET /api/order/seller - Get seller orders (for sellers)
PUT /api/order/status - Update order status (for sellers)
```

## Order Schema

```javascript
{
  userId: ObjectId,
  items: [
    {
      product: ObjectId,
      quantity: Number
    }
  ],
  amount: Number,
  address: ObjectId,
  status: String, // "order placed" | "processing" | "delivered" | "cancelled"
  paymentType: "COD",
  isPaid: Boolean, // false for COD orders
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

### Test Order Flow

1. Login as a user
2. Add products to cart
3. Go to cart page
4. Select delivery address
5. Choose COD payment method
6. Place order
7. Check order status in "My Orders"

### Test Seller Flow

1. Login as a seller
2. Go to Orders page
3. View incoming orders
4. Update order status (processing → delivered)
5. Check order statistics

## Troubleshooting

### Common Issues

1. **Order not appearing**

   - Check if user is authenticated
   - Verify order was created successfully
   - Check database connection

2. **Cannot place order**

   - Ensure user is logged in
   - Verify delivery address is selected
   - Check if cart has items

3. **Order status not updating**
   - Ensure seller is logged in
   - Check if order exists
   - Verify status is valid

### Error Messages

- "User not authenticated" - User needs to login
- "Please select a delivery address" - No address selected
- "Please select a payment method" - No payment method selected
- "Order not found" - Order doesn't exist or user doesn't own it
- "Order cannot be cancelled" - Order is already delivered or cancelled

## Security Considerations

### COD Orders

- No payment processing required
- Orders are marked as unpaid until delivery
- Users can cancel orders before delivery
- Sellers should verify payment on delivery

## Production Deployment

### Environment Variables

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=5000
NODE_ENV=production
```

### Deployment Checklist

1. Set up MongoDB database
2. Configure environment variables
3. Deploy backend server
4. Deploy frontend application
5. Test order flow
6. Monitor order processing

## Support

For issues related to payment processing or order management, please check:

1. Server logs for errors
2. Database connection
3. User authentication
4. Order status flow
