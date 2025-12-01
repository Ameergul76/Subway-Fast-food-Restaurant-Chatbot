# Testing Plan - Restaurant AI Chatbot

## Backend Testing
### Manual API Testing (via Swagger UI)
1. **Start Backend**: `uvicorn backend.main:app --reload`
2. **Open Swagger UI**: Go to `http://localhost:8000/docs`
3. **Test Endpoints**:
    - `POST /menu/`: Create a few menu items (e.g., Pizza, Burger, Salad).
    - `GET /menu/`: Verify items are listed.
    - `POST /orders/`: Create a test order.
    - `GET /orders/`: Verify the order appears.
    - `POST /chat/`: Send "Show menu" and "Order pizza". Verify responses.

### Automated Testing (Optional for MVP)
- Run `pytest` if tests are implemented.

## Frontend Testing
### Dashboard Flow
1. **Start Frontend**: `npm run dev`
2. **Open Dashboard**: Go to `http://localhost:5173`
3. **Verify Order List**: Check if the test order created via API appears.
4. **Update Status**: Change status to "Preparing" and verify it updates.
5. **Analytics**: Check if the chart renders.

### Chat Flow
1. **Navigate to Chat**: Click "Customer Chat" in the nav.
2. **Send Message**: Type "Hello" and check response.
3. **Ask for Menu**: Type "Show menu" and check if menu items are listed.
4. **Place Order**: Type "Order Pizza" and check bot response.

## Integration Testing
- Create an order via Chat (simulated) or API and verify it appears on the Dashboard instantly (or after poll interval).
