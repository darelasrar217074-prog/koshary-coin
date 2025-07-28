const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// ✅ مفتاح JWT من حسابك في Pinata - يبدأ بـ "Bearer "
const PINATA_JWT = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxNzAxNGQxYS1iZDM5LTRmZDEtYTY4Zi03NTMzNzFjNTNkNjgiLCJlbWFpbCI6ImRhci5lbGFzcmFyLjIxNzA3NEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNWEyZTNlZThlNjM1MGVlMGRjYzYiLCJzY29wZWRLZXlTZWNyZXQiOiJmN2QyNjg0ZmU3ZWM2NjY5ODAxZDZhMTRjZTY4MGFkZmE4YTdhZjM3N2E5ODRmYzNjMTRhZGJlMDdiMGZkMDQ0IiwiZXhwIjoxNzg0OTk4MDE0fQ.M5ZVkxCYd4HX7_Ono6zT1ax_G87nX2Fw5gZh5SmUYTY';

async function uploadFileToPinata(filePath) {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const data = new FormData();

  const fileStream = fs.createReadStream(filePath);
  data.append('file', fileStream);

  const metadata = JSON.stringify({
    name: path.basename(filePath),
  });
  data.append('pinataMetadata', metadata);

  try {
    const res = await axios.post(url, data, {
      maxBodyLength: 'Infinity',
      headers: {
        ...data.getHeaders(),
        Authorization: PINATA_JWT,
      },
    });

    console.log(`✅ Uploaded: ${path.basename(filePath)}`);
    console.log(`📌 IPFS Hash: ${res.data.IpfsHash}`);
  } catch (err) {
    const status = err.response?.status || 'Unknown';
    const msg = err.response?.data || err.message;
    console.error(`❌ Failed to upload ${filePath}: ${status} - ${JSON.stringify(msg)}`);
  }
}

async function uploadAllImages() {
  const folder = path.join(__dirname, 'images');
  const files = fs.readdirSync(folder).filter(file => /\.(png|jpg|jpeg)$/i.test(file));

  for (const file of files) {
    const fullPath = path.join(folder, file);
    await uploadFileToPinata(fullPath);
  }
}

uploadAllImages();
