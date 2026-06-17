# BookCart Test Scenarios

## 🎯 Test Scenarios Covered

### 1. Home Page Tests (`home.spec.ts`)

- ✅ Verify home page loads successfully
- ✅ Check all navigation elements are displayed
- ✅ Verify Swagger documentation link opens
- ✅ Verify GitHub repository link opens
- ✅ Test login dialog opens on button click

### 2. Search Functionality Tests (`search.spec.ts`)

- ✅ Search for books with valid keywords
- ✅ Verify search input field is visible and editable
- ✅ Handle empty/no results scenarios
- ✅ Clear search functionality

### 3. Category Filter Tests (`categories.spec.ts`)

- ✅ Filter books by Biography category
- ✅ Filter books by Fiction category
- ✅ Filter books by Mystery category
- ✅ Filter books by Fantasy category
- ✅ Filter books by Romance category
- ✅ Verify category dropdown displays all options

### 4. Login Tests (`login.spec.ts`)

- ✅ Display login form elements
- ✅ Validate required field errors
- ✅ Test empty credentials handling
- ✅ Test invalid credentials handling
- ✅ Navigate to registration form
- ✅ Close login dialog

### 5. Shopping Cart Tests (`cart.spec.ts`)

- ✅ Navigate to cart page
- ✅ Display empty cart message
- ✅ Show cart icon on home page
- ✅ Continue shopping functionality

### 6. Setup Verification (`setup.spec.ts`)

- ✅ Verify BookCart application is accessible
- ✅ Check network connectivity

## 📋 Additional Test Scenarios (To Be Implemented)

### Book Details

- [ ] View book details page
- [ ] Add book to cart with quantity
- [ ] View book description and author info
- [ ] Check book price display

### User Registration

- [ ] Register new user with valid data
- [ ] Test duplicate username handling
- [ ] Validate password requirements
- [ ] Test email validation

### Checkout Process

- [ ] Complete checkout flow
- [ ] Apply discount codes
- [ ] Calculate total price correctly
- [ ] Order confirmation

### User Profile

- [ ] View user profile
- [ ] Update user information
- [ ] Change password
- [ ] View order history

### Advanced Filtering

- [ ] Filter by price range
- [ ] Combine category and price filters
- [ ] Sort books by price/name
- [ ] Pagination testing

### Wishlist

- [ ] Add books to wishlist
- [ ] Remove books from wishlist
- [ ] Move items from wishlist to cart

### API Testing

- [ ] Test BookCart API endpoints
- [ ] Verify API response structure
- [ ] Test API error handling

## 🔄 Cross-Browser Testing

All tests run across multiple browsers:

- ✅ Chromium (Desktop)
- ✅ Firefox (Desktop)
- ✅ WebKit/Safari (Desktop)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

## 🎨 Test Data Management

### Test Users

Create test data files for:

- Valid user credentials
- Invalid user credentials
- Test book data
- Test order data

### Test Data Location

Consider creating a `testdata/` directory with JSON files:

```
testdata/
├── users.json
├── books.json
└── orders.json
```

## 🚀 Performance Testing Ideas

- [ ] Measure page load times
- [ ] Test search performance
- [ ] Monitor API response times
- [ ] Check resource loading times

## ♿ Accessibility Testing

- [ ] Check ARIA labels
- [ ] Test keyboard navigation
- [ ] Verify color contrast
- [ ] Screen reader compatibility

## 🔒 Security Testing

- [ ] Test XSS prevention
- [ ] SQL injection testing
- [ ] Test authentication mechanisms
- [ ] Verify secure connections (HTTPS)

## 📱 Responsive Design Testing

- [ ] Mobile layouts
- [ ] Tablet layouts
- [ ] Different screen resolutions
- [ ] Landscape vs Portrait modes

---

**Note**: Check marks (✅) indicate implemented tests. Empty boxes ([ ]) indicate scenarios that can be added in the future.
