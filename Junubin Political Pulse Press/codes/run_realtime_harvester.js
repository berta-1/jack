/**
 * ==============================================================================
 * 3-PHASE REAL-TIME FACEBOOK COPY ENGINE (CONNECTS DIRECTLY TO PYTHON SERVER)
 * ==============================================================================
 * Phase 1: Automatically scrolls all the way down to load the entire timeline.
 * Phase 2: Automatically opens every "See more", comment bubble, and reply.
 * Phase 3: Performs real-time copy of all text, streams data into Python server,
 *          and copies the complete clean text to your clipboard!
 * ==============================================================================
 */

(async function () {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const SERVER_URL = "http://localhost:8765";

    // Send real-time progress update to Python server
    async function notifyPython(phase, message, count = 0) {
        try {
            await fetch(SERVER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "PROGRESS", phase, message, count })
            });
        } catch(e) {}
    }

    // Floating Live Dashboard
    const hud = document.createElement("div");
    hud.style.cssText = "position:fixed;top:16px;right:16px;z-index:9999999;width:340px;background:#0f172a;color:#f8fafc;padding:16px;border-radius:12px;border:1px solid #38bdf8;box-shadow:0 20px 25px rgba(0,0,0,0.8);font-family:sans-serif;";
    hud.innerHTML = `
        <div style="font-weight:bold;font-size:14px;color:#38bdf8;margin-bottom:8px;display:flex;justify-content:space-between;">
            <span>⚡ Python Real-Time Copy Engine</span>
            <span id="p-badge" style="background:#2563eb;color:#fff;font-size:10px;padding:2px 8px;border-radius:999px;">PHASE 1</span>
        </div>
        <div id="p-msg" style="font-size:12px;color:#cbd5e1;line-height:1.4;margin-bottom:10px;height:40px;overflow:hidden;">
            Phase 1: Scrolling down page to load entire feed...
        </div>
        <div style="background:rgba(255,255,255,0.1);height:6px;border-radius:3px;overflow:hidden;margin-bottom:12px;">
            <div id="p-bar" style="width:10%;height:100%;background:#38bdf8;transition:width 0.3s;"></div>
        </div>
        <button id="p-btn-stop" style="width:100%;padding:8px;background:#b91c1c;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:bold;cursor:pointer;">Stop & Copy Now</button>
    `;
    document.body.appendChild(hud);

    const elBadge = document.getElementById("p-badge");
    const elMsg = document.getElementById("p-msg");
    const elBar = document.getElementById("p-bar");
    let shouldAbort = false;

    document.getElementById("p-btn-stop").onclick = () => {
        shouldAbort = true;
        elMsg.innerText = "Finalizing current text...";
    };

    function setHUD(phase, text, progress, color = "#2563eb") {
        if (elBadge) { elBadge.innerText = phase; elBadge.style.background = color; }
        if (elMsg) elMsg.innerText = text;
        if (elBar) elBar.style.width = progress + "%";
        console.log(`[Engine] [${phase}] ${text}`);
    }

    // ==========================================================================
    // PHASE 1: SCROLL DOWN TO LOAD ENTIRE PAGE FEED
    // ==========================================================================
    setHUD("PHASE 1", "Scrolling down page to load all posts into DOM...", 20, "#2563eb");
    await notifyPython("PHASE 1", "Starting page scroll to load all posts...");

    let lastScrollHeight = 0;
    let idleScrolls = 0;
    let scrollPasses = 0;

    while (scrollPasses < 25 && !shouldAbort) {
        scrollPasses++;
        window.scrollBy({ top: 1200, behavior: "smooth" });
        await sleep(1800);

        const currentHeight = document.documentElement.scrollHeight;
        if (currentHeight === lastScrollHeight) {
            idleScrolls++;
            if (idleScrolls >= 3) {
                // Kick scroll
                window.scrollBy({ top: 2000, behavior: "smooth" });
                await sleep(2500);
                if (document.documentElement.scrollHeight === currentHeight) {
                    break; // Reached bottom
                }
            }
        } else {
            idleScrolls = 0;
            lastScrollHeight = currentHeight;
        }

        setHUD("PHASE 1", `Loaded page depth: ${Math.round(currentHeight)}px (Pass ${scrollPasses})`, Math.min(45, 20 + scrollPasses * 2), "#2563eb");
        await notifyPython("PHASE 1", `Loaded page depth: ${Math.round(currentHeight)}px`, scrollPasses);
    }

    // ==========================================================================
    // PHASE 2: OPEN ALL COMMENTS, REPLIES & "SEE MORE"
    // ==========================================================================
    setHUD("PHASE 2", "Opening all 'See more' text expanders...", 50, "#8b5cf6");
    await notifyPython("PHASE 2", "Expanding all 'See more' text buttons...");

    // 1. Expand all 'See more'
    const seeMoreButtons = Array.from(document.querySelectorAll("div[role='button'], span[role='button'], span[dir='auto']"));
    for (const sm of seeMoreButtons) {
        const t = (sm.innerText || "").trim().toLowerCase();
        if (t === "see more" || t === "see more…" || t === "more") {
            try { sm.click(); await sleep(150); } catch(e){}
        }
    }

    // 2. Click all comment buttons / speech bubble icons
    setHUD("PHASE 2", "Clicking comment triggers to mount comment sections...", 65, "#8b5cf6");
    await notifyPython("PHASE 2", "Opening comment sections across all posts...");

    const allButtons = Array.from(document.querySelectorAll("div[role='button'], span"));
    for (const btn of allButtons) {
        if (shouldAbort) break;
        const txt = (btn.innerText || "").trim();
        const aria = (btn.getAttribute("aria-label") || "").toLowerCase();
        // Match numbers like "11", "1", "35" or text "comment"
        if (/^\d+\s*$/.test(txt) || txt.toLowerCase().includes("comment") || aria.includes("comment")) {
            try {
                btn.scrollIntoView({ behavior: "smooth", block: "center" });
                btn.click();
                await sleep(500);
            } catch(e){}
        }
    }

    // 3. Switch "Most relevant" to "All comments"
    const dropdowns = Array.from(document.querySelectorAll("div[role='button'], span[role='button']"));
    for (const dd of dropdowns) {
        const txt = (dd.innerText || "").toLowerCase();
        if (txt.includes("most relevant") || txt.includes("top comments")) {
            try {
                dd.click();
                await sleep(400);
                const menuItems = Array.from(document.querySelectorAll("div[role='menuitem'], div[role='button'], span"));
                for (const mi of menuItems) {
                    if ((mi.innerText || "").toLowerCase().includes("all comments")) {
                        mi.click();
                        await sleep(600);
                        break;
                    }
                }
            } catch(e){}
        }
    }

    // 4. Expand "View more comments" and "View replies"
    setHUD("PHASE 2", "Recursively expanding all 'View more comments' and replies...", 80, "#f59e0b");
    await notifyPython("PHASE 2", "Recursively clicking 'View more comments' and replies...");

    for (let loop = 0; loop < 15; loop++) {
        if (shouldAbort) break;
        let clicked = false;
        const clickable = Array.from(document.querySelectorAll("div[role='button'], span[role='button'], span[dir='auto']"));
        for (const el of clickable) {
            const t = (el.innerText || "").trim().toLowerCase();
            if (
                t.includes("view more comments") ||
                t.includes("view previous comments") ||
                /view\s+\d+\s+more\s+comments/i.test(t) ||
                /view\s+\d+\s+repl(y|ies)/i.test(t) ||
                t.includes("view replies")
            ) {
                try {
                    el.click();
                    clicked = true;
                    await sleep(450);
                } catch(e){}
            }
        }
        if (!clicked) break;
    }

    // ==========================================================================
    // PHASE 3: REAL-TIME COPY & EXPORT TO PYTHON
    // ==========================================================================
    setHUD("PHASE 3", "Harvesting complete DOM and sending to Python server...", 95, "#10b981");
    await notifyPython("PHASE 3", "Extracting full structured texts...");

    const postsList = [];
    // Find all post blocks by author anchor or role
    const headers = Array.from(document.querySelectorAll("h2, h3, strong, a[role='link'] span"));
    const authorHeaders = headers.filter(h => (h.innerText || "").trim() === "Junubin Political Pulse Press");

    const processedContainers = new Set();
    for (const h of authorHeaders) {
        let card = h;
        for (let i = 0; i < 12; i++) {
            if (!card || card === document.body) break;
            if (card.offsetHeight > 120 && card.offsetHeight < 4000) {
                break;
            }
            card = card.parentElement;
        }

        if (!card || processedContainers.has(card)) continue;
        processedContainers.add(card);

        // Extract Date / Link
        let date = "";
        let url = "";
        for (const a of card.querySelectorAll("a[role='link']")) {
            const href = a.href || "";
            if ((href.includes("/posts/") || href.includes("/permalink.php") || href.includes("story_fbid=")) && !href.includes("comment_id=")) {
                url = href.split("&comment_id=")[0];
                date = a.innerText.trim() || "";
                break;
            }
        }

        // Extract Post Text
        let content = "";
        const bodyEl = card.querySelector("div[data-ad-preview='message'], div[data-ad-comet-preview='message']");
        if (bodyEl) {
            content = bodyEl.innerText.trim();
        } else {
            const candidates = Array.from(card.querySelectorAll("div[dir='auto']"));
            for (const c of candidates) {
                const t = c.innerText.trim();
                if (t.length > content.length && !t.includes("Write a comment") && !t.includes("All reactions:")) {
                    content = t;
                }
            }
        }

        // Extract Reactions & Stats
        let stats = "";
        for (const st of card.querySelectorAll("[aria-label*='reactions' i], [aria-label*='likes' i]")) {
            stats = st.getAttribute("aria-label") || "";
            break;
        }

        // Extract Comments
        const comments = [];
        const commentElements = Array.from(card.querySelectorAll("div[aria-label*='Comment by' i], ul li, div[role='article']"));
        for (const ce of commentElements) {
            const authorEl = ce.querySelector("a[role='link'] span, a[role='link'], strong");
            const author = authorEl ? authorEl.innerText.trim() : "";
            const textNodes = Array.from(ce.querySelectorAll("div[dir='auto'], span[dir='auto']"));
            let text = "";
            for (const tn of textNodes) {
                const t = tn.innerText.trim();
                if (t && t !== author && !/^(like|reply|share|\d+[mshdw]|edited)$/i.test(t)) {
                    if (t.length > text.length) text = t;
                }
            }
            const isReply = !!ce.closest("ul ul") || (ce.getAttribute("aria-label") || "").toLowerCase().includes("reply");
            if (author && text && !comments.some(c => c.author === author && c.text === text)) {
                comments.push({ author, text, isReply });
            }
        }

        if (content.length > 5) {
            postsList.push({
                author: "Junubin Political Pulse Press",
                date: date || "Recent",
                url,
                stats,
                content,
                comments
            });
        }
    }

    // Build Master Text
    let masterText = `=================================================================\n`;
    masterText += `JUNUBIN POLITICAL PULSE PRESS - FULL REAL-TIME EXTRACT\n`;
    masterText += `Harvested On: ${new Date().toLocaleString()}\n`;
    masterText += `Total Posts: ${postsList.length}\n`;
    masterText += `=================================================================\n\n`;

    postsList.forEach((p, idx) => {
        masterText += `=================================================================\n`;
        masterText += `[POST #${idx + 1}]\n`;
        masterText += `Date: ${p.date}\n`;
        if (p.url) masterText += `URL: ${p.url}\n`;
        if (p.stats) masterText += `Stats: ${p.stats}\n`;
        masterText += `-----------------------------------------------------------------\n`;
        masterText += `CONTENT:\n${p.content}\n`;
        masterText += `-----------------------------------------------------------------\n`;
        masterText += `COMMENTS (${p.comments.length}):\n`;
        p.comments.forEach((c, cIdx) => {
            const tag = c.isReply ? `[REPLY]` : `[${cIdx + 1}]`;
            masterText += `  ${tag} ${c.author}: ${c.text}\n`;
        });
        masterText += `\n\n`;
    });

    // Copy to clipboard
    try {
        await navigator.clipboard.writeText(masterText);
        console.log("📋 Copied entire master archive to clipboard!");
    } catch(e) {}

    // Transmit to Python Server
    let savedFilename = "Junubin_Realtime_Master.txt";
    try {
        const response = await fetch(SERVER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "SAVE_DATA",
                page: "Junubin Political Pulse Press",
                posts: postsList
            })
        });
        const resJson = await response.json();
        if (resJson.file) savedFilename = resJson.file;
    } catch(e) {
        console.log("[Notice] Python server not answering on 8765, downloading locally...");
        const blob = new Blob([masterText], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `Junubin_Realtime_Master_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    setHUD("COMPLETE", `Done! Captured ${postsList.length} posts. Copied to Clipboard & Saved to Downloads!`, 100, "#10b981");
    setTimeout(() => hud.remove(), 7000);
})();
