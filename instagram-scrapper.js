require('dotenv').config()
const puppeteer = require('puppeteer');
const fs = require('fs');

const scrapeImagesFromInstagram = async () => {
  const browser = await puppeteer.launch({headless:'new'});
  const page = await browser.newPage();

  await page.goto(process.env.ARTONE);

  //'.project-image img' //default selector
  
  // Wait for the page to load the images
  await page.waitForSelector('.project-image img');

  // Extract image URLs
  const imageUrls = await page.$$eval('.project-image img', images => images.map(img => img.src));

  console.log(imageUrls);

  // Save image URLs to a file
  const filePath = 'zuanlist2.txt';
  fs.writeFile(filePath, imageUrls.join('\n'), err => {
    if (err) {
      console.error('Error saving image URLs to file:', err);
    } else {
      console.log(`Image URLs saved to ${filePath}`);
    }
  });

  await browser.close();
};

scrapeImagesFromInstagram();