/**
 * ==============================================================================
 * FACEBOOK FLAWLESS TIMELINE SCRAPER (HEADER-ANCHOR ENGINE)
 * ==============================================================================
 * 
 * Works 100% on Facebook Page Profiles (like Junubin Political Pulse Press).
 * Instead of fragile CSS classes, it anchors directly on the page author name!
 * ==============================================================================
 */

(async function () {
    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    console.log("🚀 Starting Facebook Flawless Scraper...");

    // Find all post cards using author anchor
    function findPostCards() {
        const pageName = "Junubin Political Pulse Press";
        const candidateElements = Array.from(document.querySelectorAll("h2, h3, strong, a[role='link'] span, span[dir='auto']"));
        
        const authorHeaders = candidateElements.filter(el => {
            const txt = (el.innerText || "").trim();
            return txt === pageName && el.offsetParent !== null; // must be visible
        });

        const postCards = [];
        for (const header of authorHeaders) {
            // Traverse up to find the enclosing post card container
            let curr = header;
            let card = null;
            for (let i = 0; i < 12; i++) {
                if (!curr || curr === document.body) break;
                // Check if this container looks like a post card
                const hasPagelet = curr.getAttribute("data-pagelet");
                const hasArticle = curr.getAttribute("role") === "article";
                const isFeedChild = curr.parentElement?.getAttribute("role") === "feed";
                
                // If it has substantial height and contains the text + action row
                if (hasPagelet || hasArticle || isFeedChild || (curr.offsetHeight > 150 && curr.offsetHeight < 3500 && curr.innerText.includes("Like") && curr.innerText.includes("Comment"))) {
                    card = curr;
                    break;
                }
                curr = curr.parentElement;
            }
            if (card && !postCards.includes(card)) {
                postCards.push(card);
            }
        }
        return postCards;
    }

    // Expand "See more" text
    async function expandSeeMore(card) {
        const buttons = Array.from(card.querySelectorAll("div[role='button'], span[role='button'], span[dir='auto']"));
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

    // Expand comments
    async function expandComments(card) {
        // Click comment button / count
        const buttons = Array.from(card.querySelectorAll("div[role='button'], span[role='button']"));
        for (const b of buttons) {
            const txt = (b.innerText || "").toLowerCase();
            if (/\b\d+\s+comment/i.test(txt) || txt.includes("view comments")) {
                try {
                    b.click();
                    await sleep(800);
                    break;
                } catch (e) {}
            }
        }

        // Click "View more comments" / "View replies" up to 10 times
        let count = 0;
        while (count < 10) {
            count++;
            let clicked = false;
            const clickables = Array.from(card.querySelectorAll("div[role='button'], span[role='button'], span[dir='auto']"));
            for (const el of clickables) {
                const text = (el.innerText || "").trim().toLowerCase();
                if (text.includes("view more comments") || text.includes("view previous comments") || /view\s+\d+\s+(more\s+)?(comments|replies)/i.test(text)) {
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

    // Extract comments
    function extractComments(card) {
        const comments = [];
        const commentNodes = Array.from(card.querySelectorAll("div[aria-label*='Comment by' i], ul li, div[role='article']"));
        for (const node of commentNodes) {
            const authorEl = node.querySelector("a[role='link'] span, a[role='link'], strong");
            const author = authorEl ? authorEl.innerText.trim() : "";
            const textNodes = Array.from(node.querySelectorAll("div[dir='auto'], span[dir='auto']"));
            let text = "";
            for (const tn of textNodes) {
                const t = tn.innerText.trim();
                if (t && t !== author && !/^(like|reply|share|\d+[mshdw]|edited)$/i.test(t)) {
                    if (t.length > text.length) text = t;
                }
            }
            if (author && text && !comments.some(c => c.author === author && c.text === text)) {
                comments.push({ author, text });
            }
        }
        return comments;
    }

    // Main Run
    const cards = findPostCards();
    console.log(`🎯 Detected ${cards.length} posts on screen right now!`);

    if (cards.length === 0) {
        alert("No posts found with page name header! Make sure you are viewing the page timeline.");
        return;
    }

    const scrapedData = [];
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.style.outline = "3px solid #38bdf8";
        await sleep(500);

        // Expand
        await expandSeeMore(card);

        // Extract Date / Timestamp
        let date = "";
        let postUrl = "";
        const links = Array.from(card.querySelectorAll("a[role='link']"));
        for (const l of links) {
            const href = l.href || "";
            if ((href.includes("/posts/") || href.includes("/permalink.php") || href.includes("story_fbid=")) && !href.includes("comment_id=")) {
                postUrl = href.split("&comment_id=")[0];
                date = l.innerText.trim() || l.getAttribute("aria-label") || "";
                break;
            }
        }

        // Extract Post Text
        let postText = "";
        const bodyEl = card.querySelector("div[data-ad-preview='message'], div[data-ad-comet-preview='message']");
        if (bodyEl) {
            postText = bodyEl.innerText.trim();
        } else {
            const texts = Array.from(card.querySelectorAll("div[dir='auto']"));
            for (const t of texts) {
                const s = t.innerText.trim();
                if (s.length > postText.length && !s.includes("All reactions:") && !s.includes("Write a comment")) {
                    postText = s;
                }
            }
        }

        // Expand and extract comments
        await expandComments(card);
        const comments = extractComments(card);

        card.style.outline = "3px solid #22c55e"; // Success green
        console.log(`✅ [Post #${i + 1}] "${postText.slice(0, 40)}..." (${comments.length} comments)`);

        scrapedData.push({
            id: i + 1,
            author: "Junubin Political Pulse Press",
            date: date || "Recent",
            url: postUrl,
            content: postText,
            comments: comments
        });
    }

    // Download formatted results
    let txt = `=================================================================\n`;
    txt += `JUNUBIN POLITICAL PULSE PRESS - LIVE SCRAPED POSTS\n`;
    txt += `Total Posts: ${scrapedData.length}\n`;
    txt += `Date: ${new Date().toLocaleString()}\n`;
    txt += `=================================================================\n\n`;

    scrapedData.forEach((p, idx) => {
        txt += `=================================================================\n`;
        txt += `[POST #${idx + 1}]\n`;
        txt += `Date: ${p.date}\n`;
        if (p.url) txt += `URL: ${p.url}\n`;
        txt += `-----------------------------------------------------------------\n`;
        txt += `CONTENT:\n${p.content}\n`;
        txt += `-----------------------------------------------------------------\n`;
        txt += `COMMENTS (${p.comments.length}):\n`;
        if (p.comments.length === 0) {
            txt += `  (No comments)\n`;
        } else {
            p.comments.forEach((c, cIdx) => {
                txt += `  [${cIdx + 1}] ${c.author}: ${c.text}\n`;
            });
        }
        txt += `\n\n`;
    });

    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Junubin_Flawless_Scrape_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    alert(`🎉 Successfully scraped ${scrapedData.length} posts! File downloaded.`);
})();
