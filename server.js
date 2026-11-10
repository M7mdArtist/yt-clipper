const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const port = 6767;

const app = express();

app.use('/npm', express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/clip', (req, res) => {
  const { url, start, end, format, quality } = req.query;

  if (!url || !start || !end) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const isAudio = format === 'mp3';
  const ext = isAudio ? 'mp3' : 'mp4';
  const uniqueId = Math.random().toString(36).substring(2, 9);
  const outputFilename = `clip_${Date.now()}_${uniqueId}.${ext}`;
  const outputPath = path.join(__dirname, outputFilename);

  let args = [];

  if (isAudio) {
    args = [
      '-x',
      '--audio-format',
      'mp3',
      '--audio-quality',
      quality || '192k',
      '--download-sections',
      `*${start}-${end}`,
      '--no-playlist',
      '--newline',
      '-o',
      outputPath,
      url,
    ];
  } else {
    let formatArg = 'best[ext=mp4]/best';
    if (quality === '1080') {
      formatArg = 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4][height<=1080]/best';
    } else if (quality === '720') {
      formatArg = 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4][height<=720]/best';
    } else if (quality === '480') {
      formatArg = 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4][height<=480]/best';
    }

    args = [
      '-f',
      formatArg,
      '--download-sections',
      `*${start}-${end}`,
      '--no-playlist',
      '--newline',
      '-o',
      outputPath,
      url,
    ];
  }

  const ytBinary = '/usr/bin/yt-dlp';
  const ytProcess = spawn(ytBinary, args);

  ytProcess.stdout.on('data', data => {
    res.write(`data: ${JSON.stringify({ log: data.toString() })}\n\n`);
  });

  ytProcess.stderr.on('data', data => {
    res.write(`data: ${JSON.stringify({ log: data.toString() })}\n\n`);
  });

  ytProcess.on('close', code => {
    if (code === 0 && fs.existsSync(outputPath)) {
      res.write(`data: ${JSON.stringify({ success: true, file: outputFilename })}\n\n`);
    } else {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      res.write(`data: ${JSON.stringify({ error: 'Processing failed or cancelled.' })}\n\n`);
    }
    res.end();
  });
});

app.get('/download-file/:filename', (req, res) => {
  const filename = req.params.filename;
  if (!filename.startsWith('clip_') || filename.includes('..')) {
    return res.status(400).send('Invalid filename.');
  }
  const filePath = path.join(__dirname, filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, () => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  } else {
    res.status(404).send('File not found.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
