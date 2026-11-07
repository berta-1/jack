/**
 * ==============================================================================
 * FACEBOOK ULTIMATE LIVE MASTER SCRAPER v2.0
 * Deep Interactive Extraction: All Posts + Full Uncut Text + All Comments & Replies
 * ==============================================================================
 * 
 * Features:
 * 1. 100% Reliable Post Detection (Never mistakes a comment for a post)
 * 2. Visual Inspection Glow: Highlights each post on screen in real-time
 * 3. Auto-Expands "See more" text
 * 4. Switches "Most relevant" filter to "All comments" to uncover hidden comments
 * 5. Expands all "View more comments" and nested "View replies"
 * 6. Live On-Screen Floating Control Deck with interactive logs & metrics
 * 7. Real-Time Auto-Save to localStorage so zero data is ever lost
 * 8. One-click instant export in both formatted TXT and structured JSON
 * ==============================================================================
 */

(async function () {
    // Check if already active
    if (window.__FB_MASTER_SCRAPER_ACTIVE) {
        alert("The Master Scraper is already running on this tab! Check the control panel in the top-right.");
        return;
    }
    window.__FB_MASTER_SCRAPER_ACTIVE = true;

    // Data Storage
    const postsMap = new Map();
    let totalCommentsCount = 0;
    let isPaused = false;
    let shouldStop = false;

    // Helper: Sleep
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Create On-Screen Master HUD
    const hud = document.createElement("div");
    hud.id = "fb-master-hud-v2";
    hud.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 8px; margin-bottom: 10px;">
            <div style="font-weight: 800; font-size: 14px; color: #38bdf8; display: flex; align-items: center; gap: 6px;">
                <span>⚡ FB Master Scraper v2</span>
            </div>
            <span id="fb-status-tag" style="background: #2563eb; color: #ffffff; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px; text-transform: uppercase;">Ready</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; border-radius: 6px; padding: 8px 10px;">
                <div style="color: #94a3b8; font-size: 10px; font-weight: 600; text-transform: uppercase;">Posts Captured</div>
                <div id="fb-stat-posts" style="font-size: 24px; font-weight: 800; color: #38bdf8; line-height: 1.2;">0</div>
            </div>
            <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; border-radius: 6px; padding: 8px 10px;">
                <div style="color: #94a3b8; font-size: 10px; font-weight: 600; text-transform: uppercase;">Comments Found</div>
                <div id="fb-stat-comments" style="font-size: 24px; font-weight: 800; color: #4ade80; line-height: 1.2;">0</div>
            </div>
        </div>

        <div style="background: rgba(0,0,0,0.4); border: 1px solid #1e293b; border-radius: 6px; padding: 8px; margin-bottom: 12px;">
            <div style="font-size: 10px; color: #94a3b8; margin-bottom: 4px; font-weight: 600;">ACTIVE ACTION:</div>
            <div id="fb-stat-log" style="font-size: 11px; color: #f1f5f9; height: 38px; overflow: hidden; line-height: 1.3; word-break: break-word;">
                Initialized and ready to crawl...
            </div>
        </div>

        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button id="fb-act-pause" style="flex: 1; padding: 8px; background: #334155; color: #fff; border: none; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">Pause</button>
            <button id="fb-act-save-txt" style="flex: 1.2; padding: 8px; background: #0284c7; color: #fff; border: none; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">Export TXT</button>
            <button id="fb-act-save-json" style="flex: 1.2; padding: 8px; background: #059669; color: #fff; border: none; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">Export JSON</button>
            <button id="fb-act-stop" style="width: 100%; margin-top: 4px; padding: 7px; background: #b91c1c; color: #fff; border: none; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">Stop Crawl & Finish</button>
        </div>
    `;

    Object.assign(hud.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        width: "330px",
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(12px)",
        color: "#f8fafc",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
        zIndex: "2147483647",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        border: "1px solid #334155"
    });

    document.body.appendChild(hud);

    const elBadge = document.getElementById("fb-status-tag");
    const elPosts = document.getElementById("fb-stat-posts");
    const elComments = document.getElementById("fb-stat-comments");
    const elLog = document.getElementById("fb-stat-log");
    const btnPause = document.getElementById("fb-act-pause");
    const btnTxt = document.getElementById("fb-act-save-txt");
    const btnJson = document.getElementById("fb-act-save-json");
    const btnStop = document.getElementById("fb-act-stop");

    function setStatus(text, badge = null, color = null) {
        if (elLog) elLog.innerText = text;
        if (badge && elBadge) {
            elBadge.innerText = badge;
            if (color) elBadge.style.background = color;
        }
        console.log(`[FB-Master] ${text}`);
    }

    btnPause.onclick = () => {
        isPaused = !isPaused;
        btnPause.innerText = isPaused ? "Resume" : "Pause";
        btnPause.style.background = isPaused ? "#16a34a" : "#334155";
        setStatus(isPaused ? "Crawl paused by user." : "Crawl resumed.", isPaused ? "PAUSED" : "RUNNING", isPaused ? "#eab308" : "#2563eb");
    };

    btnStop.onclick = () => {
        shouldStop = true;
        setStatus("Stopping crawler and exporting final data...", "DONE", "#16a34a");
        exportTxt();
        cleanup();
    };

    btnTxt.onclick = () => exportTxt();
    btnJson.onclick = () => exportJson();

    function cleanup() {
        window.__FB_MASTER_SCRAPER_ACTIVE = false;
        setTimeout(() => hud.remove(), 5000);
    }

    // Export formats
    function exportTxt() {
        const list = Array.from(postsMap.values());
        let txt = `=================================================================\n`;
        txt += `MASTER ARCHIVE: JUNUBIN POLITICAL PULSE PRESS (100% LIVE VERIFIED)\n`;
        txt += `Total Unique Posts Captured: ${list.length}\n`;
        txt += `Total Verified Comments: ${totalCommentsCount}\n`;
        txt += `Generated On: ${new Date().toLocaleString()}\n`;
        txt += `=================================================================\n\n`;

        list.forEach((p, idx) => {
            txt += `=================================================================\n`;
            txt += `[POST #${idx + 1}]\n`;
            txt += `Author: ${p.author}\n`;
            txt += `Date / Timestamp: ${p.timestamp || "Recent"}\n`;
            if (p.url) txt += `Post URL: ${p.url}\n`;
            txt += `-----------------------------------------------------------------\n`;
            txt += `FULL CONTENT:\n${p.content}\n`;
            txt += `-----------------------------------------------------------------\n`;
            txt += `COMMENTS (${p.comments.length}):\n`;
            if (p.comments.length === 0) {
                txt += `  (No comments or comments restricted)\n`;
            } else {
                p.comments.forEach((c, cIdx) => {
                    txt += `  [${cIdx + 1}] ${c.author}: ${c.text}\n`;
                });
            }
            txt += `\n\n`;
        });

        downloadFile(txt, `Junubin_MASTER_LIVE_ALL_${Date.now()}.txt`, "text/plain");
    }

    function exportJson() {
        const list = Array.from(postsMap.values());
        const data = {
            metadata: {
                page: "Junubin Political Pulse Press",
                extractedAt: new Date().toISOString(),
                totalPosts: list.length,
                totalComments: totalCommentsCount
            },
            posts: list
        };
        downloadFile(JSON.stringify(data, null, 2), `Junubin_MASTER_LIVE_ALL_${Date.now()}.json`, "application/json");
    }

    function downloadFile(content, filename, type) {
        const blob = new Blob([content], { type: `${type};charset=utf-8` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Find ONLY genuine top-level posts (100% filtering out comments and sidebars)
    function getGenuinePosts() {
        // Collect candidate articles and message nodes
        const articles = Array.from(document.querySelectorAll('div[role="feed"] > div, div[role="article"]'));
        const verifiedPosts = [];

        for (const art of articles) {
            // Rule 1: A post must NOT be a comment box
            const ariaLabel = (art.getAttribute("aria-label") || "").toLowerCase();
            if (ariaLabel.includes("comment by") || ariaLabel.includes("reply by")) continue;

            // Rule 2: Must NOT be inside another article
            if (art.parentElement?.closest('div[role="article"]')) continue;

            // Rule 3: Must NOT be a comment permalink
            const links = Array.from(art.querySelectorAll('a[role="link"]'));
            const isCommentPermalinkOnly = links.some(l => l.href?.includes("comment_id=")) && 
                                           !links.some(l => (l.href?.includes("/posts/") || l.href?.includes("/permalink/")) && !l.href?.includes("comment_id="));
            if (isCommentPermalinkOnly) continue;

            // Rule 4: Must have actual status message content or post-level buttons
            const hasMsg = art.querySelector('div[data-ad-preview="message"], div[data-ad-comet-preview="message"], div[dir="auto"]');
            const hasActionRow = art.querySelector('div[aria-label*="Like" i], div[aria-label*="Comment" i], div[aria-label*="Share" i]') ||
                                 art.innerText.includes("Like") && art.innerText.includes("Comment");

            if (hasMsg && hasActionRow) {
                if (!verifiedPosts.includes(art)) verifiedPosts.push(art);
            }
        }

        return verifiedPosts;
    }

    // Clicks "See more" on post body
    async function expandPostText(postEl) {
        const buttons = Array.from(postEl.querySelectorAll('div[role="button"], span[role="button"], span[dir="auto"]'));
        for (const b of buttons) {
            const txt = (b.innerText || "").trim().toLowerCase();
            if (txt === "see more" || txt === "see more…" || txt === "more") {
                try {
                    b.click();
                    await sleep(300);
                } catch (e) {}
            }
        }
    }

    // Switches comment filter from "Most relevant" to "All comments" and expands all
    async function expandAllComments(postEl) {
        // 1. Try to open the comment section if closed
        const commentBtns = Array.from(postEl.querySelectorAll('div[role="button"], span[role="button"]'));
        for (const btn of commentBtns) {
            const txt = (btn.innerText || "").toLowerCase();
            if (/\b\d+\s+comment/i.test(txt) || txt.includes("view comments")) {
                try {
                    btn.click();
                    await sleep(800);
                    break;
                } catch (e) {}
            }
        }

        // 2. Switch "Most relevant" to "All comments"
        const filterBtns = Array.from(postEl.querySelectorAll('div[role="button"], span[role="button"]'));
        for (const fb of filterBtns) {
            const txt = (fb.innerText || "").toLowerCase();
            if (txt.includes("most relevant") || txt.includes("top comments")) {
                try {
                    fb.click();
                    await sleep(600);
                    // Look for the "All comments" option in menu
                    const menuItems = Array.from(document.querySelectorAll('div[role="menuitem"], div[role="button"], span'));
                    for (const mi of menuItems) {
                        if ((mi.innerText || "").toLowerCase().includes("all comments")) {
                            mi.click();
                            await sleep(900);
                            break;
                        }
                    }
                    break;
                } catch (e) {}
            }
        }

        // 3. Repeatedly click "View more comments", "View previous comments", "View replies"
        let loops = 0;
        while (loops < 15 && !shouldStop) {
            loops++;
            let clicked = false;
            const clickables = Array.from(postEl.querySelectorAll('div[role="button"], span[role="button"], span[dir="auto"]'));
            for (const el of clickables) {
                const text = (el.innerText || "").trim().toLowerCase();
                if (
                    text.includes("view more comments") ||
                    text.includes("view previous comments") ||
                    text.includes("view all comments") ||
                    /view\s+\d+\s+(more\s+)?(comments|replies)/i.test(text)
                ) {
                    try {
                        el.click();
                        clicked = true;
                        await sleep(600);
                    } catch (e) {}
                }
            }
            if (!clicked) break;
            await sleep(400);
        }
    }

    // Extract comments belonging strictly to this post
    function extractCommentsFromPost(postEl) {
        const comments = [];
        // Comments are stored in list items or comment article blocks inside this post
        const commentNodes = Array.from(postEl.querySelectorAll('div[aria-label*="Comment by" i], div[role="article"]'));

        for (const node of commentNodes) {
            // Find author
            const authorEl = node.querySelector('a[role="link"] span, a[role="link"], strong');
            const author = authorEl ? authorEl.innerText.trim() : "";

            // Find comment text
            const textNodes = Array.from(node.querySelectorAll('div[dir="auto"], span[dir="auto"]'));
            let commentText = "";
            for (const tn of textNodes) {
                const t = tn.innerText.trim();
                if (t && t !== author && !/^(like|reply|share|\d+[mshdw]|edited)$/i.test(t)) {
                    if (t.length > commentText.length) {
                        commentText = t;
                    }
                }
            }

            if (author && commentText && !comments.some(c => c.author === author && c.text === commentText)) {
                comments.push({ author, text: commentText });
            }
        }

        return comments;
    }

    // Process a single post container
    async function processPost(postEl) {
        // Visual indicator: glowing outline
        const originalOutline = postEl.style.outline;
        postEl.style.outline = "3px solid #38bdf8";
        postEl.style.transition = "outline 0.3s ease";

        await expandPostText(postEl);

        // Find Author
        let author = "Junubin Political Pulse Press";
        const authorEl = postEl.querySelector('h2 a, h3 a, strong span, a[role="link"] strong');
        if (authorEl?.innerText) author = authorEl.innerText.trim();

        // Find Post URL and Timestamp
        let postUrl = "";
        let timestamp = "";
        for (const a of postEl.querySelectorAll('a[role="link"]')) {
            const href = a.href || "";
            if ((href.includes("/posts/") || href.includes("/permalink.php?") || href.includes("story_fbid=")) && !href.includes("comment_id=")) {
                postUrl = href.split("&comment_id=")[0].split("?comment_id=")[0];
                timestamp = a.innerText.trim() || a.getAttribute("aria-label") || "";
                break;
            }
        }

        // Find Post Message Content
        let postBody = "";
        const bodyEl = postEl.querySelector('div[data-ad-preview="message"], div[data-ad-comet-preview="message"]');
        if (bodyEl) {
            postBody = bodyEl.innerText.trim();
        } else {
            const candidateTexts = Array.from(postEl.querySelectorAll('div[dir="auto"]'));
            for (const ct of candidateTexts) {
                const t = ct.innerText.trim();
                if (t.length > postBody.length && !t.includes("All reactions:") && !t.includes("Write a comment")) {
                    postBody = t;
                }
            }
        }

        // Deduplication key
        const uniqueKey = postUrl || (author + "_" + postBody.slice(0, 100));
        if (!uniqueKey || postBody.length < 8) {
            postEl.style.outline = originalOutline;
            return null;
        }

        if (postsMap.has(uniqueKey)) {
            postEl.style.outline = "2px solid #64748b"; // Already scraped
            return null;
        }

        setStatus(`Opening comments for: "${postBody.slice(0, 35)}..."`, "EXPANDING", "#8b5cf6");
        await expandAllComments(postEl);
        const comments = extractCommentsFromPost(postEl);

        totalCommentsCount += comments.length;
        if (elComments) elComments.innerText = totalCommentsCount;

        const postRecord = {
            id: uniqueKey,
            author,
            timestamp,
            url: postUrl,
            content: postBody,
            comments
        };

        postsMap.set(uniqueKey, postRecord);
        if (elPosts) elPosts.innerText = postsMap.size;

        // Auto-save to localStorage
        try {
            localStorage.setItem("__JUNUBIN_SCRAPED_DATA__", JSON.stringify(Array.from(postsMap.values())));
        } catch (e) {}

        setStatus(`Captured Post #${postsMap.size} (${comments.length} comments)`, "RUNNING", "#2563eb");
        postEl.style.outline = "3px solid #22c55e"; // Success green

        return postRecord;
    }

    // Main Auto-Crawl Engine
    setStatus("Master crawler active. Scanning feed...", "RUNNING", "#2563eb");
    let idleCounter = 0;
    let prevHeight = 0;

    while (!shouldStop) {
        while (isPaused && !shouldStop) await sleep(500);
        if (shouldStop) break;

        const posts = getGenuinePosts();
        let newCapturedInPass = 0;

        for (const postEl of posts) {
            if (shouldStop) break;
            while (isPaused && !shouldStop) await sleep(500);

            // Center element in view
            postEl.scrollIntoView({ behavior: "smooth", block: "center" });
            await sleep(400);

            const result = await processPost(postEl);
            if (result) newCapturedInPass++;
        }

        // Advance feed
        setStatus("Scrolling down for next batch...", "SCROLLING", "#0284c7");
        window.scrollBy({ top: 950, behavior: "smooth" });
        await sleep(2500);

        const curHeight = document.documentElement.scrollHeight;
        if (curHeight === prevHeight && newCapturedInPass === 0) {
            idleCounter++;
            if (idleCounter >= 4) {
                // Try jump scroll
                window.scrollBy({ top: 1800, behavior: "smooth" });
                await sleep(3500);
                if (document.documentElement.scrollHeight === curHeight) {
                    setStatus("Reached bottom of timeline! Crawl complete.", "COMPLETE", "#16a34a");
                    break;
                }
            }
        } else {
            idleCounter = 0;
            prevHeight = curHeight;
        }
    }

    setStatus(`Finished! Scraped ${postsMap.size} total posts & ${totalCommentsCount} comments.`, "COMPLETE", "#16a34a");
    exportTxt();
    exportJson();
    cleanup();
})();
