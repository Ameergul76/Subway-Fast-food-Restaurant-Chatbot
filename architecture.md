# Restaurant AI Chatbot - System Architecture

## System Overview
The system consists of three main components:
1. **Chatbot Interface**: A web-based chat interface for customers to interact with the AI.
2. **Backend API**: A FastAPI-based server that handles logic, database interactions, and AI processing.
3. **Dashboard**: A React-based admin dashboard for restaurant staff to view and manage orders.

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    MENU {
        int id PK
        string item
        string category
        float price
        string description
    }
    ORDER {
        int order_id PK
        string user_details
        float total_amount
        string order_status
        datetime created_at
    }
    ORDER_ITEM {
        int id PK
        int order_id FK
        int item_id FK
        int quantity
    }
    
    MENU ||--o{ ORDER_ITEM : "is in"
    ORDER ||--o{ ORDER_ITEM : "contains"
```

## Logic Flow Diagram

```mermaid
graph TD
    User[User] -->|Message| ChatUI[Chat Interface]
    ChatUI -->|API Call| Backend[FastAPI Backend]
    Backend -->|Text| Intent[Intent Detection]
    
    subgraph AI_Logic
    Intent -->|Get Menu| RAG[RAG / Menu Search]
    Intent -->|Place Order| OrderLogic[Order Processing]
    Intent -->|Status| StatusLogic[Check Status]
    end
    
    OrderLogic -->|Create| DB[(Database)]
    StatusLogic -->|Read| DB
    RAG -->|Read| DB
    
    OrderLogic -->|Notify| Dashboard[Dashboard Update]
    
    Backend -->|Response| ChatUI
    ChatUI -->|Display| User
```

## Tech Stack
- **Backend**: FastAPI
- **Database**: SQLite (MVP)
- **Frontend**: React + Vite
- **AI**: LLM Integration (Placeholder/Mock for MVP)
