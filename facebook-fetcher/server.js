const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer-core');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Locate Chrome on Windows
function getChromePath() {
    const defaultPaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
    ];
    for (const p of defaultPaths) {
        if (fs.existsSync(p)) return p;
    }
    return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
}

const CHROME_PATH = getChromePath();

// Scraper State
let activeBrowser = null;
let stopRequested = false;
let sseClients = [];

function sendEvent(type, data) {
    const payload = JSON.stringify({ type, ...data });
    sseClients.forEach(client => {
        try { client.res.write(`data: ${payload}\n\n`); } catch(e) {}
    });
}

function sendLog(message, level = 'info') {
    console.log(`[${level.toUpperCase()}] ${message}`);
    sendEvent('log', { message, level });
}

// SSE Connection
app.get('/api/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const client = { id: Date.now(), res };
    sseClients.push(client);

    req.on('close', () => {
        sseClients = sseClients.filter(c => c.id !== client.id);
    });
});

app.post('/api/stop', (req, res) => {
    stopRequested = true;
    sendLog('Stop requested by user.', 'warn');
    res.json({ status: 'stopping' });
});

// Serve saved master dataset (994 complete posts from 2023 to present)
app.get('/api/saved-posts', (req, res) => {
    const era = req.query.era;
    const masterFile = path.join('c:\\Tahir\\Mission-1.0\\Watchdog Press', 'WATCHDOG_PRESS_MASTER_ARCHIVE_ALL_POSTS.json');
    const fallbackFile = path.join('c:\\Tahir\\Mission-1.0\\Watchdog Press', 'WATCHDOG_PRESS_500_POSTS.json');

    const targetFile = fs.existsSync(masterFile) ? masterFile : fallbackFile;

    if (fs.existsSync(targetFile)) {
        try {
            const data = fs.readFileSync(targetFile, 'utf-8');
            let posts = JSON.parse(data);
            if (era === '2023') {
                posts = posts.filter(p => p.era && p.era.includes('2023'));
            } else if (era === '2026') {
                posts = posts.filter(p => p.era && p.era.includes('2026'));
            }
            return res.json({ status: 'ok', count: posts.length, posts });
        } catch(e) {
            return res.status(500).json({ error: 'Failed to read dataset' });
        }
    }
    res.status(404).json({ error: 'No saved dataset found' });
});

