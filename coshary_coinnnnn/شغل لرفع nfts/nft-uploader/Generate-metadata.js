const fs = require('fs');
const path = require('path');

const imagesFolder = path.join(__dirname, 'images');
const outputFolder = path.join(__dirname, 'metadata');

// تأكد إن مجلد metadata موجود
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// توليد ميتاداتا للصورة
function generateMetadata(fileName, index, ipfsImageHash) {
  return {
    name: `Glitch Paw #${index}`,
    description: "A cute glitchy paw NFT from KosharyCoin world!",
    image: `ipfs://${ipfsImageHash}`,
    attributes: [
      {
        trait_type: "Generation",
        value: "1"
      },
      {
        trait_type: "Cuteness",
        value: "Super"
      }
    ]
  };
}

// كل صورة مربوطة بالـ hash بتاعها
const imageHashes = {
  "1.png": "QmYEVBctC9im6CVhUtVoqZKczA4t77NRTZowPruNt6xDg1",
  "2.png": "QmP3YQy8UFCFfRMdZZLzDdfVZzPPxYUUTrA99GMXNsPcGs",
  "3.png": "QmYJrMcXEg7srHQmpNMpd5SJ3opUrEb7FYSAxCsaZY6oLp",
  "4.png": "QmPzhCqU6BWNBPUZf4CFq3gBm6kFNs5xby1qYeVm4JyEKD",
  "5.png": "QmNzZsBqpXkiNRMLWu1YqNmyX85CbBT14DB45QiaTCrXUX",
  "6.png": "QmUgmBRnbDKnsHe2zX8odFmqgoPr1SCWmDKjb3kgGvJqBV",
  "8.png": "QmT8ktjZ6zb6XCkNhyg7JSWhQmBpS8VwTwNaAWoosvUzzw",
  "9.png": "QmdrAr9k8GbJsqUDcKg4DNgLZ8DfaJZP2SHu5VMedmTFEn",
  "10.png": "QmTkz4Kv14p3eKaaxD5zpmvF73kHNMR6x8VTUNg2Avi3q4",
  "11.png": "QmUS7mJ1opXAVbLd7SAGuWotMVLD7NDvzPG3i1CCkb4oHN",
  "12.png": "QmdszWrYDujDPzMs96a6uyAquu4BA63PXsm2qEywuUYJWT",
  "13.png": "QmQU9YTjAwxgiBZMUbGmzKV9qYW41bpb5Sx9p6TNYir9xB",
  "14.png": "QmdWC7w94hjPSaQyw7rYz2evoZtEy5h7pF8e18iLyVnHVq",
  "15.png": "QmcPAhMcQLKkEDJUQhknfah3ewBrfHnbo5HDFNQ1aM78UE",
  "16.png": "QmdkmFpMDYhG6zAG35QefttfYrGQid4npm4Kjms3rckrp1",
  "17.png": "QmagvexHEtsszQibZGivHnAxQTB6usad3JUB5vKiSTohp6",
  "18.png": "QmYtrkbMwTBZcFjiQHkzvibZxabCvj1jtTvBvyJtuHCtJV",
  "19.png": "QmWvgidcux5ksGPGZGwX6hHQ7tM9G2haQ8yQsF91qTCWxN",
  "20.png": "QmWkk652U4cghb7NxdcJaSZFAQsqYaSu4nTrkxvXDzZWd8"
};

// توليد ملفات metadata بناءً على أسماء الصور
Object.entries(imageHashes).forEach(([fileName, hash]) => {
  const index = parseInt(fileName.split('.')[0], 10);
  const metadata = generateMetadata(fileName, index, hash);
  fs.writeFileSync(
    path.join(outputFolder, `${index}.json`),
    JSON.stringify(metadata, null, 2)
  );
  console.log(`✅ Metadata for #${index} created.`);
});
