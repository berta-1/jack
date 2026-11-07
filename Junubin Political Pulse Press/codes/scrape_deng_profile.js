/**
 * DENG GARANG AJOU PROFILE HARVESTER
 * Run directly in Chrome Console (F12) while viewing:
 * https://web.facebook.com/deng.garang.ajou.907626
 */

(async function harvestDengProfile() {
    console.clear();
    console.log("%c🚀 STARTING DENG GARANG AJOU PROFILE TEXT HARVESTER...", "color: #38bdf8; font-size: 16px; font-weight: bold;");

    // UI Indicator overlay
    const overlay = document.createElement("div");
    overlay.style = "position: fixed; top: 15px; right: 15px; z-index: 999999; background: #0f172a; color: #38bdf8; padding: 14px 20px; border-radius: 8px; border: 2px solid #38bdf8; font-family: monospace; font-size: 13px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);";
    overlay.innerHTML = "🔍 <strong>Scraping Profile Posts...</strong><br><span id='scrape-status'>Expanding text & scrolling...</span>";
    document.body.appendChild(overlay);

    const updateStatus = (txt) => {
        const el = document.getElementById("scrape-status");
        if (el) el.innerHTML = txt;
    };

    // Helper sleep
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    // 1. Expand all 'See more' buttons currently on page
    const expandAllSeeMore = () => {
        let count = 0;
        const clickables = document.querySelectorAll('div[role="button"], span[role="button"]');
        clickables.forEach(btn => {
            const text = (btn.innerText || btn.textContent || "").trim().toLowerCase();
            if (text === "see more" || text === "view more" || text === "more") {
                try {
                    btn.click();
                    count++;
                } catch(e) {}
            }
        });
        return count;
    };

    // 2. Scroll and harvest posts
    const maxScrolls = 40; // Adjust if more posts needed
    let lastHeight = document.body.scrollHeight;
    let noChangeCount = 0;

    console.log("📜 Scrolling down to load full post history...");

    for (let i = 1; i <= maxScrolls; i++) {
        expandAllSeeMore();
        window.scrollTo(0, document.body.scrollHeight);
        updateStatus(`Scrolling page (${i}/${maxScrolls})...<br>Loading feed...`);
        await sleep(1500);

        let newHeight = document.body.scrollHeight;
        if (newHeight === lastHeight) {
            noChangeCount++;
            if (noChangeCount >= 3) {
                console.log("Reached end of profile feed or no more new content loading.");
                break;
            }
        } else {
            noChangeCount = 0;
            lastHeight = newHeight;
        }
    }

    // Final expansion pass
    updateStatus("Expanding all truncated text blocks...");
    for (let k = 0; k < 3; k++) {
        expandAllSeeMore();
        await sleep(500);
    }

    // 3. Extract Bio and Profile Details
    updateStatus("Extracting profile metadata & bio...");
    let profileBio = "";
    const introEl = document.querySelector('div[data-pagelet="ProfileTilesFeed_0"]') || document.querySelector('div[role="main"]');
    if (introEl) {
        const introTexts = Array.from(introEl.querySelectorAll('span, div'))
            .map(e => e.innerText ? e.innerText.trim() : "")
            .filter(t => t.length > 5 && (t.includes("Nkumba") || t.includes("journalist") || t.includes("followers") || t.includes("Aweil") || t.includes("Kampala")));
        profileBio = Array.from(new Set(introTexts)).join("\n");
    }

    // 4. Extract Posts
    updateStatus("Parsing individual posts & text content...");
    const articles = Array.from(document.querySelectorAll('div[role="article"]'));
    const capturedPosts = [];
    const seenTexts = new Set();

    articles.forEach((art, idx) => {
        // Clone to avoid DOM damage
        const clone = art.cloneNode(true);

        // Remove hidden and script junk
        clone.querySelectorAll('script, style, svg').forEach(e => e.remove());

        // Extract full raw text
        let fullText = clone.innerText || clone.textContent || "";
        fullText = fullText.replace(/\r\n/g, "\n").trim();

        // Skip non-post micro snippets (like comment boxes)
        if (fullText.length < 15) return;

        // Extract clean lines
        const lines = fullText.split("\n")
            .map(l => l.trim())
            .filter(l => l.length > 0 && !["Like", "Comment", "Share", "Send", "Write a comment...", "Public"].includes(l));

        const cleanContent = lines.join("\n");

        // Hash / Deduplication
        const hash = cleanContent.slice(0, 80);
        if (seenTexts.has(hash)) return;
        seenTexts.add(hash);

        // Try extracting timestamp
        let dateGuess = "Unknown Date";
        const dateMatch = cleanContent.match(/(\b\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\b|\b\d+[wdhms]\b)/i);
        if (dateMatch) dateGuess = dateMatch[0];

        capturedPosts.push({
            id: capturedPosts.length + 1,
            date: dateGuess,
            text: cleanContent
        });
    });

    console.log(`✅ Extracted ${capturedPosts.length} unique posts from Deng Garang Ajou's profile!`);
    updateStatus(`🎉 Complete! Extracted ${capturedPosts.length} posts.<br>Generating download file...`);

    // 5. Construct Report Output
    let report = "=================================================================\n";
    report += "DENG GARANG AJOU (@deng.garang.ajou.907626) - FULL PROFILE ARCHIVE\n";
    report += `Extraction Date: ${new Date().toLocaleString()}\n`;
    report += `Target Profile URL: ${window.location.href}\n`;
    report += `Total Posts Captured: ${capturedPosts.length}\n`;
    report += "=================================================================\n\n";

    if (profileBio) {
        report += "-----------------------------------------------------------------\n";
        report += "PROFILE INTRO / BIO DETAILS:\n";
        report += "-----------------------------------------------------------------\n";
        report += profileBio + "\n\n";
    }

    capturedPosts.forEach(p => {
        report += "=================================================================\n";
        report += `[POST #${p.id}] (Timestamp / Reference: ${p.date})\n`;
        report += "-----------------------------------------------------------------\n";
        report += p.text + "\n\n";
    });

    // 6. Automatically trigger file download
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Deng_Garang_Ajou_Full_Profile_Posts_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Also copy to clipboard for quick access
    try {
        await navigator.clipboard.writeText(report);
        console.log("📋 Full text also copied to clipboard!");
    } catch(e) {}

    overlay.style.borderColor = "#10b981";
    overlay.innerHTML = `✅ <strong>Extraction Finished!</strong><br>${capturedPosts.length} posts saved to Downloads.`;
    setTimeout(() => overlay.remove(), 7000);

})();
