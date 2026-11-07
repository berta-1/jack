const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function fetch2023() {
    console.log('Launching Chrome to fetch 2023 photos archive...');
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: true,
        args: ['--no-sandbox', '--disable-notifications', '--start-maximized']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    const targetUrl = 'https://web.facebook.com/profile.php?id=100092417213397&sk=photos';
    console.log(`Navigating to ${targetUrl}...`);
    
    try {
        await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 35000 });
        
        // Remove login modal
        await page.evaluate(() => {
            document.querySelectorAll('div[role="dialog"]').forEach(d => d.remove());
            document.body.style.overflow = 'auto';
        });

        console.log('Page loaded! Scrolling to reach oldest 2023 photos...');
        
        // Scroll 25 times to reach bottom of photos
        for (let i = 0; i < 25; i++) {
            await page.evaluate(() => window.scrollBy(0, 2000));
            await new Promise(r => setTimeout(r, 1500));
        }

        // Extract photo links and captions
        const photos = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a[href*="/photo"]'));
            return links.map(a => ({
                href: a.href,
                img: a.querySelector('img')?.src || '',
                text: a.innerText || a.getAttribute('aria-label') || ''
            }));
        });

        console.log(`Found ${photos.length} photos on the profile!`);
        const savePath = 'c:\\Tahir\\Mission-1.0\\Watchdog Press\\WATCHDOG_PHOTOS_ARCHIVE.json';
        fs.writeFileSync(savePath, JSON.stringify(photos, null, 2));
        console.log(`Saved photos list to ${savePath}`);

    } catch(err) {
        console.error('Error fetching photos:', err.message);
    } finally {
        await browser.close();
    }
}

fetch2023();