// ============================================================
// APIFY CLOUD INTEGRATION (PERFECT RICH JSON WITH ALL FIELDS)
// ============================================================
app.post('/api/apify-fetch', async (req, res) => {
    const { token, url, resultsLimit = 200, onlyPostsOlderThan, onlyPostsNewerThan } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Apify API Token is required.' });
    }
    if (!url || !url.includes('facebook.com')) {
        return res.status(400).json({ error: 'Please enter a valid Facebook URL.' });
    }

    sendLog(`🚀 Starting Apify Cloud Scraper (Target: ${url}, Limit: ${resultsLimit} posts)...`, 'info');
    if (onlyPostsOlderThan) sendLog(`Filter: Only posts older than ${onlyPostsOlderThan}`, 'info');
    if (onlyPostsNewerThan) sendLog(`Filter: Only posts newer than ${onlyPostsNewerThan}`, 'info');
    res.json({ status: 'started' });

    try {
        const actorId = 'apify~facebook-posts-scraper';
        const runUrl = `https://api.apify.com/v2/acts/${actorId}/runs?token=${token}`;

        sendLog('Triggering Apify Facebook Posts Scraper cloud actor...', 'info');
        sendEvent('progress', { postsCount: 0, percent: 15, status: 'Starting cloud worker...' });

        // Build Actor Payload
        const actorInput = {
            startUrls: [{ url: url }],
            resultsLimit: parseInt(resultsLimit, 10),
            caption: true,
            commentsMode: 'RANKED_UNFILTERED'
        };
        if (onlyPostsOlderThan) actorInput.onlyPostsOlderThan = onlyPostsOlderThan;
        if (onlyPostsNewerThan) actorInput.onlyPostsNewerThan = onlyPostsNewerThan;

        // Start Actor Run
        const startResponse = await fetch(runUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actorInput)
        });

        const startData = await startResponse.json();
        if (!startResponse.ok || !startData.data) {
            throw new Error(startData.error?.message || 'Failed to start Apify actor');
        }

        const runId = startData.data.id;
        const defaultDatasetId = startData.data.defaultDatasetId;
        sendLog(`Apify Cloud Job started! Run ID: ${runId}`, 'info');

        // Poll for Completion
        let isRunning = true;
        let pollCount = 0;

        while (isRunning && !stopRequested) {
            await new Promise(r => setTimeout(r, 4000));
            pollCount++;

            let statusData;
            try {
                const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
                statusData = await statusRes.json();
            } catch(netErr) {
                sendLog(`Network glitch during status check (${netErr.message}). Retrying in 4s...`, 'warn');
                continue;
            }

            const status = statusData?.data?.status;
            if (!status) {
                sendLog(`Warning: Status check empty or pending. Retrying...`, 'warn');
                continue;
            }

            const progressPct = Math.min(20 + pollCount * 4, 92);
            sendEvent('progress', {
                postsCount: 'Fetching...',
                percent: progressPct,
                status: `Cloud worker is scraping feed (${status})...`
            });

            sendLog(`Cloud worker status: ${status} (Checked ${pollCount} times)...`, 'info');

            if (['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) {
                isRunning = false;
                if (status !== 'SUCCEEDED') {
                    throw new Error(`Apify run ended with status: ${status}`);
                }
            }
        }

        sendLog('Fetching full structured JSON dataset from Apify...', 'info');
        sendEvent('progress', { postsCount: 'Downloading...', percent: 95, status: 'Retrieving dataset...' });

        // Retrieve Dataset with retry
        let posts = null;
        for (let attempt = 1; attempt <= 4; attempt++) {
            try {
                const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${defaultDatasetId}/items?token=${token}&format=json`);
                posts = await datasetRes.json();
                if (Array.isArray(posts)) break;
            } catch(e) {
                sendLog(`Dataset download attempt ${attempt} failed (${e.message}). Retrying...`, 'warn');
                await new Promise(r => setTimeout(r, 3000));
            }
        }
        if (!posts || !Array.isArray(posts)) {
            throw new Error('Failed to retrieve dataset items from Apify.');
        }

        try {
            const saveDir = 'c:\\Tahir\\Mission-1.0\\Watchdog Press';
            if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });
            const saveFile = path.join(saveDir, `WATCHDOG_PRESS_HARVESTED_${Date.now()}.json`);
            fs.writeFileSync(saveFile, JSON.stringify(posts, null, 2), 'utf-8');
            sendLog(`📁 Auto-saved ${posts.length} posts directly to: ${saveFile}`, 'info');
        } catch(e) {}

        sendLog(`🎉 Successfully retrieved ${posts.length} complete posts in rich JSON format!`, 'success');
        sendEvent('progress', { postsCount: posts.length, percent: 100, status: 'Complete!' });
        sendEvent('complete', { posts: posts, format: 'rich-json' });

    } catch (err) {
        sendLog(`Apify Error: ${err.message}`, 'error');
        sendEvent('error', { message: err.message });
    }
});

// ============================================================
// ENHANCED LOCAL BROWSER SCRAPER (WITH MODAL BYPASS & JSON EXTRACTION)
// ============================================================
app.post('/api/fetch', async (req, res) => {
    const { url, maxScrolls = 200, browserMode = 'visible', autoExpand = true } = req.body;

    if (!url || !url.includes('facebook.com')) {
        return res.status(400).json({ error: 'Please enter a valid Facebook URL' });
    }

    if (activeBrowser) {
        return res.status(400).json({ error: 'A scrape task is already running. Please stop it first.' });
    }

    stopRequested = false;
    res.json({ status: 'started', target: url });

    runLocalScraper(url, maxScrolls, browserMode === 'headless', autoExpand);
});

async function runLocalScraper(url, maxScrolls, isHeadless, autoExpand) {
    let browser = null;

    try {
        sendLog(`Launching Chrome (Mode: ${isHeadless ? 'Headless' : 'Visible'})...`, 'info');

        browser = await puppeteer.launch({
            executablePath: CHROME_PATH,
            headless: isHeadless,
            defaultViewport: null,
            args: [
                '--start-maximized',
                '--disable-notifications',
                '--disable-infobars',
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox'
            ]
        });

        activeBrowser = browser;

        const pages = await browser.pages();
        const page = pages.length > 0 ? pages[0] : await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');

        sendLog(`Navigating to: ${url}`, 'info');
        sendEvent('progress', { postsCount: 0, percent: 5, status: 'Loading page...' });

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await new Promise(r => setTimeout(r, 4000));

        // Inject script to destroy Facebook login popup modals that block scrolling
        await page.evaluate(() => {
            const killModals = () => {
                // Remove login dialogs & overlays
                const dialogs = document.querySelectorAll('div[role="dialog"], div[aria-modal="true"], div[data-nosnippet="true"]');
                dialogs.forEach(d => {
                    const text = (d.innerText || '').toLowerCase();
                    if (text.includes('log in') || text.includes('see more on facebook') || text.includes('create new account')) {
                        d.remove();
                    }
                });
                // Force body to scroll
                document.body.style.overflow = 'auto';
                document.documentElement.style.overflow = 'auto';
            };
            setInterval(killModals, 1000);
            killModals();
        });

        sendLog('Login modal killer active. Starting deep scroll loop...', 'info');

        let lastCount = 0;
        let consecutiveStalls = 0;

        for (let scroll = 1; scroll <= maxScrolls; scroll++) {
            if (stopRequested) {
                sendLog('Stop requested by user. Finalizing...', 'warn');
                break;
            }

            // Click 'See more'
            if (autoExpand) {
                await page.evaluate(() => {
                    const buttons = document.querySelectorAll('div[role="button"], span[role="button"]');
                    buttons.forEach(btn => {
                        const t = (btn.innerText || btn.textContent || '').trim().toLowerCase();
                        if (t === 'see more' || t === 'view more' || t === 'more') {
                            try { btn.click(); } catch(e) {}
                        }
                    });
                });
            }

            // Incremental scroll (simulating real user scroll so lazy loading triggers)
            await page.evaluate(() => {
                window.scrollBy(0, 1400);
            });

            await new Promise(r => setTimeout(r, 1800));

            const currentCount = await page.evaluate(() => document.querySelectorAll('div[role="article"]').length);
            const percent = Math.min(Math.round((scroll / maxScrolls) * 95), 95);

            if (currentCount > lastCount) {
                lastCount = currentCount;
                consecutiveStalls = 0;
                sendLog(`Harvested ${currentCount} posts in feed (Scroll ${scroll}/${maxScrolls})...`, 'info');
            } else {
                consecutiveStalls++;
                // If stuck, try a larger scroll
                if (consecutiveStalls >= 3) {
                    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
                    await new Promise(r => setTimeout(r, 2000));
                }
                if (consecutiveStalls >= 7) {
                    sendLog('Reached bottom of feed.', 'info');
                    break;
                }
            }

            sendEvent('progress', {
                postsCount: currentCount,
                percent: percent,
                status: `Harvesting posts (${scroll}/${maxScrolls})...`
            });
        }

        // Extract Complete Structured JSON
        sendLog('Extracting full structured JSON (text, dates, media, likes)...', 'info');
        sendEvent('progress', { postsCount: lastCount, percent: 98, status: 'Building JSON...' });

        const posts = await page.evaluate(() => {
            const articles = Array.from(document.querySelectorAll('div[role="article"]'));
            const results = [];
            const seen = new Set();

            articles.forEach((art, idx) => {
                const clone = art.cloneNode(true);
                clone.querySelectorAll('script, style, svg').forEach(e => e.remove());

                let text = clone.innerText || clone.textContent || '';
                text = text.replace(/\r\n/g, '\n').trim();

                if (text.length < 15) return;

                const lines = text.split('\n')
                    .map(l => l.trim())
                    .filter(l => l.length > 0 && !['Like', 'Comment', 'Share', 'Send', 'Write a comment...', 'Public', 'Follow', 'Shared with Public'].includes(l));

                const clean = lines.join('\n');
                const hash = clean.slice(0, 100);
                if (seen.has(hash)) return;
                seen.add(hash);

                // Extract Images / Media URLs
                const mediaUrls = [];
                art.querySelectorAll('img').forEach(img => {
                    const src = img.src;
                    if (src && src.includes('fbcdn.net') && !src.includes('emoji') && !mediaUrls.includes(src)) {
                        mediaUrls.push({
                            thumbnail: src,
                            type: 'Photo'
                        });
                    }
                });

                // Extract Post URL if available
                let postUrl = '';
                const linkEl = art.querySelector('a[href*="/permalink.php"], a[href*="/posts/"], a[href*="/reel/"], a[href*="/photo/"]');
                if (linkEl) postUrl = linkEl.href;

                // Extract Date
                const dateMatch = clean.match(/(\b\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\b|\b\d+[wdhms]\b)/i);

                // Extract Reactions / Likes count
                let likes = 0;
                const likesMatch = clean.match(/All reactions:?\s*(\d+)/i) || clean.match(/(\d+)\s*likes?/i);
                if (likesMatch) likes = parseInt(likesMatch[1], 10);

                results.push({
                    post_id: idx + 1,
                    url: postUrl || window.location.href,
                    date: dateMatch ? dateMatch[0] : 'Recent',
                    text: clean,
                    likes: likes,
                    media: mediaUrls
                });
            });

            return results;
        });

        sendLog(`Complete! Successfully harvested ${posts.length} structured JSON posts.`, 'success');
        sendEvent('progress', { postsCount: posts.length, percent: 100, status: 'Done!' });
        sendEvent('complete', { posts: posts, format: 'structured-json' });

    } catch (err) {
        sendLog(`Error: ${err.message}`, 'error');
        sendEvent('error', { message: err.message });
    } finally {
        if (browser) {
            try { await browser.close(); } catch(e) {}
        }
        activeBrowser = null;
        stopRequested = false;
    }
}

// Start Server
app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 Facebook Fetcher Pro is live at: http://localhost:${PORT}`);
    console.log(`===================================================`);
});
