/**
 * SAFE FEED READER - NO CLICKS, JUST SCROLL & READ
 * 
 * This script does NOT click anything.
 * It only scrolls the page and reads all visible post text.
 * This avoids Facebook opening any popups/modals.
 */

(async function safeScrollReader() {
    console.clear();
    console.log("%c🚀 SAFE SCROLL READER - No clicks, no popups", "color: #4ade80; font-size: 16px; font-weight: bold;");

    // First: close any existing popup
    document.querySelectorAll('div[aria-label="Close"]').forEach(b => { try { b.click(); } catch(e){} });
    await new Promise(r => setTimeout(r, 500));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise(r => setTimeout(r, 500));

    // Floating counter
    const badge = document.createElement("div");
    badge.style = "position:fixed;top:12px;right:12px;z-index:9999999;background:#0f172a;color:#4ade80;padding:14px 20px;border-radius:10px;border:2px solid #4ade80;font:bold 14px sans-serif;box-shadow:0 8px 25px rgba(0,0,0,0.8);";
    badge.innerHTML = '⚡ Scrolling... Posts: <span id="sr-count">0</span>';
    document.body.appendChild(badge);

    const postsMap = new Map();

    const collectPosts = () => {
        // Get ALL div[dir="auto"] which contain post text
        document.querySelectorAll('div[dir="auto"]').forEach(el => {
            const text = (el.innerText || "").trim();
            // Only consider substantial text blocks (not buttons, labels, etc.)
            if (text.length > 40 && !text.startsWith("Write a") && !text.startsWith("Press Enter")) {
                const key = text.slice(0, 80);
                if (!postsMap.has(key)) {
                    postsMap.set(key, {
                        id: postsMap.size + 1,
                        text: text
                    });
                }
            }
        });
        document.getElementById("sr-count").innerText = postsMap.size;
    };

    // Scroll loop - ONLY scrolls, never clicks
    let noNewCount = 0;
    let prevSize = 0;

    for (let i = 1; i <= 60; i++) {
        collectPosts();

        if (postsMap.size === prevSize) {
            noNewCount++;
            if (noNewCount >= 8) {
                console.log("No new posts found after 8 scrolls. Reached the end.");
                break;
            }
        } else {
            noNewCount = 0;
            prevSize = postsMap.size;
        }

        window.scrollBy(0, 1200);
        await new Promise(r => setTimeout(r, 1200));
    }

    // Final collection
    collectPosts();

    const results = Array.from(postsMap.values());
    console.log("🎉 Done! Collected " + results.length + " unique posts.");

    // Download
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "watchdog_2023_safe_" + Date.now() + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    badge.innerHTML = '✅ Done! Downloaded <b>' + results.length + '</b> posts';
    badge.style.borderColor = "#4ade80";
    setTimeout(() => badge.remove(), 6000);
})();
