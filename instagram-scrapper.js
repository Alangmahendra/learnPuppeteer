const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

const listForDownload = 'listLinks.txt';

const instagramUrl = 'https://www.instagram.com/user'; //change user to desired account name

async function scrapeImages() {
    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();
    await page.goto(instagramUrl);


    //use selectors bellow to get list of images
    //'img[crossorigin="anonymous"]'
    //'img.x5yr21d' // this selector give me more images than selector above
    //'div > ._aagv img' //work best for now

    await page.waitForSelector('._aagv img.x5yr21d', {timeout: 5000});

    const imageUrls = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('._aagv img .x5yr21d'));
        return images.map(img => img.src);
    }); 
    
    await browser.close();
    return imageUrls;
};

async function downloadImage(url, filename){
    const response = await axios({
        url,
        responseType: 'stream',
    });

    const writer = fs.createWriteStream(filename);
    response.data.pipe(writer);

    return new Promise((resolve, reject) =>{
        writer.on('finish',resolve);
        writer.on('error',reject);
    });
}

async function downloadImages(imageUrls){
    for (let i = 0;i < imageUrls.length;i++){
        const url = imageUrls[i];
        const filename = `image_${i + 1}.jpg`;

        console.log(`Downloading ${url} ...`);

        try {
            await downloadImage(url, filename);
            console.log(`Downloaded ${url}`);
        }catch (error){
            console.error(`Failed to download ${url}: `, error);
        }
    }
}

async function run() {
    try {
        const imageUrls = await scrapeImages();

        fs.writeFileSync(listForDownload,imageUrls.join('\n'));

        await downloadImages(imageUrls);
        console.log('All images downloaded successfully!!!')
    }catch (error) {
        console.error('Error occured',error);
    }
}

run()

