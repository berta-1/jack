/**
 * ==============================================================================
 * 🛡️ TITAN OSINT FEED HARVESTER v3.0 (PRO ENTERPRISE EDITION)
 * ==============================================================================
 * Specialized for Facebook Profiles (Professional Mode), Pages, and Groups.
 * Designed for High-Volume Extraction, Anti-Virtualization, and Stagnation Bypass.
 *
 * Capabilities:
 *  - Full post text with auto 'See More' expansion (zero dialog freeze)
 *  - Canonical Post ID, permalink, author attribution, and repost detection
 *  - Accurate timestamp extraction (relative + exact aria-labels)
 *  - Multi-image gallery extraction (HD CDN urls, filters avatars/emojis)
 *  - Engagement metrics (Likes, Reactions, Comments, Shares)
 *  - Smart 'Jiggle' scroll recovery when Facebook infinite scroll stalls
 *  - Real-time interactive HUD with Pause, Resume, Force-Jiggle, and Stop
 *  - Dual Export: Formatted JSON + Universal Spreadsheet CSV
 * ==============================================================================
 */

(async function titanHarvester() {
    'use strict';
    console.clear();
    console.log(
        "%c⚡ [TITAN OSINT] HARVESTER INITIALIZED - ADVANCED EXTRACTION ENGINE READY",
        "background: #0284c7; color: #ffffff; font-size: 14px; font-weight: bold; padding: 6px 12px; border-radius: 4px;"
    );

    // 1. Detect Target Identity
    const getTargetInfo = () => {
        let name = "Target_Account";
        const h1 = document.querySelector('h1');
        if (h1 && h1.innerText.trim()) {
            name = h1.innerText.trim().replace(/[\\/:*?"<>|]/g, '_');
        } else {
            const title = document.title.split('|')[0].split('-')[0].trim();
            if (title) name = title.replace(/[\\/:*?"<>|]/g, '_');
        }
        return {
            name: name,
            url: window.location.href,
            id: (window.location.href.match(/id=(\d+)/) || [])[1] || "unknown"
        };
    };

    const target = getTargetInfo();

    // 2. Unfreeze DOM and Suppress Modal Traps
    const unfreezeScroll = () => {
        try {
            document.body.style.overflow = "auto";
            document.body.style.position = "static";
            document.documentElement.style.overflow = "auto";
        } catch (e) {}
    };

    const killPopups = () => {
        unfreezeScroll();
        const closeSelectors = [
            'div[aria-label="Close"]', 'div[aria-label="close"]', 'div[aria-label="Back"]',
            'div[role="dialog"] div[role="button"][tabindex="0"]',
            'div[role="dialog"] i[data-visualcompletion="css-img"]'
        ];
        closeSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                try { el.click(); } catch(e) {}
            });
        });

        // Dispatch Escape keys
        const escEvent = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true });
        document.dispatchEvent(escEvent);
        window.dispatchEvent(escEvent);

        // Remove any intrusive backdrop or large blocking dialogs
        document.querySelectorAll('div[role="dialog"]').forEach(dialog => {
            if (dialog.offsetWidth > 320 && !dialog.id.includes("titan")) {
                try { dialog.remove(); } catch(e) {}
            }
        });
        unfreezeScroll();
    };

    killPopups();

    // 3. Construct High-Tech Cyberpunk HUD
    const existingHud = document.getElementById("titan-harvester-hud");
    if (existingHud) existingHud.remove();

    const hud = document.createElement("div");
    hud.id = "titan-harvester-hud";
    hud.style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 999999999;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(8px);
        color: #f8fafc;
        padding: 16px 20px;
        border-radius: 12px;
        border: 2px solid #0284c7;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
        min-width: 300px;
        max-width: 360px;
        line-height: 1.4;
        transition: all 0.2s ease;
    `;

    hud.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #334155; padding-bottom:6px;">
            <div style="font-weight:800; color:#38bdf8; font-size:14px; letter-spacing:0.5px;">⚡ TITAN OSINT HARVESTER</div>
            <span id="titan-minimize" style="cursor:pointer; color:#94a3b8; font-size:16px; font-weight:bold;">−</span>
        </div>
        <div id="titan-body">
            <div style="font-size:12px; color:#cbd5e1; margin-bottom:4px;">Target: <strong style="color:#ffffff;">${target.name}</strong></div>
            <div id="titan-status" style="font-size:12px; color:#38bdf8; font-weight:600; margin-bottom:10px;">Initializing crawler engine...</div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; background:#1e293b; padding:10px; border-radius:8px; margin-bottom:12px; text-align:center;">
                <div>
                    <div style="font-size:10px; color:#94a3b8; text-transform:uppercase;">Harvested Posts</div>
                    <div id="titan-count" style="font-size:22px; font-weight:800; color:#4ade80;">0</div>
                </div>
                <div>
                    <div style="font-size:10px; color:#94a3b8; text-transform:uppercase;">With Images</div>
                    <div id="titan-img-count" style="font-size:22px; font-weight:800; color:#38bdf8;">0</div>
                </div>
            </div>

            <div style="display:flex; gap:6px; margin-bottom:8px;">
                <button id="titan-pause-btn" style="flex:1; background:#334155; color:#ffffff; border:1px solid #475569; padding:6px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:12px;">⏸️ Pause</button>
                <button id="titan-jiggle-btn" style="flex:1; background:#0284c7; color:#ffffff; border:none; padding:6px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:12px;">🦘 Unstuck / Kick</button>
            </div>

            <div style="display:flex; gap:6px;">
                <button id="titan-save-json" style="flex:1; background:#10b981; color:#ffffff; border:none; padding:8px 10px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:12px;">💾 Save JSON</button>
                <button id="titan-save-csv" style="flex:1; background:#6366f1; color:#ffffff; border:none; padding:8px 10px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:12px;">📊 Save CSV</button>
            </div>
            <button id="titan-stop-btn" style="width:100%; margin-top:6px; background:#ef4444; color:#ffffff; border:none; padding:7px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:12px;">⏹️ Finish & Close</button>
        </div>
    `;
    document.body.appendChild(hud);

    // Minimize HUD toggle
    let isMinimized = false;
    document.getElementById("titan-minimize").onclick = () => {
        isMinimized = !isMinimized;
        document.getElementById("titan-body").style.display = isMinimized ? "none" : "block";
        document.getElementById("titan-minimize").innerText = isMinimized ? "+" : "−";
    };

    let isPaused = false;
    let isFinished = false;

    document.getElementById("titan-pause-btn").onclick = () => {
        isPaused = !isPaused;
        const btn = document.getElementById("titan-pause-btn");
        btn.innerText = isPaused ? "▶️ Resume" : "⏸️ Pause";
        btn.style.background = isPaused ? "#b45309" : "#334155";
        document.getElementById("titan-status").innerText = isPaused ? "PAUSED by user." : "Resuming crawl...";
    };

    document.getElementById("titan-stop-btn").onclick = () => {
        isFinished = true;
        document.getElementById("titan-status").innerText = "Finalizing archive...";
    };

    const updateHUD = (status, count, imgCount) => {
        const s = document.getElementById("titan-status");
        const c = document.getElementById("titan-count");
        const ic = document.getElementById("titan-img-count");
        if (s) s.innerText = status;
        if (c) c.innerText = count;
        if (ic) ic.innerText = imgCount;
    };

    // 4. In-Memory Post Store
    const collectedPosts = new Map();
    let totalImagesFound = 0;

    // 5. Expand "See More" Safely
    const expandSeeMore = () => {
        const buttons = document.querySelectorAll('div[role="button"], span[role="button"]');
        buttons.forEach(btn => {
            const txt = (btn.innerText || "").trim().toLowerCase();
            if ((txt === "see more" || txt === "see more…" || txt === "see more...") && !btn.closest('a')) {
                try {
                    btn.click();
                } catch (e) {}
            }
        });
    };

    // 6. Deep Parser for Facebook Articles
    const parseArticle = (article) => {
        // Extract Text
        let text = "";
        const messageBox = article.querySelector('div[data-ad-preview="message"], div[data-ad-comet-preview="message"]');
        if (messageBox) {
            text = messageBox.innerText.trim();
        } else {
            // Find container with dir="auto"
            const autoTexts = Array.from(article.querySelectorAll('div[dir="auto"]'))
                .map(d => d.innerText.trim())
                .filter(t => t.length > 25 && !t.startsWith("Write a") && !t.startsWith("Comment as") && !t.includes("All reactions:"));
            if (autoTexts.length > 0) {
                // Pick the longest coherent block
                autoTexts.sort((a, b) => b.length - a.length);
                text = autoTexts[0];
            } else {
                text = article.innerText.trim();
            }
        }

        // Clean out garbage UI strings from text
        if (!text || text.length < 30) return null;
        if (text.startsWith("Write a public comment") || text.startsWith("Leave a comment") || text.includes("Log In to Facebook")) return null;

        // Extract Canonical Link & Dates
        let url = "";
        let relativeDate = "";
        let exactDate = "";

        const links = Array.from(article.querySelectorAll('a[href]'));
        for (const l of links) {
            const h = l.href;
            if (h.includes("/posts/") || h.includes("story_fbid=") || h.includes("/permalink/") || (h.includes("/photo/") && !h.includes("profile"))) {
                url = h.split('?__cft__')[0].split('&__cft__')[0]; // clean tracking params
                relativeDate = (l.innerText || "").trim();
                exactDate = l.getAttribute('aria-label') || l.getAttribute('title') || "";
                break;
            }
        }

        // Search deeper for timestamp aria-label
        if (!exactDate) {
            const timeEl = article.querySelector('span[id] a[aria-label], span[aria-labelledby] a');
            if (timeEl && timeEl.getAttribute('aria-label')) {
                exactDate = timeEl.getAttribute('aria-label');
            }
        }

        // Extract Images (HD Facebook CDN)
        const images = [];
        const imgs = article.querySelectorAll('img[src*="fbcdn"]');
        imgs.forEach(im => {
            const src = im.src;
            // Ignore emojis, reaction badges, profile icons, and small UI thumbnails
            if (src.includes('/rsrc.php') || src.includes('emoji.php') || src.includes('p24x24') || src.includes('p50x50') || src.includes('s50x50') || src.includes('s40x40')) {
                return;
            }
            if (im.naturalWidth > 150 || im.width > 150 || (!im.naturalWidth && !images.includes(src))) {
                if (!images.includes(src)) images.push(src);
            }
        });

        // Extract Engagement Metrics
        let reactions = "";
        let commentsCount = "";
        let sharesCount = "";

        // Reactions (e.g. "84 likes", "1.2K")
        const reactionEl = article.querySelector('span[data-visualcompletion="css-img"] ~ span, span[aria-label*="reaction"], div[aria-label*="reaction"]');
        if (reactionEl) reactions = reactionEl.innerText.trim();

        // Comments & Shares
        const footerText = article.innerText;
        const commentMatch = footerText.match(/(\d+[\d,.]*\s*k?)\s+comments?/i);
        if (commentMatch) commentsCount = commentMatch[1];
        const shareMatch = footerText.match(/(\d+[\d,.]*\s*k?)\s+shares?/i);
        if (shareMatch) sharesCount = shareMatch[1];

        // Deduplication Key: Use canonical URL if available, otherwise first 80 characters of text
        let key = url ? url : text.slice(0, 90).replace(/\s+/g, ' ');

        return {
            key: key,
            data: {
                id: (url.match(/posts\/(\w+)/) || url.match(/story_fbid=([\w]+)/) || [])[1] || `post_${Date.now()}_${Math.floor(Math.random()*1000)}`,
                date: exactDate || relativeDate || "Historical",
                relativeDate: relativeDate,
                exactTimestamp: exactDate,
                url: url,
                text: text,
                images: images,
                engagement: {
                    reactions: reactions,
                    comments: commentsCount,
                    shares: sharesCount
                },
                extractedAt: new Date().toISOString()
            }
        };
    };

    // 7. Harvesting Cycle Engine
    const harvestDOM = () => {
        // Collect all article containers
        const articles = document.querySelectorAll('div[role="article"], div[data-pagelet*="FeedUnit"], div[data-pagelet*="ProfileTimeline"]');
        articles.forEach(art => {
            try {
                const parsed = parseArticle(art);
                if (parsed && !collectedPosts.has(parsed.key)) {
                    collectedPosts.set(parsed.key, {
                        index: collectedPosts.size + 1,
                        ...parsed.data
                    });
                    if (parsed.data.images.length > 0) {
                        totalImagesFound += parsed.data.images.length;
                    }
                }
            } catch (err) {}
        });
        updateHUD("Harvesting live feed...", collectedPosts.size, totalImagesFound);
    };

    // 8. Smart Jiggle Scroll to Kickstart Stalled Feeds
    const performJiggle = async () => {
        updateHUD("🦘 Performing Jiggle scroll...", collectedPosts.size, totalImagesFound);
        // Step 1: Scroll UP 900px to trigger reflow
        window.scrollBy({ top: -900, behavior: 'smooth' });
        await new Promise(r => setTimeout(r, 800));
        // Step 2: Unfreeze body
        killPopups();
        // Step 3: Scroll DOWN past the current view
        window.scrollBy({ top: 1600, behavior: 'smooth' });
        await new Promise(r => setTimeout(r, 1200));
        document.documentElement.scrollTop += 800;
        await new Promise(r => setTimeout(r, 1000));
    };

    document.getElementById("titan-jiggle-btn").onclick = async () => {
        await performJiggle();
        harvestDOM();
    };

    // 9. Export Utilities (JSON & CSV)
    const exportJSON = () => {
        const records = Array.from(collectedPosts.values());
        if (records.length === 0) {
            alert("No posts collected yet to export!");
            return;
        }
        const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${target.name}_TITAN_HARVEST_${records.length}_POSTS.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log(`✅ [TITAN OSINT] Exported ${records.length} posts to JSON.`);
    };

    const exportCSV = () => {
        const records = Array.from(collectedPosts.values());
        if (records.length === 0) {
            alert("No posts collected yet to export!");
            return;
        }
        const headers = ["Index", "Post ID", "Date", "Exact Timestamp", "URL", "Reactions", "Comments", "Shares", "Images Count", "Text Content"];
        const rows = records.map(r => [
            r.index,
            `"${(r.id || '').replace(/"/g, '""')}"`,
            `"${(r.date || '').replace(/"/g, '""')}"`,
            `"${(r.exactTimestamp || '').replace(/"/g, '""')}"`,
            `"${(r.url || '').replace(/"/g, '""')}"`,
            `"${(r.engagement?.reactions || '').replace(/"/g, '""')}"`,
            `"${(r.engagement?.comments || '').replace(/"/g, '""')}"`,
            `"${(r.engagement?.shares || '').replace(/"/g, '""')}"`,
            r.images ? r.images.length : 0,
            `"${(r.text || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
        ]);

        const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${target.name}_TITAN_HARVEST_${records.length}_POSTS.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log(`✅ [TITAN OSINT] Exported ${records.length} posts to CSV.`);
    };

    document.getElementById("titan-save-json").onclick = exportJSON;
    document.getElementById("titan-save-csv").onclick = exportCSV;

    // 10. Main Infinite Autonomous Crawl Loop
    const MAX_CONSECUTIVE_STALLS = 14;
    let consecutiveStalls = 0;
    let lastCollectedSize = 0;
    let scrollCycle = 0;

    // Set safety cap at 10,000 cycles (or user manual finish)
    const MAX_LIFETIME_CYCLES = 10000;

    while (scrollCycle < MAX_LIFETIME_CYCLES && !isFinished) {
        scrollCycle++;

        // Handle Pause state
        while (isPaused && !isFinished) {
            await new Promise(r => setTimeout(r, 500));
        }

        if (isFinished) break;

        // Periodic Popup Cleaner & Text Expander
        killPopups();
        expandSeeMore();
        harvestDOM();

        // Stagnation Detection
        if (collectedPosts.size === lastCollectedSize) {
            consecutiveStalls++;
            updateHUD(`⏳ Feed loading (Attempt ${consecutiveStalls}/${MAX_CONSECUTIVE_STALLS})...`, collectedPosts.size, totalImagesFound);

            // If stalled for 3 ticks, do active jiggle
            if (consecutiveStalls % 3 === 0) {
                await performJiggle();
            }

            // If stalled for max threshold, prompt user or stop
            if (consecutiveStalls >= MAX_CONSECUTIVE_STALLS) {
                console.warn("[TITAN OSINT] Feed reached natural end or rate-limited.");
                break;
            }
        } else {
            consecutiveStalls = 0;
            lastCollectedSize = collectedPosts.size;
        }

        // Smooth Scroll Down
        window.scrollBy({ top: 1400, behavior: 'smooth' });
        await new Promise(r => setTimeout(r, 1200));
        document.documentElement.scrollTop += 600;
        await new Promise(r => setTimeout(r, 800));

        // Auto-save progress beacon in console every 100 posts
        if (collectedPosts.size > 0 && collectedPosts.size % 100 === 0) {
            console.log(`📡 [TITAN OSINT BEACON] Milestone reached: ${collectedPosts.size} posts archived.`);
        }
    }

    // Final Post-Crawl Sweep
    killPopups();
    expandSeeMore();
    harvestDOM();

    // Auto-trigger final JSON download
    exportJSON();

    hud.innerHTML = `
        <div style="font-weight:800; color:#4ade80; font-size:15px; margin-bottom:6px;">🎉 HARVEST COMPLETE!</div>
        <div style="font-size:13px; color:#f8fafc; margin-bottom:8px;">Archived <strong>${collectedPosts.size}</strong> total posts.</div>
        <div style="display:flex; gap:6px;">
            <button id="titan-final-csv" style="flex:1; background:#6366f1; color:#ffffff; border:none; padding:7px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:12px;">📊 Download CSV</button>
            <button id="titan-final-json" style="flex:1; background:#10b981; color:#ffffff; border:none; padding:7px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:12px;">💾 Download JSON</button>
        </div>
    `;

    document.getElementById("titan-final-csv").onclick = exportCSV;
    document.getElementById("titan-final-json").onclick = exportJSON;

    console.log(`%c🏆 [TITAN OSINT] SUCCESS: ${collectedPosts.size} posts archived for ${target.name}`, "color:#4ade80; font-size:16px; font-weight:bold;");
})();

