//  *******no more needed********** //
// const dotenv = require('dotenv');
// const express = require('express');
// const sharp = require('sharp');
// const multer = require('multer');
// const cors = require('cors');
// const uuid = require('uuid');
// dotenv.config({ path: './.env' });
// const app = express();
// const PORT = process.env.PORT || 3300;

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
// const corsOptions = {
//   origin: '*',
// };

// app.use(express.static(__dirname + '/build'));
// app.use(express.json());
// app.use(cors(corsOptions));
// app.set('view engine', 'ejs');
// function generateUniqueId() {
//   return uuid.v4();
// }

// app.post('/api/resize-images', upload.any(), async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).send('No images uploaded.');
//     }
//     const { width, height } = req.query;

//     const resizedImages = [];
//     for (const file of req.files) {
//       const outputBuffer = await sharp(file.buffer)
//         .resize({
//           width: width ? Number(width) : 1920,
//           height: height ? Number(height) : undefined,
//         })
//         .toFormat('jpeg')
//         .toBuffer();

//       const imageName = `${Date.now()}_${Math.floor(
//         Math.random() * 1000
//       )}.jpg`;
//       const imageId = generateUniqueId();
//       resizedImages.push({
//         id: imageId,
//         name: imageName,
//         data: outputBuffer,
//       });
//     }
//     res.send({ resizedImages });
//   } catch (error) {
//     console.error('Error resizing images', error);
//     res.status(500).send('Error resizing images.');
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
