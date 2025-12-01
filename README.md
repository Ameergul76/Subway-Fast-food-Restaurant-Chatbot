# Restaurant AI Chatbot

A full-stack restaurant ordering system with an AI chatbot interface, built with FastAPI (backend) and React (frontend).

## Features

- 🤖 AI Chatbot for customer interactions
- 📋 Menu management
- 🛒 Order placement and tracking
- 📊 Admin dashboard with analytics
- 🔄 Real-time order status updates

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Database (for MVP)
- **Pydantic** - Data validation

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Recharts** - Analytics charts
- **Axios** - HTTP client
- **React Router** - Navigation

## Project Structure

```
.
├── backend/
│   ├── main.py           # FastAPI application
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic schemas
│   ├── crud.py           # Database operations
│   ├── chatbot.py        # Chatbot logic
│   ├── database.py       # Database configuration
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.jsx       # Main app component
│   │   └── api.js        # API client
│   └── package.json      # Node dependencies
├── run_backend.py        # Backend startup script
├── seed_database.py      # Database seeding script
└── restaurant.db         # SQLite database
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r backend/requirements.txt
```

2. Seed the database with sample menu items:
```bash
python seed_database.py
```

3. Start the backend server:
```bash
python run_backend.py
```

The backend will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## Usage

### Customer Chat Interface
1. Navigate to http://localhost:5173/chat
2. Interact with the chatbot to:
   - View the menu
   - Ask about items
   - Get ordering assistance

### Admin Dashboard
1. Navigate to http://localhost:5173/
2. View and manage orders
3. Update order status
4. View analytics

## API Endpoints

### Menu
- `GET /menu/` - Get all menu items
- `POST /menu/` - Create a new menu item

### Orders
- `GET /orders/` - Get all orders
- `POST /orders/` - Create a new order
- `PUT /orders/{order_id}/status` - Update order status

### Chat
- `POST /chat/` - Send a message to the chatbot

## Database Schema

### Menu Table
- `id` - Primary key
- `item` - Item name
- `category` - Category (Pizza, Pasta, etc.)
- `price` - Price
- `description` - Item description

### Orders Table
- `id` - Primary key
- `user_details` - Customer information
- `total_amount` - Order total
- `order_status` - Status (Pending, Preparing, Ready, Completed, Cancelled)
- `created_at` - Timestamp

### Order Items Table
- `id` - Primary key
- `order_id` - Foreign key to Orders
- `item_id` - Foreign key to Menu
- `quantity` - Item quantity

## Development

### Adding New Menu Items
Use the admin interface or POST to `/menu/` endpoint:
```json
{
  "item": "Pizza Margherita",
  "category": "Pizza",
  "price": 12.99,
  "description": "Classic pizza with tomato and mozzarella"
}
```

### Chatbot Customization
Edit `backend/chatbot.py` to add new intents and responses.

## Future Enhancements
- Integration with real LLM (OpenAI, Anthropic, etc.)
- User authentication
- Payment processing
- Order history
- Advanced analytics
- Mobile app

## License
MIT
