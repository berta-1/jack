/**
 * 1-CLICK HARVESTER FOR 2023 POSTS
 * 
 * Instructions:
 * 1. In your Facebook tab on Watchdog Press (https://web.facebook.com/profile.php?id=100092417213397)
 * 2. Click the "Filters" button above the posts and select Year: 2023 -> Click "Done"
 * 3. Press F12 -> Go to "Console"
 * 4. Paste this code and press Enter
 */

(async function harvest2023Posts() {
    console.log("🚀 Starting 2023 Post Collector...");

    // Auto expand all "See more" buttons
    const expandText = () => {
        document.querySelectorAll('div[role="button"], span[role="button"]').forEach(btn => {
            const txt = (btn.innerText || "").trim().toLowerCase();
            if (txt === "see more" || txt === "view more" || txt === "more") {
                try { btn.click(); } catch(e) {}
            }
        });
    };

    // Scroll 10 times to load all 2023 posts
    for (let i = 0; i < 12; i++) {
        expandText();
        window.scrollBy(0, 1500);
        await new Promise(r => setTimeout(r, 1000));
    }
    expandText();

    // Collect all posts
    const collected = [];
    const feedItems = document.querySelectorAll('div[role="feed"] > div, div[data-pagelet*="FeedUnit"]');

    feedItems.forEach((unit, idx) => {
        // extract text
        const textEl = unit.querySelector('div[data-ad-preview="message"], div[dir="auto"]');
        const text = textEl ? textEl.innerText.trim() : "";

        // extract date/link
        const linkEl = unit.querySelector('a[href*="/posts/"], a[href*="story_fbid="], a[href*="/permalink/"]');
        const link = linkEl ? linkEl.href : "";
        const dateText = linkEl ? linkEl.innerText : "";

        // extract image
        const imgEl = unit.querySelector('img[src*="fbcdn"]');
        const img = imgEl ? imgEl.src : "";

        if (text.length > 20) {
            collected.push({
                index: collected.length + 1,
                date: dateText,
                url: link,
                text: text,
                image: img
            });
        }
    });

    console.log(`🎉 Collected ${collected.length} posts from 2023!`);

    // Download JSON
    const blob = new Blob([JSON.stringify(collected, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `watchdog_press_2023_posts_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    alert(`Success! Downloaded ${collected.length} posts from 2023.`);
})();
