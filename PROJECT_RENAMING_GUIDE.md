# Project Renaming Guide

## 🎯 Suggested Project Names

Based on your card game (similar to Tichu/Asshole), here are some name suggestions:

### **Card Game Themed Names:**
1. **CardMaster** - Simple, professional
2. **AcePlay** - Modern, catchy
3. **RoyalCards** - Premium feel
4. **CardArena** - Competitive vibe
5. **DeckBattles** - Action-oriented
6. **CardClash** - Competitive
7. **TrickMaster** - Game-specific
8. **CardRivals** - Multiplayer focus

### **Modern/Tech Names:**
1. **PlayCards** - Simple, clear
2. **CardHub** - Central platform
3. **DeckMatch** - Matching/competitive
4. **CardSync** - Real-time multiplayer
5. **CardFlow** - Smooth gameplay

### **My Top 3 Recommendations:**
1. **CardMaster** ⭐ - Professional, memorable, SEO-friendly
2. **AcePlay** ⭐ - Modern, short, brandable
3. **CardArena** ⭐ - Competitive, clear purpose

---

## 📝 Where "LuckyMan" Currently Appears

### **Files & Folders:**
- `frontend/src/page/luckyman/LuckyMan.jsx` (folder and file)
- `backend/database/luckyman.sql` (database file)
- Route paths: `/luckyman-*`

### **Code References:**
- Component name: `LuckyMan`
- Import statements
- Route definitions
- Console logs
- Display text: "Lucky Man"

### **Configuration Files:**
- `frontend/public/index.html` (title, meta description)
- `frontend/public/manifest.json` (app name)
- `backend/server.js` (console log)
- Translation files

### **Documentation:**
- All markdown files (can update later)

---

## 🔄 Step-by-Step Renaming Process

### **Step 1: Choose Your New Name**

Let's say you choose **"CardMaster"** (you can replace with any name you prefer).

**Important:** 
- Use **PascalCase** for component names: `CardMaster`
- Use **camelCase** for variables: `cardMaster`
- Use **kebab-case** for URLs/routes: `cardmaster` or `card-master`
- Use **Title Case** for display: `Card Master`

---

### **Step 2: Rename Files & Folders**

#### **A. Rename Frontend Folder:**
```bash
# Windows (PowerShell)
Rename-Item "frontend\src\page\luckyman" "cardmaster"

# Or manually rename the folder
```

#### **B. Rename Component File:**
```bash
# Inside the renamed folder
Rename-Item "LuckyMan.jsx" "CardMaster.jsx"
```

#### **C. Rename Database File (optional):**
```bash
Rename-Item "backend\database\luckyman.sql" "cardmaster.sql"
```

---

### **Step 3: Update Code References**

I'll create a script to help you with this, but here's what needs to change:

#### **Files to Update:**

1. **`frontend/src/page/cardmaster/CardMaster.jsx`**
   - Component name: `LuckyMan` → `CardMaster`
   - Export: `export default LuckyMan` → `export default CardMaster`

2. **`frontend/src/NewRouter.js`**
   - Import: `import LuckyMan from "./page/luckyman/LuckyMan"` → `import CardMaster from "./page/cardmaster/CardMaster"`
   - Route: `<Route path="/luckyman-*" component={LuckyMan} />` → `<Route path="/cardmaster-*" component={CardMaster} />`

3. **`frontend/src/page/createroom/CreateRoom.jsx`**
   - Route: `"/luckyman-" + temp?.data?.roomID` → `"/cardmaster-" + temp?.data?.roomID`
   - Display: `"Lucky Man"` → `"Card Master"`

4. **`frontend/src/page/room/Room.jsx`**
   - Display: `"Lucky Man"` → `"Card Master"`

5. **`frontend/src/components/roomitem/RoomItem.jsx`**
   - Route: `"/luckyman-" + item.room_id` → `"/cardmaster-" + item.room_id`

6. **`frontend/public/index.html`**
   - Title: `<title>Lucky Man</title>` → `<title>Card Master</title>`
   - Meta: `content="CardGame named LuckyMan"` → `content="CardGame named CardMaster"`

7. **`frontend/public/manifest.json`**
   - `"short_name": "React App"` → `"short_name": "CardMaster"`
   - `"name": "Create React App Sample"` → `"name": "Card Master"`

8. **`backend/server.js`**
   - Console log: `"Luckyman app listening..."` → `"CardMaster app listening..."`

9. **Translation files** (if you want to update keys):
   - `LUCKYMAN_MODAL_*` → `CARDMASTER_MODAL_*` (optional, can keep as is)

---

## 🛠️ Automated Renaming Script

Would you like me to:
1. **Create a renaming script** that does all of this automatically?
2. **Manually update all the files** for you right now?
3. **Just show you the changes** and you do it manually?

---

## 📋 Quick Rename Checklist

If you want to do it manually, here's the order:

- [ ] Choose new name (e.g., "CardMaster")
- [ ] Rename folder: `luckyman` → `cardmaster`
- [ ] Rename file: `LuckyMan.jsx` → `CardMaster.jsx`
- [ ] Update component name in file
- [ ] Update import in `NewRouter.js`
- [ ] Update route path: `/luckyman-*` → `/cardmaster-*`
- [ ] Update route references in `CreateRoom.jsx` and `RoomItem.jsx`
- [ ] Update display text: "Lucky Man" → "Card Master"
- [ ] Update `index.html` title and meta
- [ ] Update `manifest.json`
- [ ] Update `server.js` console log
- [ ] Test all routes work
- [ ] Update database file name (optional)
- [ ] Update documentation (optional)

---

## 🎨 Branding Considerations

When choosing a name, consider:

1. **Domain Availability** - Check if `cardmaster.com` is available
2. **Social Media** - Check Twitter, Instagram handles
3. **SEO** - Is it searchable?
4. **Trademark** - Check for conflicts
5. **Pronunciation** - Easy to say?
6. **Memorability** - Easy to remember?

---

## 💡 My Recommendation

**"CardMaster"** is my top pick because:
- ✅ Professional and memorable
- ✅ Clear what it is (card game)
- ✅ Good for branding
- ✅ SEO-friendly
- ✅ Works in multiple languages
- ✅ Not too generic, not too specific

**Alternative if you want something more unique:**
- **"AcePlay"** - Modern, short, brandable
- **"CardArena"** - Competitive, clear

---

## 🚀 Next Steps

**Option 1:** Tell me your chosen name and I'll update all files automatically.

**Option 2:** I'll create a script you can run to rename everything.

**Option 3:** You do it manually using this guide.

**What would you prefer?**

