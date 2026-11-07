/**
 * ==============================================================================
 * FACEBOOK PAGE DEEP SCRAPER (POSTS + FULL TEXT + ALL COMMENTS & REPLIES)
 * ==============================================================================
 * 
 * Instructions:
 * 1. Open the Facebook Page in your browser (e.g. Chrome or Edge).
 *    Make sure you are on the main Posts timeline (NOT on &sk=followers).
 * 2. Press F12 to open Developer Tools, and switch to the "Console" tab.
 * 3. Paste this script and press Enter.
 * 4. A floating control panel will appear in the top-right corner.
 * 5. The scraper will automatically:
 *    - Locate each post on the feed
 *    - Click "See more" to expand the full post text
 *    - Click the comment trigger / count to expand all comments
 *    - Click "View more comments" & "View replies" automatically
 *    - Extract post author, date, link, full content, and all comments
 *    - Scroll down gently to load subsequent batches
 * 6. You can click "Download TXT" or "Download JSON" at ANY point!
 * ==============================================================================
 */

(async function () {
    // Prevent duplicate instances
    if (window.__FB_SUPER_SCRAPER_RUNNING) {
        alert("Scraper is already active! Check the panel in the top-right.");
        return;
    }
    window.__FB_SUPER_SCRAPER_RUNNING = true;

    // Data Storage
    const scrapedPosts = new Map();
    let totalCommentsCount = 0;
    let isPaused = false;
    let shouldStop = false;

    // Helper: Sleep
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Create On-Screen Dashboard (HUD)
    const hud = document.createElement("div");
    hud.id = "fb-scraper-hud";
    hud.innerHTML = `
        <div style="font-weight: bold; font-size: 15px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span>🚀 FB Deep Feed & Comments Scraper</span>
            <span id="fb-status-badge" style="background: #2563eb; color: #fff; font-size: 11px; padding: 2px 7px; border-radius: 999px;">Scanning</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; font-size: 13px;">
            <div style="background: rgba(255,255,255,0.08); padding: 8px; border-radius: 6px;">
                <div style="color: #94a3b8; font-size: 11px;">POSTS</div>
                <div id="fb-posts-count" style="font-size: 20px; font-weight: bold; color: #38bdf8;">0</div>
            </div>
            <div style="background: rgba(255,255,255,0.08); padding: 8px; border-radius: 6px;">
                <div style="color: #94a3b8; font-size: 11px;">COMMENTS</div>
                <div id="fb-comments-count" style="font-size: 20px; font-weight: bold; color: #4ade80;">0</div>
            </div>
        </div>
        <div id="fb-live-log" style="font-size: 11px; color: #cbd5e1; height: 38px; overflow: hidden; text-overflow: ellipsis; margin-bottom: 10px; background: rgba(0,0,0,0.3); padding: 6px; border-radius: 4px; line-height: 1.3;">
            Initializing crawler...
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button id="fb-btn-pause" style="flex: 1; padding: 7px; background: #475569; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: 600;">Pause</button>
            <button id="fb-btn-download-txt" style="flex: 1.2; padding: 7px; background: #0284c7; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: 600;">Download TXT</button>
            <button id="fb-btn-download-json" style="flex: 1.2; padding: 7px; background: #059669; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: 600;">Download JSON</button>
            <button id="fb-btn-stop" style="width: 100%; margin-top: 4px; padding: 6px; background: #dc2626; color: white; border: none; border-radius: 4px; font-size: 11px; cursor: pointer;">Stop & Finish</button>
        </div>
    `;

    Object.assign(hud.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        width: "320px",
        backgroundColor: "#0f172a",
        color: "#f8fafc",
        padding: "14px",
        borderRadius: "10px",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.7), 0 8px 10px -6px rgba(0,0,0,0.5)",
        zIndex: "999999",
        fontFamily: "system-ui, -apple-system, sans-serif",
        border: "1px solid #334155"
    });

    document.body.appendChild(hud);

    const elBadge = document.getElementById("fb-status-badge");
    const elPosts = document.getElementById("fb-posts-count");
    const elComments = document.getElementById("fb-comments-count");
    const elLog = document.getElementById("fb-live-log");
    const btnPause = document.getElementById("fb-btn-pause");
    const btnDownloadTxt = document.getElementById("fb-btn-download-txt");
    const btnDownloadJson = document.getElementById("fb-btn-download-json");
    const btnStop = document.getElementById("fb-btn-stop");

    function logMsg(msg, badge = null) {
        if (elLog) elLog.innerText = msg;
        if (badge && elBadge) {
            elBadge.innerText = badge;
            if (badge === "Paused") elBadge.style.background = "#eab308";
            else if (badge === "Done") elBadge.style.background = "#16a34a";
            else elBadge.style.background = "#2563eb";
        }
        console.log(`[FB Scraper] ${msg}`);
    }

    btnPause.onclick = () => {
        isPaused = !isPaused;
        btnPause.innerText = isPaused ? "Resume" : "Pause";
        btnPause.style.background = isPaused ? "#16a34a" : "#475569";
        logMsg(isPaused ? "Scraper paused by user." : "Scraper resumed.", isPaused ? "Paused" : "Running");
    };

    btnStop.onclick = () => {
        shouldStop = true;
        logMsg("Stopping scraper and exporting data...", "Done");
        exportTXT();
        cleanup();
    };

    btnDownloadTxt.onclick = () => exportTXT();
    btnDownloadJson.onclick = () => exportJSON();

    function cleanup() {
        window.__FB_SUPER_SCRAPER_RUNNING = false;
        setTimeout(() => hud.remove(), 4000);
    }

    // Export formats
    function exportTXT() {
        const postsArray = Array.from(scrapedPosts.values());
        let txt = `=================================================================\n`;
        txt += `FACEBOOK COMPREHENSIVE FEED & COMMENTS REPORT\n`;
        txt += `Target Page: Junubin Political Pulse Press\n`;
        txt += `Extracted On: ${new Date().toLocaleString()}\n`;
        txt += `Total Posts: ${postsArray.length} | Total Comments: ${totalCommentsCount}\n`;
        txt += `=================================================================\n\n`;

        postsArray.forEach((p, idx) => {
            txt += `=================================================================\n`;
            txt += `[POST #${idx + 1}]\n`;
            txt += `Author: ${p.author || "Unknown"}\n`;
            txt += `Date / Timestamp: ${p.timestamp || "Unknown"}\n`;
            if (p.url) txt += `Post URL: ${p.url}\n`;
            txt += `-----------------------------------------------------------------\n`;
            txt += `CONTENT:\n${p.content || "(No text content / Media only)"}\n`;
            txt += `-----------------------------------------------------------------\n`;
            txt += `COMMENTS (${p.comments.length}):\n`;
            if (p.comments.length === 0) {
                txt += `(No comments found or comments disabled)\n`;
            } else {
                p.comments.forEach((c, cIdx) => {
                    txt += `  [#${cIdx + 1}] ${c.author}: ${c.text}\n`;
                    if (c.timestamp) txt += `      Time: ${c.timestamp}\n`;
                });
            }
            txt += `\n\n`;
        });

        downloadFile(txt, `Junubin_Full_Posts_And_Comments_${Date.now()}.txt`, "text/plain");
    }

    function exportJSON() {
        const postsArray = Array.from(scrapedPosts.values());
        const data = {
            metadata: {
                page: "Junubin Political Pulse Press",
                extractedAt: new Date().toISOString(),
                totalPosts: postsArray.length,
                totalComments: totalCommentsCount
            },
            posts: postsArray
        };
        downloadFile(JSON.stringify(data, null, 2), `Junubin_Full_Posts_And_Comments_${Date.now()}.json`, "application/json");
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

    // Helper: Find all post elements in the DOM
    function findPostElements() {
        // Modern Facebook uses role="article" or data-virtualized containers
        const articles = Array.from(document.querySelectorAll('div[role="article"]'));
        
        // Filter out nested sub-articles (like comments or shared posts treated as sub-articles)
        const mainPosts = articles.filter(art => {
            // Must not be a child of another article
            const parentArticle = art.parentElement ? art.parentElement.closest('div[role="article"]') : null;
            return !parentArticle;
        });

        if (mainPosts.length > 0) return mainPosts;

        // Fallback: look for post message containers
        const msgContainers = Array.from(document.querySelectorAll('div[data-ad-preview="message"], div[dir="auto"]'));
        const distinctPosts = new Set();
        msgContainers.forEach(mc => {
            const container = mc.closest('div[role="feed"] > div') || mc.closest('div[role="article"]');
            if (container) distinctPosts.add(container);
        });
        return Array.from(distinctPosts);
    }

    // Helper: Expand "See more" buttons in a post
    async function expandSeeMore(postEl) {
        const buttons = Array.from(postEl.querySelectorAll('div[role="button"], span[role="button"]'));
        for (const btn of buttons) {
            const txt = (btn.innerText || "").trim().toLowerCase();
            if (txt === "see more" || txt === "see more…" || txt === "more") {
                try {
                    btn.click();
                    await sleep(350);
                } catch (e) {}
            }
        }
    }

    // Helper: Expand comments in a post
    async function expandComments(postEl) {
        // Look for buttons that trigger comments
        // 1. Check for "View more comments" or "View previous comments" or comment counts
        let expansionAttempts = 0;
        const maxAttempts = 15;

        // First, check if there's a comment toggle button (e.g. "X comments")
        const allButtons = Array.from(postEl.querySelectorAll('div[role="button"], span[role="button"]'));
        for (const btn of allButtons) {
            const txt = (btn.innerText || "").toLowerCase();
            if (/\b\d+\s+comment/i.test(txt) || txt.includes("view comments")) {
                try {
                    btn.click();
                    await sleep(1000);
                    break;
                } catch (e) {}
            }
        }

        // Loop to click "View more comments", "View 10 more comments", "View replies"
        while (expansionAttempts < maxAttempts && !shouldStop) {
            expansionAttempts++;
            let clickedAny = false;

            const clickable = Array.from(postEl.querySelectorAll('div[role="button"], span[role="button"], span[dir="auto"]'));
            for (const el of clickable) {
                const text = (el.innerText || "").trim().toLowerCase();
                if (
                    text.includes("view more comments") ||
                    text.includes("view previous comments") ||
                    text.includes("view all comments") ||
                    /view\s+\d+\s+(more\s+)?(comments|replies)/i.test(text) ||
                    /replies\b/i.test(text) && text.includes("view")
                ) {
                    try {
                        el.click();
                        clickedAny = true;
                        await sleep(700);
                    } catch (e) {}
                }
            }

            if (!clickedAny) break;
            await sleep(500);
        }
    }

    // Extract comment items from post container
    function extractCommentsFromPost(postEl) {
        const comments = [];
        // Facebook comments usually reside in lists or sub-nodes under the post
        // Each comment often has a distinct author link and text body
        const commentBlocks = Array.from(postEl.querySelectorAll('ul li, div[role="article"][aria-label*="Comment" i]'));

        for (const block of commentBlocks) {
            // Check author link
            const authorEl = block.querySelector('a[role="link"] span, a[role="link"]');
            const author = authorEl ? authorEl.innerText.trim() : "";

            // Find comment text
            // Text is usually in a div[dir="auto"] inside the block
            const textEls = Array.from(block.querySelectorAll('div[dir="auto"], span[dir="auto"]'));
            let commentText = "";
            for (const te of textEls) {
                const t = te.innerText.trim();
                // Exclude the author name and short metadata like "Reply", "Like", "1w", "Share"
                if (t && t !== author && !/^(like|reply|share|\d+[mshdw]|edited)$/i.test(t)) {
                    if (t.length > commentText.length) {
                        commentText = t;
                    }
                }
            }

            if (author && commentText) {
                // Deduplicate within this post
                const alreadyAdded = comments.some(c => c.author === author && c.text === commentText);
                if (!alreadyAdded) {
                    comments.push({
                        author,
                        text: commentText,
                        timestamp: ""
                    });
                }
            }
        }

        return comments;
    }

    // Extract single post details
    async function processPost(postEl) {
        // Expand full text
        await expandSeeMore(postEl);

        // Find post author
        let author = "Junubin Political Pulse Press";
        const headerLink = postEl.querySelector('h2 a, h3 a, strong span');
        if (headerLink && headerLink.innerText) {
            author = headerLink.innerText.trim();
        }

        // Find timestamp / permalink
        let timestamp = "";
        let postUrl = "";
        const timeLinks = Array.from(postEl.querySelectorAll('a[role="link"]'));
        for (const tl of timeLinks) {
            const href = tl.href || "";
            if (href.includes("/posts/") || href.includes("/permalink/") || href.includes("story_fbid=") || href.includes("/photos/")) {
                postUrl = href;
                timestamp = tl.innerText.trim() || tl.getAttribute("aria-label") || "";
                break;
            }
        }

        // Post text content
        // In Facebook, post body is in div[data-ad-preview="message"] or div[dir="auto"]
        let postBody = "";
        const bodyEl = postEl.querySelector('div[data-ad-preview="message"]');
        if (bodyEl) {
            postBody = bodyEl.innerText.trim();
        } else {
            // Find all text blocks in the post preceding comment section
            const textNodes = Array.from(postEl.querySelectorAll('div[dir="auto"]'));
            // Take the largest substantial text node before the comments
            for (const tn of textNodes) {
                const txt = tn.innerText.trim();
                if (txt.length > postBody.length && !txt.includes("All reactions:") && !txt.includes("Comment")) {
                    postBody = txt;
                }
            }
        }

        // Unique identifier for the post
        const uniqueKey = postUrl || (author + "_" + postBody.slice(0, 80));
        if (!uniqueKey || postBody.length < 5) return null;

        if (scrapedPosts.has(uniqueKey)) {
            return null; // Already processed
        }

        // Expand & collect comments
        logMsg(`Reading comments for post by ${author.slice(0, 15)}...`, "Expanding");
        await expandComments(postEl);
        const comments = extractCommentsFromPost(postEl);

        totalCommentsCount += comments.length;
        if (elComments) elComments.innerText = totalCommentsCount;

        const postRecord = {
            id: uniqueKey,
            author,
            timestamp,
            url: postUrl,
            content: postBody,
            comments: comments
        };

        scrapedPosts.set(uniqueKey, postRecord);
        if (elPosts) elPosts.innerText = scrapedPosts.size;
        logMsg(`Captured post #${scrapedPosts.size} (${comments.length} comments)`, "Running");

        return postRecord;
    }

    // Main Crawler Loop
    logMsg("Starting crawl loop...", "Running");
    let noNewContentCount = 0;
    let lastScrollHeight = 0;

    while (!shouldStop) {
        // Check pause state
        while (isPaused && !shouldStop) {
            await sleep(500);
        }
        if (shouldStop) break;

        const posts = findPostElements();
        let newFound = 0;

        for (const postEl of posts) {
            if (shouldStop) break;
            while (isPaused && !shouldStop) await sleep(500);

            // Scroll the post into view smoothly so Facebook loads its resources
            postEl.scrollIntoView({ behavior: "smooth", block: "center" });
            await sleep(400);

            const result = await processPost(postEl);
            if (result) newFound++;
        }

        // Scroll down to load next batch
        logMsg("Scrolling down for more posts...", "Scrolling");
        window.scrollBy({ top: 900, behavior: "smooth" });
        await sleep(2500); // Wait for Facebook GraphQL request

        // Check if reached bottom of feed
        const currentScrollHeight = document.documentElement.scrollHeight;
        if (currentScrollHeight === lastScrollHeight && newFound === 0) {
            noNewContentCount++;
            if (noNewContentCount >= 4) {
                // Try one large scroll
                window.scrollBy({ top: 1800, behavior: "smooth" });
                await sleep(3500);
                if (document.documentElement.scrollHeight === lastScrollHeight) {
                    logMsg("Reached bottom of feed or all posts loaded!", "Done");
                    break;
                }
            }
        } else {
            noNewContentCount = 0;
            lastScrollHeight = currentScrollHeight;
        }
    }

    logMsg(`Finished! Captured ${scrapedPosts.size} posts & ${totalCommentsCount} comments.`, "Done");
    exportTXT();
    cleanup();
})();
