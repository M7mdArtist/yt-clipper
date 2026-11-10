````
# YouTube Clipper Pro ✂️🎥

A lightning-fast, self-hosted web application built with **Node.js**, **Express**, **yt-dlp**, and **FFmpeg** that allows you to preview, trim, and download custom clips from YouTube videos and **YouTube Shorts** as high-quality **MP4** videos or **MP3** audio files.

---

## ✨ Features

- **🎬 YouTube & Shorts Support:** Paste standard watch links or YouTube Shorts URLs seamlessly.
- **🎚️ Interactive Timeline Slider:** Double-handled visual slider synced with an embedded YouTube player.
- **⌨️ Manual Time Input:** Type exact timestamps (`HH:MM:SS`) directly into the input boxes.
- **⚡ Fast Processing:** Optimized stream cutting to bypass heavy CPU re-encoding overhead.
- **🖥️ Live Terminal Logs:** Real-time log streaming using Server-Sent Events (SSE) so you can track download progress and speed live.
- **🎛️ Quality Selection:**
  - **MP4 Video:** Choose between Fast Single-Stream, 1080p, 720p, or 480p.
  - **MP3 Audio:** Choose between 320 kbps, 192 kbps, or 128 kbps bitrates.
- **⏱️ Quick Time Presets:** One-click buttons for _First 15s_, _First 30s_, and _Full Video/Short_.
- **📂 Session Download History:** Keeps a clean history list of your recent clips for instant re-downloading.
- **🧹 Auto-Cleanup:** Automatically deletes temporary files from the server disk after delivery.

---

## 🛠️ Prerequisites & System Dependencies

Before installing the project, make sure your server or local machine has the following system dependencies installed:

1. **Node.js** (v18+ recommended)
2. **FFmpeg** (Required for media processing)
3. **yt-dlp** (Required for downloading streams)

### Installing System Dependencies

- **On Arch Linux:**
  ```bash
  sudo pacman -S ffmpeg yt-dlp
  ```
````

- **On Ubuntu / Debian:**

```bash
sudo apt update && sudo apt install ffmpeg yt-dlp

```

---

## 📦 Installation Guide

1. **Clone or create your project directory:**

```bash
mkdir yt-clipper && cd yt-clipper

```

2. **Setup Project Files:**
   Create your `server.js` file and a `public/index.html` file using the code provided in the repository.
3. **Install Node.js Packages:**
   Initialize and install `express` and `noUiSlider`:

```bash
npm init -y
npm install express nouislider

```

4. **Verify `yt-dlp` Path:**
   Check where `yt-dlp` is installed on your system:

```bash
which yt-dlp

```

_(Ensure the path in `server.js` matches your output, e.g., `/usr/bin/yt-dlp`)._

---

## 🚀 Running the Application

### Method 1: Direct Run (Development)

```bash
node server.js

```

Open your browser and navigate to: `http://localhost:6767` (or your server's local IP address).

### Method 2: Production with PM2 (Recommended for Home Servers)

To run the server continuously in the background without watch mode interference:

```bash
pm2 start server.js --name "yt-clipper"
pm2 save

```

---

## 📖 Usage Guide

1. Open the web interface in your browser.
2. Paste any **YouTube Video** or **YouTube Short** URL into the input box.
3. The embedded player will load the video automatically and display the timeline slider.
4. Use the slider or type custom timestamps into the **Start** and **End** fields. _(Alternatively, use the quick preset buttons)._
5. Select your desired format (**Video MP4** or **Audio MP3**) and pick your target quality.
6. Click **Cut & Download** and watch the live terminal logs stream progress in real time! Your file will download automatically upon completion.

---

## ⚠️ Disclaimer

> This tool was crafted by Artificial Intelligence. It is intended for personal use and self-hosted environments. Please respect YouTube's Terms of Service and copyright regulations regarding content downloading.

```

```
