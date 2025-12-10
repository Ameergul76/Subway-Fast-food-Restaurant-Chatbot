# Quick Testing Guide

## Step 1: Restart Backend (IMPORTANT!)

The backend needs to be restarted to load the new enhanced chatbot code.

**In the terminal running `python run_backend.py`:**
1. Press `Ctrl+C` to stop the backend
2. Run: `python run_backend.py` again

OR use the batch file:
```bash
cd "d:\AI Chat boat"
.\run_all.bat
```

---

## Step 2: Open the Application

Navigate to: **http://localhost:5173/**

You should immediately see:
- ✅ **Green sidebar on the left** (instead of top navigation)
- ✅ **Vertical menu items** with icons
- ✅ **Emerald green colors** throughout

---

## Step 3: Test Navigation

Click each menu item in the sidebar:
1. **📊 Dashboard** - Should show orders and analytics
2. **🍽️ Order Manually** - Should show menu items
3. **💬 Customer Chat** - Should show chatbot interface

---

## Step 4: Test Enhanced Chatbot

Go to **Customer Chat** and try these:

### Basic Ordering:
```
"I want pizza"
"Order a burger"
"Can I get a salad"
```

### Multi-Item Ordering:
```
"I want 2 pizzas and 3 cokes"
"Order a burger, fries, and a drink"
"Get me 5 chicken sandwiches and 2 salads"
```

### Typo Handling (NEW!):
```
"I want piza"
"order chiken"
"get me burge"
```

### Category Browsing:
```
"Show me pizzas"
"What desserts do you have"
"List beverages"
```

### Price Inquiries:
```
"How much is the pizza"
"What's the cost of burger"
```

---

## Step 5: Verify Green Theme

Check that these are GREEN (not blue):
- [ ] Sidebar background
- [ ] "Add to Cart" buttons
- [ ] "Place Order" button
- [ ] Chat send button
- [ ] Focus rings on inputs
- [ ] Analytics chart bars
- [ ] "Ready" status badges

---

## Expected Results

### Chatbot Should:
✅ Understand typos and partial matches
✅ Handle multiple items in one message
✅ Extract quantities correctly
✅ Suggest similar items when confused
✅ Create orders successfully

### UI Should:
✅ Show green sidebar on left
✅ Highlight active page
✅ Work on mobile (hamburger menu)
✅ Use green theme consistently

---

## Troubleshooting

### Chatbot Not Working?
- **Check:** Backend restarted?
- **Check:** Browser console for errors
- **Try:** Refresh the page

### Sidebar Not Green?
- **Try:** Hard refresh (Ctrl+Shift+R)
- **Check:** Browser cache cleared?

### Menu Items Not Showing?
- **Check:** Database has menu items?
- **Try:** Add items via backend admin
- **Check:** API endpoint working (http://localhost:8000/menu/)

---

## Quick Test Commands

Copy and paste these into the chatbot:

```
Hi
```
```
Show me the menu
```
```
I want 2 pizzas and a salad
```
```
Order chiken sandwch
```
```
How much is the pizza
```

Each should work perfectly with the enhanced chatbot! 🎉
