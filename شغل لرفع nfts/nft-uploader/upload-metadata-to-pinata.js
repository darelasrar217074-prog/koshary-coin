const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const PINATA_API_KEY = '5a2e3ee8e6350ee0dcc6';
const PINATA_SECRET_API_KEY = 'f7d2684fe7ec6669801d6a14ce680adfa8a7af377a984fc3c14adbe07b0fd044';

const metadataFolder = path.join(__dirname, 'metadata');

async function uploadFileToPinata(filePath) {
  const data = new FormData();
  const fileStream = fs.createReadStream(filePath);
  data.append('file', fileStream);

  const fileName = path.basename(filePath);
  const metadata = JSON.stringify({ name: fileName });
  data.append('pinataMetadata', metadata);

  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      data,
      {
        maxBodyLength: Infinity,
        headers: {
          ...data.getHeaders(),
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY
        }
      }
    );

    console.log(`✅ Uploaded ${fileName}: https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`);
  } catch (error) {
    console.error(`❌ Failed to upload ${fileName}:`, error.response?.data || error.message);
  }
}

async function uploadAllMetadata() {
  const files = fs.readdirSync(metadataFolder).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(metadataFolder, file);
    await uploadFileToPinata(filePath);
  }
}

uploadAllMetadata();
