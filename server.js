const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const port = 3000;

const app = express();

// Expose node_modules for the frontend slider library
app.use('/npm', express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/download', (req, res) => {
  const { url, start, end, format } = req.body;

  // Basic input validation
  if (!url || !start || !end) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const isAudio = format === 'mp3';
  const ext = isAudio ? 'mp3' : 'mp4';

  // Generate a unique filename to handle concurrent requests
  const uniqueId = Math.random().toString(36).substring(2, 9);
  const outputFilename = `clip_${Date.now()}_${uniqueId}.${ext}`;
  const outputPath = path.join(__dirname, outputFilename);

  let args = [];

  if (isAudio) {
    args = [
      '-x',
      '--audio-format',
      'mp3',
      '--download-sections',
      `*${start}-${end}`,
      '--force-keyframes-at-cuts',
      '--no-playlist', // Ensure playlists aren't accidentally downloaded
      '-o',
      outputPath,
      url,
    ];
  } else {
    args = [
      '-f',
      'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
      '--download-sections',
      `*${start}-${end}`,
      '--force-keyframes-at-cuts',
      '--no-playlist',
      '-o',
      outputPath,
      url,
    ];
  }

  const ytProcess = spawn('yt-dlp', args);

  ytProcess.on('close', code => {
    if (code === 0 && fs.existsSync(outputPath)) {
      // Send file to client, then delete it from the server to save space
      res.download(outputPath, `youtube_clip.${ext}`, err => {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      });
    } else {
      // Cleanup failed/incomplete files
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      res.status(500).json({ error: 'An error occurred during video processing.' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
