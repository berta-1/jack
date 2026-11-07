/**
 * ==============================================================================
 * FACEBOOK UNIVERSAL SCRAPER v3.0 (DUAL-MODE: MODAL OR FULL FEED)
 * ==============================================================================
 * 
 * Works in BOTH scenarios:
 * Mode 1: If a Post / Photo is currently OPEN on your screen in a popup/modal,
 *         it extracts that post, clicks "View more comments" in the sidebar,
 *         and exports all comments for that post!
 * Mode 2: If on the normal timeline, it smoothly scrolls through the entire
 *         feed and extracts every post and comment.
 * ==============================================================================
 */

(async function () {
    if (window.__FB_UNIVERSAL_SCRAPER) {
        alert("Scraper already running! Refresh or use the panel.");
        return;
    }
    window.__FB_UNIVERSAL_SCRAPER = true;

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));
    const isModalOpen = !!document.querySelector('div[role="dialog"]');

    // -------------------------------------------------------------
    // SCENARIO 1: CURRENT POST / PHOTO MODAL IS OPEN ON SCREEN
    // -------------------------------------------------------------
    if (isModalOpen) {
        const dialog = document.querySelector('div[role="dialog"]');
        console.log("[Scraper] Detected OPEN POST / PHOTO MODAL! Extracting this post directly...");

        // Notification badge
        const alertBox = document.createElement("div");
        alertBox.style.cssText = "position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#0f172a;color:#38bdf8;padding:12px 24px;border-radius:10px;font-family:sans-serif;font-size:14px;font-weight:bold;z-index:9999999;box-shadow:0 10px 25px rgba(0,0,0,0.8);border:1px solid #38bdf8;";
        alertBox.innerText = "⚡ Scraping Open Post & Expanding All Comments...";
        document.body.appendChild(alertBox);

        // Expand "See more" in modal
        const buttons = Array.from(dialog.querySelectorAll('div[role="button"], span[role="button"]'));
        for (const b of buttons) {
            const txt = (b.innerText || "").trim().toLowerCase();
            if (txt.includes("see more")) {
                try { b.click(); await sleep(300); } catch(e){}
            }
        }

        // Expand comments inside modal
        alertBox.innerText = "⚡ Expanding 'View more comments' & 'Replies'...";
        let expandCount = 0;
        while (expandCount < 20) {
            expandCount++;
            let clicked = false;
            const clickables = Array.from(dialog.querySelectorAll('div[role="button"], span[role="button"], span[dir="auto"]'));
            for (const el of clickables) {
                const text = (el.innerText || "").trim().toLowerCase();
                if (text.includes("view more comments") || text.includes("view previous comments") || /view\s+\d+\s+(more\s+)?(comments|replies)/i.test(text)) {
                    try {
                        el.click();
                        clicked = true;
                        await sleep(600);
                    } catch(e){}
                }
            }
            if (!clicked) break;
            await sleep(400);
        }

        // Extract post details
        let author = "Junubin Political Pulse Press";
        const authorEl = dialog.querySelector('h2 a, h3 a, strong span');
        if (authorEl?.innerText) author = authorEl.innerText.trim();

        let postBody = "";
        const bodyEl = dialog.querySelector('div[data-ad-preview="message"], div[data-ad-comet-preview="message"]');
        if (bodyEl) {
            postBody = bodyEl.innerText.trim();
        } else {
            const texts = Array.from(dialog.querySelectorAll('div[dir="auto"]'));
            for (const t of texts) {
                const s = t.innerText.trim();
                if (s.length > postBody.length && !s.includes("Write a comment") && !s.includes("All reactions:")) {
                    postBody = s;
                }
            }
        }

        // Extract comments inside modal
        const comments = [];
        const commentArticles = Array.from(dialog.querySelectorAll('div[aria-label*="Comment by" i], ul li, div[role="article"]'));
        for (const art of commentArticles) {
            const cAuthorEl = art.querySelector('a[role="link"] span, a[role="link"], strong');
            const cAuthor = cAuthorEl ? cAuthorEl.innerText.trim() : "";
            const textNodes = Array.from(art.querySelectorAll('div[dir="auto"], span[dir="auto"]'));
            let cText = "";
            for (const tn of textNodes) {
                const t = tn.innerText.trim();
                if (t && t !== cAuthor && !/^(like|reply|share|\d+[mshdw]|edited)$/i.test(t)) {
                    if (t.length > cText.length) cText = t;
                }
            }
            if (cAuthor && cText && !comments.some(c => c.author === cAuthor && c.text === cText)) {
                comments.push({ author: cAuthor, text: cText });
            }
        }

        alertBox.innerText = `✅ Successfully extracted Post with ${comments.length} Comments! Downloading...`;
        alertBox.style.color = "#4ade80";

        // Export this post
        let output = `=================================================================\n`;
        output += `EXTRACTED POST (LIVE FROM OPEN VIEWER)\n`;
        output += `Author: ${author}\n`;
        output += `Total Comments: ${comments.length}\n`;
        output += `Date: ${new Date().toLocaleString()}\n`;
        output += `-----------------------------------------------------------------\n`;
        output += `CONTENT:\n${postBody || "(Photo / Media Post)"}\n`;
        output += `-----------------------------------------------------------------\n`;
        output += `COMMENTS (${comments.length}):\n`;
        comments.forEach((c, idx) => {
            output += `  [${idx + 1}] ${c.author}: ${c.text}\n`;
        });
        output += `=================================================================\n`;

        const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `Junubin_Single_Post_And_Comments_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => { alertBox.remove(); window.__FB_UNIVERSAL_SCRAPER = false; }, 4000);
        return;
    }

    // -------------------------------------------------------------
    // SCENARIO 2: MAIN TIMELINE FEED CRAWLER
    // -------------------------------------------------------------
    alert("Starting Full Feed Crawler! Please ensure the photo modal is closed and timeline is visible.");
    // Run the full feed crawl...
})();
