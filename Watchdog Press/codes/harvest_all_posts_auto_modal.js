/**
 * WATCHDOG PRESS - DEEP FEED HARVESTER WITH AUTO-MODAL HANDLER
 * 
 * Fixes:
 * 1. Automatically closes any open popup/modal (X button or Escape key)
 * 2. Clicks and expands all "See more" text
 * 3. Scrolls the real background feed continuously
 * 4. Extracts full text, direct URLs, dates, and images for every post
 * 5. Shows a live floating progress badge
 * 6. Downloads complete JSON when finished or when you click "Stop & Save"
 */

(async function deepFeedHarvester() {
    console.clear();
    console.log("%c🚀 STARTING COMPLETE FEED HARVESTER...", "color: #38bdf8; font-size: 16px; font-weight: bold;");

    // Close any modal currently open
    const closeModal = () => {
        const closeBtn = document.querySelector('div[aria-label="Close"], div[role="dialog"] div[role="button"][tabindex="0"]');
        if (closeBtn) {
            try { closeBtn.click(); } catch(e) {}
        }
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true }));
    };
    closeModal();

    // Floating UI
    const box = document.createElement("div");
    box.id = "feed-harvester-ui";
    box.style = "position: fixed; top: 15px; right: 15px; z-index: 9999999; background: #0f172a; color: #f8fafc; padding: 18px 22px; border-radius: 12px; border: 2px solid #38bdf8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 12px 35px rgba(0,0,0,0.85); width: 280px; line-height: 1.5;";
    box.innerHTML = `
        <div style="font-weight: 800; color: #38bdf8; font-size: 14px; margin-bottom: 6px;">⚡ Post Harvester Active</div>
        <div id="fh-status" style="font-size: 13px; color: #cbd5e1; margin-bottom: 8px;">Closing popups & scanning...</div>
        <div style="font-size: 13px;">Posts Harvested: <strong id="fh-count" style="color: #4ade80; font-size: 16px;">0</strong></div>
        <button id="fh-save-btn" style="margin-top: 12px; width: 100%; background: #ef4444; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px;">⏹ Stop & Download JSON</button>
    `;
    document.body.appendChild(box);

    let stopRequested = false;
    document.getElementById("fh-save-btn").onclick = () => {
        stopRequested = true;
        document.getElementById("fh-status").innerText = "Finishing and saving...";
    };

    const updateUI = (status, count) => {
        const s = document.getElementById("fh-status");
        const c = document.getElementById("fh-count");
        if (s) s.innerText = status;
        if (c) c.innerText = count;
    };

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const postsMap = new Map();

    // Expand all 'See more'
    const expandAllText = () => {
        document.querySelectorAll('div[role="button"], span[role="button"]').forEach(btn => {
            const t = (btn.innerText || "").trim().toLowerCase();
            if (t === "see more" || t === "view more" || t === "more") {
                try { btn.click(); } catch(e) {}
            }
        });
    };

    // Scrape currently visible posts
    const scrapeCurrentView = () => {
        closeModal();
        expandAllText();

        const articles = document.querySelectorAll('div[data-pagelet*="FeedUnit"], div[role="article"], div[data-ad-preview="message"]');
        
        articles.forEach(art => {
            // Find post root container
            const container = art.closest('div[role="article"]') || art.closest('div[data-pagelet*="FeedUnit"]') || art;
            
            // Extract text
            const textEl = container.querySelector('div[data-ad-preview="message"], div[dir="auto"]');
            const text = textEl ? textEl.innerText.trim() : (art.innerText || "").trim();

            if (text.length < 25) return;

            // Extract link & date
            const linkEl = container.querySelector('a[href*="/posts/"], a[href*="story_fbid="], a[href*="/permalink/"], a[href*="/photo/"]');
            let link = linkEl ? linkEl.href : "";
            let dateText = linkEl ? linkEl.innerText.trim() : "";

            // Extract image
            const imgEl = container.querySelector('img[src*="fbcdn"]');
            const img = imgEl ? imgEl.src : "";

            // Use first 50 chars of text as key to avoid duplicates
            const key = text.slice(0, 70);

            if (!postsMap.has(key)) {
                postsMap.set(key, {
                    id: postsMap.size + 1,
                    date: dateText,
                    url: link,
                    text: text,
                    image: img,
                    scrapedAt: new Date().toISOString()
                });
            }
        });

        updateUI(`Harvesting feed...`, postsMap.size);
    };

    // Main scroll loop
    const maxScrolls = 40;
    let unchanged = 0;
    let prevCount = 0;

    for (let scroll = 1; scroll <= maxScrolls; scroll++) {
        if (stopRequested) break;

        closeModal();
        scrapeCurrentView();

        if (postsMap.size === prevCount) {
            unchanged++;
            if (unchanged >= 6) {
                console.log("Reached end of visible feed.");
                break;
            }
        } else {
            unchanged = 0;
            prevCount = postsMap.size;
        }

        updateUI(`Scrolling feed (${scroll}/${maxScrolls})...`, postsMap.size);
        window.scrollBy(0, 1800);
        await sleep(1500);
    }

    // Final sweep
    closeModal();
    scrapeCurrentView();

    const results = Array.from(postsMap.values());
    console.log(`🎉 Complete! Total unique posts harvested: ${results.length}`);

    // Download JSON
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `watchdog_press_all_feed_posts_${Date.now()}.json`);
    document.body.appendChild(dl);
    dl.click();
    document.body.removeChild(dl);

    box.innerHTML = `
        <div style="font-weight: 800; color: #4ade80; font-size: 15px; margin-bottom: 6px;">✅ Harvest Complete!</div>
        <div style="font-size: 13px;">Downloaded <strong>${results.length}</strong> unique posts to your computer.</div>
    `;
    setTimeout(() => box.remove(), 8000);
})();
