const express = require('express');
const sharp = require('sharp');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3300;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());

app.post('/api/resize-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded.');
  }
  const imageBuffer = req.file.buffer;
  console.log('got file 😍');
  sharp(imageBuffer)
    .resize({ width: 1920 })
    .toFormat('jpeg')
    .toBuffer()
    .then((outputBuffer) => {
      const savePath = path.join(__dirname, 'image/');
      // For example, saving it as a file:
      fs.writeFileSync(
        path.join(savePath, 'resized-image.jpg'),
        outputBuffer
      );

      res.send(outputBuffer);
    })
    .catch((err) => {
      console.error('Error resizing image', err);
      res.status(500).send('Error resizing image.');
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
