# RTBNXH Studio Engine

A 100% local, zero-dependency 2.5D interactive studio engine. 
Walk around a custom environment, respect walls/furniture via an image mask, and interact with objects that open in-game modal windows.

## 🔒 Privacy & Security First
- **Zero Tracking:** No external analytics, no user tracking.
- **100% Local Processing:** The movement math, collisions, and logic run entirely in your browser.
- **No Data Leaks:** Does not request IP addresses, use external API keys, or transmit your actions anywhere.

## 🚀 Features
- **Custom Walkable Paths:** Define exactly where your avatar can walk by simply drawing a yellow path on an image (`path_mask.jpg`).
- **Y-Sorting Depth Illusion:** The engine automatically adjusts the z-index so your character accurately stands *behind* or *in front of* furniture depending on their position.
- **Interactive Hotspots:** Click on designated areas to open web applications (via iframe) directly inside the game window.

## 🛠️ How to Customize & Run

1. **Replace Assets:**
   - Drop your custom studio background in the folder and name it `bg.jpg`.
   - Create a collision mask with a yellow path (RGB: ~255, 255, 0) indicating where the player can walk, and name it `path_mask.jpg`.
   - Add your avatar sprite and name it `character_1_transparent.png`.
2. **Launch:**
   - Double-click `start_engine.bat` (Windows).
   - Or run `python server.py` in your terminal.
3. **Play:**
   - Open your browser to `http://localhost:8080`.
   - Use **W A S D** or **Arrow Keys** to move.

## 💻 Modifying Interactive Links
Open `index.html` and search for `<div class="hotspot"`. 
You can adjust the `left`, `top`, `width`, and `height` percentages to fit your specific background, and change the `onclick="openApp('Title', 'https://yourlink.com')"` attribute to link to your own apps.
