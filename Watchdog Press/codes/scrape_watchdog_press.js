/**
 * WATCHDOG PRESS (ID: 100092417213397) - COMPLETE FEED HARVESTER
 * 
 * INSTRUCTIONS:
 * 1. Open Google Chrome and go to: https://web.facebook.com/profile.php?id=100092417213397
 * 2. Press F12 (or Right-Click -> Inspect -> click "Console").
 * 3. Paste this entire code into the Console and press Enter.
 * 4. The script will automatically scroll to the very bottom, expand all posts,
 *    and download the full archive (JSON + TXT) to your computer.
 */

(async function harvestWatchdogAllPosts() {
    console.clear();
    console.log("%c🚀 STARTING WATCHDOG PRESS FULL POST HARVESTER...", "color: #eab308; font-size: 16px; font-weight: bold;");

    // Live Floating UI Box
    const overlay = document.createElement("div");
    overlay.style = "position: fixed; top: 20px; right: 20px; z-index: 9999999; background: #111827; color: #f3f4f6; padding: 18px 24px; border-radius: 10px; border: 2px solid #eab308; font-family: sans-serif; font-size: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); line-height: 1.5; min-width: 280px;";
    overlay.innerHTML = `
        <div style="font-weight: bold; color: #eab308; margin-bottom: 6px;">🐕 Watchdog Press Scraper</div>
        <div id="wd-status" style="margin-bottom: 10px;">Starting auto-scroll...</div>
        <div style="font-size: 12px; color: #9ca3af;">Posts Loaded: <strong id="wd-count" style="color: #38bdf8; font-size: 15px;">0</strong></div>
        <button id="wd-stop-btn" style="margin-top: 12px; width: 100%; background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">Stop & Save Now</button>
    `;
    document.body.appendChild(overlay);

    let stopRequested = false;
    document.getElementById("wd-stop-btn").addEventListener("click", () => {
        stopRequested = true;
        document.getElementById("wd-status").innerHTML = "Stopping and saving collected posts...";
    });

    const updateUI = (status, count) => {
        const sEl = document.getElementById("wd-status");
        const cEl = document.getElementById("wd-count");
        if (sEl) sEl.innerHTML = status;
        if (cEl) cEl.innerText = count;
    };

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    // Expand all 'See more' text buttons
    const expandSeeMore = () => {
        const buttons = document.querySelectorAll('div[role="button"], span[role="button"]');
        buttons.forEach(btn => {
            const t = (btn.innerText || btn.textContent || "").trim().toLowerCase();
            if (t === "see more" || t === "view more" || t === "more") {
                try { btn.click(); } catch(e) {}
            }
        });
    };

    // Auto-scroll loop
    const maxScrollAttempts = 300; // Can reach 100-300+ posts
    let lastHeight = document.body.scrollHeight;
    let noChangeCount = 0;

    for (let scroll = 1; scroll <= maxScrollAttempts; scroll++) {
        if (stopRequested) break;

        expandSeeMore();
        window.scrollTo(0, document.body.scrollHeight);

        const currentArticles = document.querySelectorAll('div[role="article"]').length;
        updateUI(`Auto-scrolling (Pass ${scroll})...<br>Fetching older posts...`, currentArticles);

        await sleep(1800);

        let newHeight = document.body.scrollHeight;
        if (newHeight === lastHeight) {
            noChangeCount++;
            if (noChangeCount >= 4) {
                console.log("Reached the very beginning of the page / no more posts loading.");
                break;
            }
        } else {
            noChangeCount = 0;
            lastHeight = newHeight;
        }
    }

    // Final expansion pass
    updateUI("Expanding all long text blocks...", document.querySelectorAll('div[role="article"]').length);
    for (let k = 0; k < 3; k++) {
        expandSeeMore();
        await sleep(500);
    }

    // Extraction Phase
    updateUI("Extracting and cleaning all post text...", "-");
    const articles = Array.from(document.querySelectorAll('div[role="article"]'));
    const captured = [];
    const seenHashes = new Set();

    articles.forEach((art, index) => {
        const clone = art.cloneNode(true);
        clone.querySelectorAll('script, style, svg').forEach(e => e.remove());

        let rawText = clone.innerText || clone.textContent || "";
        rawText = rawText.replace(/\r\n/g, "\n").trim();

        if (rawText.length < 20) return; // Skip trivial elements

        // Remove Facebook UI button words
        const lines = rawText.split("\n")
            .map(l => l.trim())
            .filter(l => l.length > 0 && !["Like", "Comment", "Share", "Send", "Write a comment...", "Public", "Follow", "Shared with Public"].includes(l));

        const cleanText = lines.join("\n");
        const hash = cleanText.slice(0, 100);
        if (seenHashes.has(hash)) return;
        seenHashes.add(hash);

        // Date detection
        const dateMatch = cleanText.match(/(\b\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\b|\b\d+[wdhms]\b)/i);
        const dateStr = dateMatch ? dateMatch[0] : "Recent";

        captured.push({
            post_index: captured.length + 1,
            estimated_date: dateStr,
            content: cleanText
        });
    });

    console.log(`✅ Successfully extracted ${captured.length} complete posts!`);

    // 1. Download as Clean JSON
    const jsonBlob = new Blob([JSON.stringify(captured, null, 2)], { type: "application/json" });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement("a");
    jsonLink.href = jsonUrl;
    jsonLink.download = `Watchdog_Press_ALL_POSTS_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(jsonLink);
    jsonLink.click();
    document.body.removeChild(jsonLink);

    // 2. Download as Formatted TXT Dossier
    let txtContent = `=================================================================\n`;
    txtContent += `WATCHDOG PRESS (ID: 100092417213397) - COMPLETE POST ARCHIVE\n`;
    txtContent += `Total Posts Captured: ${captured.length}\n`;
    txtContent += `Date Scraped: ${new Date().toLocaleString()}\n`;
    txtContent += `=================================================================\n\n`;

    captured.forEach(p => {
        txtContent += `=================================================================\n`;
        txtContent += `[POST #${p.post_index}] - (Estimated Date: ${p.estimated_date})\n`;
        txtContent += `-----------------------------------------------------------------\n`;
        txtContent += `${p.content}\n\n`;
    });

    const txtBlob = new Blob([txtContent], { type: "text/plain;charset=utf-8" });
    const txtUrl = URL.createObjectURL(txtBlob);
    const txtLink = document.createElement("a");
    txtLink.href = txtUrl;
    txtLink.download = `Watchdog_Press_ALL_POSTS_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(txtLink);
    txtLink.click();
    document.body.removeChild(txtLink);

    // Done banner
    overlay.style.borderColor = "#10b981";
    overlay.innerHTML = `
        <div style="font-weight: bold; color: #10b981; font-size: 15px;">✅ Extraction Complete!</div>
        <div style="margin-top: 6px;">Captured <strong>${captured.length} posts</strong>.</div>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">Files saved to your <strong>Downloads</strong> folder.</div>
    `;
    setTimeout(() => overlay.remove(), 10000);
})();
