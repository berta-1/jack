/**
 * =========================================================================
 * 🕵️‍♂️ DENG CLINTON PERSONAL PROFILE FORENSIC HARVESTER
 * Target: https://web.facebook.com/wrong.dee.7 (Deng Clinton)
 * =========================================================================
 * 
 * Capabilities:
 * 1. Anti-Stuck & Popup Killer: Auto-closes dialogs, unfreezes scrollbars
 * 2. Automated DOM Unfolding: Auto-clicks "See more" / "View more"
 * 3. Deep Extraction: Post Text, Date/Timestamp, Permalink, Images, Videos
 * 4. Real-Time OSINT Keyword Classifier:
 *    - Tags mentions of "Akec Tong", "Michael Wetnhialic", "211 Sentry",
 *      "Salva Kiir", "Atem Kiir", "Akol Santo", "Blue House", "NSS"
 * 5. Smart Infinite Jiggle Scroll: Overcomes Facebook lazy loading
 * 6. Live Forensic HUD with Target Stats and One-Click JSON Download
 */

(async function dengClintonHarvester() {
    console.clear();
    console.log("%c🕵️ DENG CLINTON OSINT PROFILE HARVESTER INITIALIZED", "color: #38bdf8; font-size: 16px; font-weight: bold; background: #0f172a; padding: 6px 12px; border-radius: 6px;");

    // --- Configuration ---
    const TARGET_NAME = "Deng Clinton (@wrong.dee.7)";
    const OUTPUT_FILENAME = "DENG_CLINTON_PERSONAL_HARVEST.json";
    const MAX_CYCLES = 3500;
    const SCROLL_DELAY_MS = 1400;
    const MAX_STAGNANT_CYCLES = 35;

    // Intelligence Keywords to Flag
    const INTEL_KEYWORDS = {
        "AKEC_TONG": ["akech", "akec", "tong", "aleu", "nss", "isb", "director general"],
        "MICHAEL_WETNHIALIC": ["michael", "wetnhialic", "wetnhial"],
        "211_SENTRY": ["211", "sentry", "page", "admin", "f4", "soldiers", "pow"],
        "FIRST_FAMILY": ["kiir", "atem", "adut", "baba", "tiger", "mama ayen"],
        "AKOL_SANTO": ["akol", "santo", "areech", "arech", "warrant", "private secretary"],
        "SECURITY_OPS": ["blue house", "detention", "arrest", "gregory", "akol koor", "burhan"]
    };

    // --- 1. DOM Protection & Popup Killer ---
    const unfreezeScroll = () => {
        document.body.style.overflow = "auto";
        document.body.style.position = "static";
        document.documentElement.style.overflow = "auto";
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
            if (dialog.offsetWidth > 300) dialog.remove();
        });
        unfreezeScroll();
    };

    killPopups();

    // --- 2. Floating Forensic HUD ---
    const existingHud = document.getElementById("deng-osint-hud");
    if (existingHud) existingHud.remove();

    const hud = document.createElement("div");
    hud.id = "deng-osint-hud";
    hud.style = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999999;
        background: #090d16;
        color: #f8fafc;
        padding: 18px 22px;
        border-radius: 12px;
        border: 2px solid #0284c7;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 12px 40px rgba(0,0,0,0.85);
        min-width: 300px;
        line-height: 1.45;
    `;
    hud.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-weight:800; color:#38bdf8; font-size:14px; text-transform:uppercase; letter-spacing:0.5px;">🕵️ Profile Harvester</span>
            <span style="background:#dc2626; color:#fff; font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px;">OSINT ACTIVE</span>
        </div>
        <div style="font-size:12px; color:#cbd5e1; margin-bottom:10px;">Target: <strong style="color:#f8fafc;">${TARGET_NAME}</strong></div>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px; background:#1e293b; padding:8px 12px; border-radius:6px;">
            <div>
                <span style="font-size:11px; color:#94a3b8; display:block;">Total Posts:</span>
                <strong id="deng-count" style="color:#4ade80; font-size:20px;">0</strong>
            </div>
            <div>
                <span style="font-size:11px; color:#94a3b8; display:block;">Intel Hits:</span>
                <strong id="deng-intel-hits" style="color:#f59e0b; font-size:20px;">0</strong>
            </div>
        </div>

        <div id="deng-status" style="font-size:11.5px; color:#94a3b8; margin-bottom:12px; font-family:monospace;">Initializing scan...</div>
        
        <button id="deng-stop-btn" style="width:100%; background:#ef4444; color:white; border:none; padding:10px 14px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:13px; transition:0.2s;">
            💾 Finish & Download JSON
        </button>
    `;
    document.body.appendChild(hud);

    let userStopped = false;
    document.getElementById("deng-stop-btn").onclick = () => {
        userStopped = true;
        document.getElementById("deng-status").innerText = "Generating JSON export...";
    };

    const updateHUD = (status, count, intelHits) => {
        const s = document.getElementById("deng-status");
        const c = document.getElementById("deng-count");
        const h = document.getElementById("deng-intel-hits");
        if (s) s.innerText = status;
        if (c) c.innerText = count;
        if (h) h.innerText = intelHits;
    };

    // --- 3. Keyword Intelligence Tagging ---
    const tagKeywords = (text) => {
        if (!text) return [];
        const lower = text.toLowerCase();
        const tags = [];
        for (const [tag, kws] of Object.entries(INTEL_KEYWORDS)) {
            if (kws.some(kw => lower.includes(kw))) {
                tags.push(tag);
            }
        }
        return tags;
    };

    // --- 4. Deep DOM Scraper ---
    const sleep = (ms) => new Promise(res => setTimeout(res, ms));
    const harvestedPosts = new Map();
    let totalIntelHits = 0;

    const expandSeeMore = () => {
        const seeMoreButtons = [
            ...document.querySelectorAll('div[role="button"]'),
            ...document.querySelectorAll('span')
        ].filter(el => {
            const txt = (el.innerText || "").trim().toLowerCase();
            return (txt === "see more" || txt === "see less" || txt === "view more");
        });
        seeMoreButtons.forEach(btn => {
            try { btn.click(); } catch(e) {}
        });
    };

    const harvestVisiblePosts = () => {
        expandSeeMore();

        const postContainers = [
            ...document.querySelectorAll('div[role="article"]'),
            ...document.querySelectorAll('div[data-ad-preview="message"]'),
            ...document.querySelectorAll('div[data-ad-comet-preview="message"]')
        ];

        postContainers.forEach(container => {
            try {
                // 1. Text Extraction
                const textNodes = [
                    ...container.querySelectorAll('div[dir="auto"]'),
                    ...container.querySelectorAll('span[dir="auto"]')
                ];
                let text = "";
                textNodes.forEach(node => {
                    const t = (node.innerText || "").trim();
                    if (t && t.length > text.length && !t.includes("Share") && !t.includes("Comment")) {
                        text = t;
                    }
                });

                if (!text || text.length < 5) return;

                // 2. Date & URL Extraction
                let url = "";
                let dateStr = "Recent";
                const links = container.querySelectorAll('a[role="link"], a[href*="/posts/"], a[href*="/permalink/"], a[href*="story_fbid="]');
                for (const link of links) {
                    const href = link.href || "";
                    if (href.includes("/posts/") || href.includes("story_fbid=") || href.includes("/permalink.php")) {
                        url = href.split("?")[0];
                        dateStr = (link.innerText || "").trim() || (link.getAttribute("aria-label") || "").trim() || "Recent";
                        break;
                    }
                }

                // 3. Image/Video Extraction
                let mediaUrl = "";
                const img = container.querySelector('img[referrerpolicy="origin-when-cross-origin"], img[src*="scontent"]');
                if (img) mediaUrl = img.src;

                // 4. Intelligence Tagging
                const tags = tagKeywords(text);
                if (tags.length > 0) totalIntelHits++;

                // Unique Key (Deduplication)
                const uniqueKey = url || (text.slice(0, 100) + "_" + text.length);

                if (!harvestedPosts.has(uniqueKey)) {
                    harvestedPosts.set(uniqueKey, {
                        index: harvestedPosts.size + 1,
                        targetAccount: TARGET_NAME,
                        date: dateStr,
                        url: url,
                        text: text,
                        intelligenceTags: tags,
                        hasMedia: Boolean(mediaUrl),
                        mediaUrl: mediaUrl,
                        harvestedAt: new Date().toISOString()
                    });
                }
            } catch (err) {}
        });
    };

    // --- 5. Autonomous Scrolling Engine with Jiggle Reflow ---
    let cycles = 0;
    let stagnantCount = 0;
    let lastCount = 0;

    updateHUD("Beginning profile sweep...", 0, 0);

    while (cycles < MAX_CYCLES && !userStopped) {
        cycles++;
        killPopups();
        harvestVisiblePosts();

        const currentCount = harvestedPosts.size;
        updateHUD(`Scanning cycle ${cycles}...`, currentCount, totalIntelHits);

        if (currentCount === lastCount) {
            stagnantCount++;
            if (stagnantCount % 5 === 0) {
                // Jiggle reflow
                window.scrollBy(0, -600);
                await sleep(500);
                window.scrollBy(0, 1200);
            }
        } else {
            stagnantCount = 0;
            lastCount = currentCount;
        }

        if (stagnantCount >= MAX_STAGNANT_CYCLES) {
            console.log("%c⏹️ Feed bottom reached or no new posts loaded.", "color: #f59e0b; font-weight: bold;");
            break;
        }

        window.scrollBy(0, 1000);
        await sleep(SCROLL_DELAY_MS);
    }

    // --- 6. Export to JSON File ---
    updateHUD("Exporting intelligence dataset...", harvestedPosts.size, totalIntelHits);
    const finalData = Array.from(harvestedPosts.values());

    const blob = new Blob([JSON.stringify(finalData, null, 2)], { type: "application/json" });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = OUTPUT_FILENAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(downloadUrl);

    console.log(`%c✅ HARVEST COMPLETED: ${finalData.length} Posts Saved to ${OUTPUT_FILENAME}`, "color: #10b981; font-size: 16px; font-weight: bold;");
    if (document.getElementById("deng-status")) {
        document.getElementById("deng-status").innerText = `Complete! Downloaded ${finalData.length} posts.`;
    }
})();

