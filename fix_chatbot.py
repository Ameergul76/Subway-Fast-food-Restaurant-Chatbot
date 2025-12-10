import textwrap

# Path to your chatbot.py file
file_path = 'd:/AI Chat boat/backend/chatbot.py'

# Read the file
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Keep lines before the old default response (line 283 is index 282)
result = []
for i, line in enumerate(lines):
    if i < 282:  # Keep everything before line 283
        result.append(line)
    else:
        break

# New default response section
fixed_section = textwrap.dedent('''
    # Default response - Use Hugging Face LLM
    menu_items = crud.get_menu(db)

    # Construct context from menu
    menu_context = "Menu: "
    for item in menu_items:
        menu_context += f"- {item.item}: ${item.price} ({item.description}); "

    system_prompt = "You are a helpful AI assistant for a restaurant. Your goal is to help customers with their orders, answer questions about the menu, and be friendly. " + menu_context + " If the user wants to order, guide them to say the phrase 'I want' and the item name. Keep your responses concise and helpful."

    prompt = "<|system|>" + system_prompt + "</s>"
''')

# Add the new section to result
result.append(fixed_section)

# Write back to the file
with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(result)

print("Default response section updated successfully!")

