# Deployment Checklist

Use this checklist when setting up the project on a new machine.

## Pre-Setup Checklist

- [ ] Python 3.8+ installed and in PATH
- [ ] Node.js 16+ installed
- [ ] Project files copied to new machine
- [ ] Terminal/Command Prompt open in project folder

## Installation Checklist

### Backend Setup
- [ ] Run: `pip install -r backend/requirements.txt`
- [ ] Verify: No error messages
- [ ] Run: `python seed_database.py`
- [ ] Verify: Message "Successfully added 8 menu items"
- [ ] File created: `restaurant.db`

### Frontend Setup
- [ ] Run: `cd frontend`
- [ ] Run: `npm install`
- [ ] Verify: `node_modules` folder created
- [ ] Run: `cd ..` (back to project root)

## Startup Checklist

### Backend
- [ ] Run: `python run_backend.py`
- [ ] Verify: "Uvicorn running on http://0.0.0.0:8000"
- [ ] Verify: "Application startup complete"
- [ ] Test: Open http://localhost:8000 in browser
- [ ] Verify: Shows `{"message":"Restaurant AI Chatbot Backend is Running"}`

### Frontend
- [ ] Open new terminal
- [ ] Run: `cd frontend`
- [ ] Run: `npm run dev`
- [ ] Verify: "Local: http://localhost:5173/"
- [ ] Test: Open http://localhost:5173 in browser
- [ ] Verify: Dashboard loads without errors

## Functionality Checklist

### Dashboard
- [ ] Navigate to: http://localhost:5173
- [ ] Verify: Dashboard page loads
- [ ] Verify: Navigation bar shows "Restaurant AI"
- [ ] Verify: "Recent Orders" section visible
- [ ] Verify: "Weekly Orders" chart visible

### Chat Interface
- [ ] Navigate to: http://localhost:5173/chat
- [ ] Verify: Chat interface loads
- [ ] Verify: Welcome message appears
- [ ] Test: Type "show menu"
- [ ] Verify: Menu items display with prices
- [ ] Test: Type "order pizza"
- [ ] Verify: Order confirmation message
- [ ] Verify: Order number shown

### Order Management
- [ ] Go back to dashboard: http://localhost:5173
- [ ] Verify: New order appears in table
- [ ] Verify: Order shows actual item name (e.g., "Margherita Pizza")
- [ ] Verify: Order shows correct price
- [ ] Test: Change order status dropdown
- [ ] Verify: Status updates successfully

### API Endpoints
- [ ] Test: http://localhost:8000/menu/
- [ ] Verify: Returns JSON array of menu items
- [ ] Test: http://localhost:8000/orders/
- [ ] Verify: Returns JSON array of orders
- [ ] Test: http://localhost:8000/docs
- [ ] Verify: Swagger API documentation loads

## Common Issues & Solutions

### Issue: "python: command not found"
- [ ] Solution: Try `python3` instead
- [ ] Or: Reinstall Python with "Add to PATH" checked

### Issue: "npm: command not found"
- [ ] Solution: Reinstall Node.js from nodejs.org

### Issue: "Port 8000 already in use"
- [ ] Solution: Kill process on port 8000
- [ ] Or: Change port in `run_backend.py`

### Issue: "Port 5173 already in use"
- [ ] Solution: Kill process on port 5173
- [ ] Or: Vite will automatically use next available port

### Issue: Empty menu in chat
- [ ] Solution: Run `python seed_database.py` again

### Issue: Frontend shows errors
- [ ] Solution: Delete `frontend/node_modules`
- [ ] Solution: Run `npm install` again in frontend folder

## Performance Checklist

- [ ] Backend responds within 1 second
- [ ] Frontend loads within 2 seconds
- [ ] Chat messages respond within 1 second
- [ ] Dashboard updates in real-time
- [ ] No console errors in browser (F12)
- [ ] No errors in backend terminal
- [ ] No errors in frontend terminal

## Security Checklist (Production)

⚠️ **Before deploying to production:**

- [ ] Change CORS settings in `backend/main.py`
- [ ] Add authentication
- [ ] Use environment variables for sensitive data
- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Add input validation
- [ ] Add error logging
- [ ] Set up monitoring

## Documentation Checklist

- [ ] README.md reviewed
- [ ] QUICK_SETUP.md available
- [ ] SETUP_NEW_MACHINE.md available
- [ ] CHATBOT_GUIDE.md available
- [ ] All team members have access to docs

## Final Verification

- [ ] All servers running without errors
- [ ] Can place orders via chat
- [ ] Orders appear in dashboard
- [ ] Can update order status
- [ ] Menu displays correctly
- [ ] No console errors
- [ ] All features working as expected

## Sign-Off

**Setup completed by:** ___________________

**Date:** ___________________

**Machine/Environment:** ___________________

**Notes:** ___________________

---

✅ **All checks passed? You're ready to go!** 🎉
