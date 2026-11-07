/**
 * =========================================================================
 * 🛡️ BULLETPROOF FACEBOOK FEED HARVESTER (NO-STUCK / POPUP-KILLER)
 * =========================================================================
 * 
 * Specifically designed to fix:
 * 1. "Opens one post and gets stuck" -> FORCIBLY CLOSES / REMOVES any popup dialog
 * 2. "Overflow locked" -> Forces document.body & html overflow to auto
 * 3. "Only scrolls dialog" -> Always scrolls the root feed viewport
 * 4. Extracts: Post Full Text, Date, Link, and Photo
 * 5. Saves directly to watchdog_posts_harvested.json
 */

(async function bulletproofHarvester() {
    console.clear();
    console.log("%c🛡️ BULLETPROOF FEED HARVESTER STARTED", "color: #38bdf8; font-size: 16px; font-weight: bold; background: #0f172a; padding: 4px 8px; border-radius: 4px;");

    // 1. Force unfreeze any locked scrollbars
    const unfreezeScroll = () => {
        document.body.style.overflow = "auto";
        document.body.style.position = "static";
        document.documentElement.style.overflow = "auto";
    };

    // 2. Aggressive popup/modal killer
    const killPopups = () => {
        unfreezeScroll();

        // Try clicking close buttons
        const closeSelectors = [
            'div[aria-label="Close"]',
            'div[aria-label="close"]',
            'div[aria-label="Back"]',
            'div[role="dialog"] div[role="button"][tabindex="0"]',
            'div[role="dialog"] i[data-visualcompletion="css-img"]'
        ];
        for (const sel of closeSelectors) {
            document.querySelectorAll(sel).forEach(el => {
                try { el.click(); } catch(e) {}
            });
        }

        // Send Escape key events
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true }));
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true }));

        // If any dialog is still blocking the screen, remove it from DOM
        document.querySelectorAll('div[role="dialog"]').forEach(dialog => {
            // Only remove if it's an overlay popup
            if (dialog.offsetWidth > 300) {
                dialog.remove();
            }
        });

        unfreezeScroll();
    };

    // Kill any initially open modal
    killPopups();

    // 3. Floating HUD Control Panel
    const existingHud = document.getElementById("bp-harvester-hud");
    if (existingHud) existingHud.remove();

    const hud = document.createElement("div");
    hud.id = "bp-harvester-hud";
    hud.style = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999999;
        background: #0f172a;
        color: #f8fafc;
        padding: 16px 20px;
        border-radius: 12px;
        border: 2px solid #38bdf8;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 10px 35px rgba(0,0,0,0.8);
        min-width: 260px;
        line-height: 1.4;
    `;
    hud.innerHTML = `
        <div style="font-weight: 800; color: #38bdf8; font-size: 15px; margin-bottom: 4px;">⚡ Watchdog Feed Scraper</div>
        <div id="bp-status" style="font-size: 12px; color: #94a3b8; margin-bottom: 8px;">Scanning feed...</div>
        <div style="font-size: 14px; margin-bottom: 12px;">Unique Posts: <strong id="bp-count" style="color: #4ade80; font-size: 18px;">0</strong></div>
        <button id="bp-stop-btn" style="width: 100%; background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px;">💾 Finish & Download JSON</button>
    `;
    document.body.appendChild(hud);

    let userStopped = false;
    document.getElementById("bp-stop-btn").onclick = () => {
        userStopped = true;
        document.getElementById("bp-status").innerText = "Saving data...";
    };

    const updateHUD = (status, count) => {
        const s = document.getElementById("bp-status");
        const c = document.getElementById("bp-count");
        if (s) s.innerText = status;
        if (c) c.innerText = count;
    };

    // 4. Storage Map to avoid duplicates
    const collectedPosts = new Map();

    // 5. Expand "See more" text WITHOUT triggering links or popups
    const expandSeeMoreSafely = () => {
        document.querySelectorAll('div[role="button"], span[role="button"]').forEach(btn => {
            const txt = (btn.innerText || "").trim().toLowerCase();
            // ONLY click if it literally says "see more" and is NOT inside an anchor link
            if ((txt === "see more" || txt === "see more…") && !btn.closest('a')) {
                try {
                    btn.click();
                } catch(e) {}
            }
        });
    };

    // 6. Extraction function
    const extractPostsFromDOM = () => {
        // Collect from multiple Facebook feed structures
        const candidates = document.querySelectorAll([
            'div[data-pagelet*="FeedUnit"]',
            'div[role="article"]',
            'div[data-ad-preview="message"]',
            'div[dir="auto"]'
        ].join(', '));

        candidates.forEach(el => {
            let text = "";
            let link = "";
            let date = "";
            let img = "";

            // If it's a full article or feed container
            const article = el.closest('div[role="article"]') || el.closest('div[data-pagelet*="FeedUnit"]');
            if (article) {
                const messageEl = article.querySelector('div[data-ad-preview="message"], div[dir="auto"]');
                text = messageEl ? messageEl.innerText.trim() : article.innerText.trim();
                
                const linkEl = article.querySelector('a[href*="/posts/"], a[href*="story_fbid="], a[href*="/permalink/"], a[href*="/photo/"]');
                if (linkEl) {
                    link = linkEl.href;
                    date = linkEl.innerText.trim();
                }

                const imgEl = article.querySelector('img[src*="fbcdn"]');
                if (imgEl && !imgEl.src.includes('rsrc.php')) {
                    img = imgEl.src;
                }
            } else if (el.getAttribute('dir') === 'auto') {
                text = (el.innerText || "").trim();
            }

            // Clean up text
            if (!text || text.length < 35) return;
            if (text.startsWith("Write a") || text.startsWith("Press Enter") || text.startsWith("Comment as")) return;

            // Signature key
            const key = text.slice(0, 80).replace(/\s+/g, ' ');

            if (!collectedPosts.has(key)) {
                collectedPosts.set(key, {
                    index: collectedPosts.size + 1,
                    date: date || "2023-2024",
                    url: link,
                    text: text,
                    image: img,
                    extractedAt: new Date().toISOString()
                });
            }
        });

        updateHUD("Scrolling & collecting...", collectedPosts.size);
    };

    // 7. Scroll Engine
    const MAX_CYCLES = 50;
    let stagnantCount = 0;
    let lastSize = 0;

    for (let cycle = 1; cycle <= MAX_CYCLES; cycle++) {
        if (userStopped) break;

        // Auto-close any popup that might have triggered
        killPopups();

        // Safely expand inline text
        expandSeeMoreSafely();

        // Read DOM
        extractPostsFromDOM();

        // Check if new posts were discovered
        if (collectedPosts.size === lastSize) {
            stagnantCount++;
            if (stagnantCount >= 7) {
                console.log("No new posts discovered after 7 consecutive scrolls. Done!");
                break;
            }
        } else {
            stagnantCount = 0;
            lastSize = collectedPosts.size;
        }

        updateHUD(`Scroll step ${cycle}/${MAX_CYCLES} | Posts: ${collectedPosts.size}`, collectedPosts.size);

        // Scroll the actual window
        window.scrollBy({ top: 1200, behavior: 'smooth' });
        await new Promise(r => setTimeout(r, 1500));

        // In case Facebook is scrolling an internal container, scroll documentElement too
        document.documentElement.scrollTop += 1200;
    }

    // Final sweep
    killPopups();
    extractPostsFromDOM();

    const finalResults = Array.from(collectedPosts.values());
    console.log(`%c🎉 SCRAPING COMPLETE! Collected ${finalResults.length} unique posts.`, "color: #4ade80; font-size: 16px; font-weight: bold;");

    // 8. Auto-Download File
    const blob = new Blob([JSON.stringify(finalResults, null, 2)], { type: "application/json" });
    const dlLink = document.createElement("a");
    dlLink.href = URL.createObjectURL(blob);
    dlLink.download = `watchdog_press_harvest_${finalResults.length}_posts.json`;
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);

    hud.innerHTML = `
        <div style="font-weight: 800; color: #4ade80; font-size: 16px; margin-bottom: 4px;">✅ Done!</div>
        <div style="font-size: 13px; margin-bottom: 6px;">Saved <strong>${finalResults.length}</strong> posts to your computer.</div>
        <div style="font-size: 11px; color: #94a3b8;">Check your browser Downloads folder.</div>
    `;
    setTimeout(() => hud.remove(), 10000);
})();
