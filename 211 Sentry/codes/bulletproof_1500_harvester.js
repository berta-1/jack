/**
 * ==============================================================================
 * 🛡️ BULLETPROOF 1500+ FEED HARVESTER (ULTRA EDITION)
 * ==============================================================================
 * Updated to bypass the 399-post ceiling and fetch 1,500+ posts.
 * 
 * Major Upgrades over the 50-cycle version:
 *  1. Expanded from 50 cycles to 3,500 cycles (Target Goal: 1,500+ posts)
 *  2. Anti-Stall "Jiggle" Engine: If Facebook stops loading at post ~399,
 *     it automatically scrolls up 800px and kicks the GraphQL infinite-scroll observer.
 *  3. Increased Stagnation Threshold from 7 to 30 attempts with auto-recovery.
 *  4. Auto-detects account name (downloads as 211_Sentry_harvest_...json).
 *  5. Retains the exact HUD UI and "Finish & Download JSON" button you loved.
 * ==============================================================================
 */

(async function bulletproof1500Harvester() {
    console.clear();
    console.log("%c🛡️ BULLETPROOF 1500+ FEED HARVESTER STARTED", "color: #38bdf8; font-size: 16px; font-weight: bold;");

    // Auto-detect target name
    const getTargetName = () => {
        const h1 = document.querySelector('h1');
        if (h1 && h1.innerText.trim()) return h1.innerText.trim().replace(/[\\/:*?"<>|]/g, '_');
        const title = document.title.split('|')[0].split('-')[0].trim();
        return title ? title.replace(/[\\/:*?"<>|]/g, '_') : "Facebook_Feed";
    };
    const targetName = getTargetName();

    const unfreezeScroll = () => {
        try {
            document.body.style.overflow = "auto";
            document.body.style.position = "static";
            document.documentElement.style.overflow = "auto";
        } catch(e) {}
    };

    const killPopups = () => {
        unfreezeScroll();
        const closeSelectors = [
            'div[aria-label="Close"]', 'div[aria-label="close"]', 'div[aria-label="Back"]',
            'div[role="dialog"] div[role="button"][tabindex="0"]', 'div[role="dialog"] i[data-visualcompletion="css-img"]'
        ];
        closeSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => { try { el.click(); } catch(e) {} });
        });
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true }));
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true }));
        document.querySelectorAll('div[role="dialog"]').forEach(dialog => {
            if (dialog.offsetWidth > 300 && !dialog.id.includes("bp-harvester")) dialog.remove();
        });
        unfreezeScroll();
    };

    killPopups();

    const existingHud = document.getElementById("bp-harvester-hud");
    if (existingHud) existingHud.remove();

    const hud = document.createElement("div");
    hud.id = "bp-harvester-hud";
    hud.style = `position:fixed;bottom:24px;right:24px;z-index:99999999;background:#0f172a;color:#f8fafc;padding:16px 20px;border-radius:12px;border:2px solid #38bdf8;font-family:sans-serif;box-shadow:0 10px 35px rgba(0,0,0,0.8);min-width:280px;line-height:1.4;`;
    hud.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <div style="font-weight:800;color:#38bdf8;font-size:15px;">⚡ ${targetName} Harvester</div>
            <span style="font-size:11px; background:#0284c7; color:white; padding:2px 6px; border-radius:4px; font-weight:bold;">1500+ Target</span>
        </div>
        <div id="bp-status" style="font-size:12px;color:#94a3b8;margin-bottom:8px;">Scanning feed...</div>
        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:12px; background:#1e293b; padding:8px 12px; border-radius:8px;">
            <span style="font-size:13px; color:#cbd5e1;">Harvested Posts:</span>
            <strong id="bp-count" style="color:#4ade80;font-size:22px; font-weight:800;">0</strong>
        </div>
        <div style="display:flex; gap:6px; margin-bottom:8px;">
            <button id="bp-jiggle-btn" style="flex:1; background:#334155; color:#38bdf8; border:1px solid #475569; padding:6px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:11px;">🦘 Kick / Unstuck</button>
            <button id="bp-pause-btn" style="flex:1; background:#334155; color:#ffffff; border:1px solid #475569; padding:6px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:11px;">⏸️ Pause</button>
        </div>
        <button id="bp-stop-btn" style="width:100%;background:#ef4444;color:white;border:none;padding:10px 12px;border-radius:8px;font-weight:bold;cursor:pointer;font-size:13px;box-shadow:0 4px 12px rgba(239,68,68,0.4);">💾 Finish & Download JSON</button>
    `;
    document.body.appendChild(hud);

    let userStopped = false;
    let isPaused = false;

    document.getElementById("bp-stop-btn").onclick = () => {
        userStopped = true;
        document.getElementById("bp-status").innerText = "Saving data...";
    };

    document.getElementById("bp-pause-btn").onclick = () => {
        isPaused = !isPaused;
        const btn = document.getElementById("bp-pause-btn");
        btn.innerText = isPaused ? "▶️ Resume" : "⏸️ Pause";
        btn.style.background = isPaused ? "#b45309" : "#334155";
        document.getElementById("bp-status").innerText = isPaused ? "Paused by user." : "Resuming crawl...";
    };

    // Jiggle recovery to wake up Facebook's infinite-scroll observer
    const triggerJiggle = async () => {
        const s = document.getElementById("bp-status");
        if (s) s.innerText = "🦘 Jiggling scroll to wake up Facebook...";
        window.scrollBy({ top: -800, behavior: 'smooth' });
        await new Promise(r => setTimeout(r, 600));
        killPopups();
        window.scrollBy({ top: 1600, behavior: 'smooth' });
        await new Promise(r => setTimeout(r, 800));
        document.documentElement.scrollTop += 600;
        window.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('resize'));
    };

    document.getElementById("bp-jiggle-btn").onclick = async () => {
        await triggerJiggle();
        extractPostsFromDOM();
    };

    const updateHUD = (status, count) => {
        const s = document.getElementById("bp-status");
        const c = document.getElementById("bp-count");
        if (s) s.innerText = status;
        if (c) c.innerText = count;
    };

    const collectedPosts = new Map();

    const expandSeeMoreSafely = () => {
        document.querySelectorAll('div[role="button"], span[role="button"]').forEach(btn => {
            const txt = (btn.innerText || "").trim().toLowerCase();
            if ((txt === "see more" || txt === "see more…" || txt === "see more...") && !btn.closest('a')) {
                try { btn.click(); } catch(e) {}
            }
        });
    };

    const extractPostsFromDOM = () => {
        const candidates = document.querySelectorAll('div[data-pagelet*="FeedUnit"], div[data-pagelet*="ProfileTimeline"], div[role="article"], div[data-ad-preview="message"], div[dir="auto"]');
        candidates.forEach(el => {
            let text = "";
            let link = "";
            let date = "";
            let img = "";

            const article = el.closest('div[role="article"]') || el.closest('div[data-pagelet*="FeedUnit"]') || el.closest('div[data-pagelet*="ProfileTimeline"]');
            if (article) {
                const messageEl = article.querySelector('div[data-ad-preview="message"], div[data-ad-comet-preview="message"], div[dir="auto"]');
                text = messageEl ? messageEl.innerText.trim() : article.innerText.trim();
                const linkEl = article.querySelector('a[href*="/posts/"], a[href*="story_fbid="], a[href*="/permalink/"], a[href*="/photo/"]');
                if (linkEl) { 
                    link = linkEl.href.split('?__cft__')[0].split('&__cft__')[0]; 
                    date = linkEl.getAttribute('aria-label') || linkEl.innerText.trim(); 
                }
                const imgEl = article.querySelector('img[src*="fbcdn"]');
                if (imgEl && !imgEl.src.includes('rsrc.php') && !imgEl.src.includes('emoji.php')) { img = imgEl.src; }
            } else if (el.getAttribute('dir') === 'auto') {
                text = (el.innerText || "").trim();
            }

            if (!text || text.length < 35) return;
            if (text.startsWith("Write a") || text.startsWith("Press Enter") || text.startsWith("Comment as") || text.startsWith("Leave a comment")) return;

            const key = link ? link : text.slice(0, 90).replace(/\s+/g, ' ');
            if (!collectedPosts.has(key)) {
                collectedPosts.set(key, {
                    index: collectedPosts.size + 1,
                    date: date || "Historical",
                    url: link,
                    text: text,
                    image: img,
                    extractedAt: new Date().toISOString()
                });
            }
        });
        updateHUD(`Harvesting... (${collectedPosts.size} posts)`, collectedPosts.size);
    };

    // 🚀 ULTRA SETTINGS: Scaled to reach 1,500+ posts
    const TARGET_GOAL = 1500;
    const MAX_CYCLES = 3500;             // Upgraded from 50 to 3,500
    const MAX_CONSECUTIVE_STALLS = 30;    // Upgraded from 7 to 30
    let stagnantCount = 0;
    let lastSize = 0;

    for (let cycle = 1; cycle <= MAX_CYCLES; cycle++) {
        if (userStopped) break;

        while (isPaused && !userStopped) {
            await new Promise(r => setTimeout(r, 400));
        }

        killPopups();
        expandSeeMoreSafely();
        extractPostsFromDOM();

        // Check if we hit the goal
        if (collectedPosts.size >= TARGET_GOAL) {
            console.log(`🎯 TARGET REACHED! Harvested ${collectedPosts.size} posts.`);
        }

        if (collectedPosts.size === lastSize) {
            stagnantCount++;
            updateHUD(`Loading older posts (Attempt ${stagnantCount}/${MAX_CONSECUTIVE_STALLS})...`, collectedPosts.size);

            // Auto-trigger Jiggle every 3 stagnant attempts to wake up Facebook's loader
            if (stagnantCount % 3 === 0) {
                await triggerJiggle();
            }

            if (stagnantCount >= MAX_CONSECUTIVE_STALLS) {
                console.warn("Reached the end of the feed or Facebook stopped delivering older posts.");
                break;
            }
        } else {
            stagnantCount = 0;
            lastSize = collectedPosts.size;
        }

        updateHUD(`Scroll ${cycle}/${MAX_CYCLES} | Posts: ${collectedPosts.size}`, collectedPosts.size);
        
        // Progressive scroll depth
        window.scrollBy({ top: 1400, behavior: 'smooth' });
        await new Promise(r => setTimeout(r, 1200));
        document.documentElement.scrollTop += 800;
        await new Promise(r => setTimeout(r, 600));

        // Milestone notification
        if (collectedPosts.size > 0 && collectedPosts.size % 200 === 0 && stagnantCount === 0) {
            console.log(`📡 [MILESTONE] ${collectedPosts.size} posts archived...`);
        }
    }

    killPopups();
    extractPostsFromDOM();

    const finalResults = Array.from(collectedPosts.values());
    console.log(`🎉 SCRAPING COMPLETE! Collected ${finalResults.length} posts.`);

    const blob = new Blob([JSON.stringify(finalResults, null, 2)], { type: "application/json" });
    const dlLink = document.createElement("a");
    dlLink.href = URL.createObjectURL(blob);
    dlLink.download = `${targetName}_harvest_${finalResults.length}_posts.json`;
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);

    hud.innerHTML = `
        <div style="font-weight:800;color:#4ade80;font-size:16px;margin-bottom:4px;">✅ Done!</div>
        <div style="font-size:13px;">Downloaded <strong>${finalResults.length}</strong> posts to your computer.</div>
    `;
    setTimeout(() => hud.remove(), 12000);
})();

