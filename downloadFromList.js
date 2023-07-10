const fs = require('fs');
const axios = require('axios');
const path = require('path');

async function downloadImagesFromTextFile(filePath, outputDirectory) {
  try {
    // Read the text file and split the contents into an array of URLs
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const urls = fileContent.split('\n');

    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory);
    }

    // Download each image
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i].trim();

      // Skip empty lines or lines that don't contain a valid URL
      if (!url || !isValidUrl(url)) {
        console.log(`Skipping invalid URL at line ${i + 1}`);
        continue;
      }

      // Clean the URL by removing query parameters
      const cleanUrl = removeQueryParameters(url);
      const filename = path.basename(cleanUrl);

      // Download the image using axios
      const response = await axios.get(cleanUrl, { responseType: 'arraybuffer' });

      // Save the image to the output directory
      const outputPath = path.join(outputDirectory, filename);
      fs.writeFileSync(outputPath, response.data);

      console.log(`Downloaded image ${i + 1}/${urls.length}`);
    }

    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

// Helper function to validate URL format
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to remove query parameters from the URL
function removeQueryParameters(url) {
  const parsedUrl = new URL(url);
  parsedUrl.search = '';
  return parsedUrl.toString();
}

// Usage example
const filePath = './zuanlist2.txt'; // Path to the text file containing URLs
const outputDirectory = './Zuanimages2'; // Output directory to save the downloaded images

downloadImagesFromTextFile(filePath, outputDirectory);
