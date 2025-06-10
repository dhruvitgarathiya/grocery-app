# GreenCart Order Management System

## Overview

The GreenCart order management system provides comprehensive functionality for both users and sellers to manage orders, track status, and handle the complete order lifecycle.

## Features Implemented

### ✅ User Order Management

- **View Orders**: Users can see all their placed orders
- **Order Details**: Complete order information including products, delivery address, and payment status
- **Order Cancellation**: Users can cancel orders that haven't been delivered
- **Real-time Status**: Live order status updates
- **Order History**: Complete order history with timestamps

### ✅ Seller Order Management

- **All Orders View**: Sellers can see all customer orders
- **Order Status Updates**: Sellers can update order status (processing, delivered, cancelled)
- **Order Statistics**: Dashboard with order counts by status
- **Search & Filter**: Advanced filtering by status and search by order ID/customer name
- **Customer Details**: Access to customer information and delivery addresses

### ✅ Order Status System

- **Order Placed**: Initial status when order is created
- **Processing**: Order is being prepared for delivery
- **Delivered**: Order has been successfully delivered
- **Cancelled**: Order has been cancelled (by user or seller)

## API Endpoints

### User Order Endpoints

```javascript
// Get user orders
GET /api/order/user
Authorization: Required (User token)

// Place new order
POST /api/order/cod
Authorization: Required (User token)
Body: {
  userId: "user_id",
  items: [{ product: "product_id", quantity: 2 }],
  address: "address_id",
  paymentType: "COD"
}

// Cancel order
PUT /api/order/cancel
Authorization: Required (User token)
Body: {
  orderId: "order_id",
  userId: "user_id"
}
```

### Seller Order Endpoints

```javascript
// Get all orders (for sellers)
GET /api/order/seller
Authorization: Required (Seller token)

// Update order status
PUT /api/order/status
Authorization: Required (Seller token)
Body: {
  orderId: "order_id",
  status: "processing" | "delivered" | "cancelled"
}

// Get order statistics
GET /api/order/stats
Authorization: Required (Seller token)
```

## Context Functions

### User Functions

```javascript
const {
  userOrders, // Array of user's orders
  fetchUserOrders, // Fetch user orders from backend
  placeOrder, // Place a new order
  cancelOrder, // Cancel an existing order
  getOrderById, // Get specific order by ID
  getOrdersByStatus, // Get orders filtered by status
  getRecentOrders, // Get recent orders (limit parameter)
} = useAppcontext();
```

### Seller Functions

```javascript
const {
  sellerOrders, // Array of all orders (for sellers)
  orderStats, // Order statistics object
  fetchSellerOrders, // Fetch all orders from backend
  updateOrderStatus, // Update order status
} = useAppcontext();
```

### Shared Functions

```javascript
const {
  ordersLoading, // Loading state for order operations
  orderError, // Error state for order operations
} = useAppcontext();
```

## Order Object Structure

```javascript
{
  _id: "order_id",
  userId: "user_id",
  items: [
    {
      _id: "item_id",
      product: {
        _id: "product_id",
        name: "Product Name",
        price: 100,
        offerPrice: 80,
        image: ["image_url"]
      },
      quantity: 2
    }
  ],
  amount: 160,
  address: {
    _id: "address_id",
    firstName: "John",
    lastName: "Doe",
    street: "123 Main St",
    city: "City",
    state: "State",
    zipcode: "12345",
    country: "Country",
    phone: "1234567890"
  },
  status: "order placed" | "processing" | "delivered" | "cancelled",
  paymentType: "COD",
  isPaid: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## Usage Examples

### User Places an Order

```javascript
const { placeOrder, selectedAddress, paymentMethod, cartItems } =
  useAppcontext();

const handlePlaceOrder = async () => {
  const result = await placeOrder();
  if (result) {
    console.log("Order placed successfully!");
  }
};
```

### Seller Updates Order Status

```javascript
const { updateOrderStatus } = useAppcontext();

const handleStatusUpdate = async (orderId, newStatus) => {
  const success = await updateOrderStatus(orderId, newStatus);
  if (success) {
    console.log("Order status updated!");
  }
};
```

### User Cancels Order

```javascript
const { cancelOrder } = useAppcontext();

const handleCancelOrder = async (orderId) => {
  const success = await cancelOrder(orderId);
  if (success) {
    console.log("Order cancelled!");
  }
};
```

### Get Orders by Status

```javascript
const { getOrdersByStatus } = useAppcontext();

const pendingOrders = getOrdersByStatus("order placed");
const deliveredOrders = getOrdersByStatus("delivered");
```

## Order Statistics

The system automatically calculates and maintains order statistics:

```javascript
{
  total: 50,        // Total number of orders
  pending: 15,      // Orders with "order placed" status
  processing: 10,   // Orders with "processing" status
  delivered: 20,    // Orders with "delivered" status
  cancelled: 5      // Orders with "cancelled" status
}
```

## Status Flow

### Normal Order Flow

1. **Order Placed** → User places order
2. **Processing** → Seller starts processing order
3. **Delivered** → Order is delivered to customer

### Cancellation Flow

- **Order Placed** → Can be cancelled by user or seller
- **Processing** → Can be cancelled by seller only
- **Delivered** → Cannot be cancelled
- **Cancelled** → Final state, cannot be changed

## Security Features

1. **Authentication Required**: All order operations require proper authentication
2. **User Ownership**: Users can only access their own orders
3. **Seller Authorization**: Only authenticated sellers can update order status
4. **Status Validation**: Only valid status transitions are allowed
5. **Input Validation**: All inputs are validated and sanitized

## Error Handling

The system provides comprehensive error handling:

```javascript
// Loading states
if (ordersLoading) {
  return <LoadingSpinner />;
}

// Error states
if (orderError) {
  return <ErrorMessage error={orderError} />;
}

// Empty states
if (orders.length === 0) {
  return <EmptyState />;
}
```

## Real-time Updates

- Orders are automatically refreshed when status changes
- Statistics are updated in real-time
- User and seller views stay synchronized
- Toast notifications for all operations

## Best Practices

1. **Always check authentication** before performing order operations
2. **Use loading states** to provide user feedback
3. **Handle errors gracefully** with user-friendly messages
4. **Validate inputs** before sending to backend
5. **Update local state** immediately for better UX
6. **Refresh data** after successful operations

## Testing

### Test Order Flow

1. User registers/logs in
2. User adds items to cart
3. User selects address and payment method
4. User places order
5. Seller logs in and sees new order
6. Seller updates order status
7. User sees status update in their orders

### Test Cancellation Flow

1. User places order
2. User cancels order (if status allows)
3. Seller sees cancelled order
4. Order statistics update automatically

## Future Enhancements

Consider implementing these additional features:

- Email notifications for status changes
- Order tracking with delivery updates
- Refund processing
- Order reviews and ratings
- Bulk order operations
- Order export functionality
- Advanced analytics and reporting
- Mobile push notifications
