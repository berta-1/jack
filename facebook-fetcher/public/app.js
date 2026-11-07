/**
 * Facebook Fetcher Pro v2.5 - Client Controller
 */

let allPosts = [];
let currentEngine = 'apify'; // 'apify' or 'local'
let currentView = 'json'; // 'json' or 'cards'
let timerInterval = null;
let secondsElapsed = 0;
let eventSource = null;

// DOM Elements
const tabApify = document.getElementById('tabApify');
const tabLocal = document.getElementById('tabLocal');
const apifyConfigPanel = document.getElementById('apifyConfigPanel');
const localConfigPanel = document.getElementById('localConfigPanel');

const targetUrlInput = document.getElementById('targetUrl');
const apifyTokenInput = document.getElementById('apifyToken');
const apifyLimitSelect = document.getElementById('apifyLimit');
const apifyOlderThanInput = document.getElementById('apifyOlderThan');
const apifyNewerThanInput = document.getElementById('apifyNewerThan');
const datePresetSelect = document.getElementById('datePresetSelect');
const customDateRangeBox = document.getElementById('customDateRangeBox');
const customStartDate = document.getElementById('customStartDate');
const customEndDate = document.getElementById('customEndDate');

const maxScrollsSelect = document.getElementById('maxScrolls');
const browserModeSelect = document.getElementById('browserMode');
const autoExpandSelect = document.getElementById('autoExpand');

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const systemStatus = document.getElementById('systemStatus');

const statPostsCount = document.getElementById('statPostsCount');
const statStatus = document.getElementById('statStatus');
const statTimer = document.getElementById('statTimer');
const statScrollProgress = document.getElementById('statScrollProgress');
const progressBar = document.getElementById('progressBar');

const logTerminal = document.getElementById('logTerminal');
const clearLogsBtn = document.getElementById('clearLogsBtn');

const resultsCount = document.getElementById('resultsCount');
const viewJsonBtn = document.getElementById('viewJsonBtn');
const viewCardsBtn = document.getElementById('viewCardsBtn');
const jsonContainer = document.getElementById('jsonContainer');
const jsonCodeView = document.getElementById('jsonCodeView');
const jsonMeta = document.getElementById('jsonMeta');
const postsFeed = document.getElementById('postsFeed');
const emptyState = document.getElementById('emptyState');

const copyJsonBtn = document.getElementById('copyJsonBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const loadSavedBtn = document.getElementById('loadSavedBtn');
const postSearchInput = document.getElementById('postSearchInput');
const filterCount = document.getElementById('filterCount');

// Load saved dataset function
async function loadSavedPosts() {
    try {
        log('Loading saved 500-post dataset from server...', 'info');
        const res = await fetch('/api/saved-posts');
        const data = await res.json();
        if (data && data.posts && Array.isArray(data.posts)) {
            allPosts = data.posts;
            displayResults(allPosts);
            log(`🎉 Loaded ${allPosts.length} harvested posts! Ready to browse and analyze.`, 'success');
            resetUI();
        }
    } catch(err) {
        // quiet fallback
    }
}

if (loadSavedBtn) {
    loadSavedBtn.addEventListener('click', loadSavedPosts);
}

// Auto-load saved posts on start
loadSavedPosts();

// Search Filter
if (postSearchInput) {
    postSearchInput.addEventListener('input', () => {
        const q = postSearchInput.value.trim().toLowerCase();
        if (!q) {
            displayResults(allPosts);
            filterCount.innerText = '';
            return;
        }
        const filtered = allPosts.filter(p => {
            const txt = (p.text || '').toLowerCase();
            const time = (p.time || '').toLowerCase();
            const id = (p.postId || '').toLowerCase();
            return txt.includes(q) || time.includes(q) || id.includes(q);
        });
        displayResults(filtered);
        filterCount.innerText = `Showing ${filtered.length} of ${allPosts.length}`;
    });
}

// Load saved token from localStorage
const savedToken = localStorage.getItem('apify_token');
if (savedToken) {
    apifyTokenInput.value = savedToken;
}

apifyTokenInput.addEventListener('input', () => {
    localStorage.setItem('apify_token', apifyTokenInput.value.trim());
});

// Engine Switcher
tabApify.addEventListener('click', () => {
    currentEngine = 'apify';
    tabApify.classList.add('active');
    tabLocal.classList.remove('active');
    apifyConfigPanel.style.display = 'block';
    localConfigPanel.style.display = 'none';
    log('Switched to Apify Cloud Engine (Full JSON with all fields).', 'info');
});

tabLocal.addEventListener('click', () => {
    currentEngine = 'local';
    tabLocal.classList.add('active');
    tabApify.classList.remove('active');
    localConfigPanel.style.display = 'block';
    apifyConfigPanel.style.display = 'none';
    log('Switched to Local Chrome Browser Engine.', 'info');
});

// Date Preset Dropdown Controller
datePresetSelect.addEventListener('change', () => {
    const val = datePresetSelect.value;
    if (val === 'custom') {
        customDateRangeBox.style.display = 'block';
        updateCustomDates();
    } else {
        customDateRangeBox.style.display = 'none';
        if (val === '2023') {
            apifyOlderThanInput.value = '2023-12-31';
            apifyNewerThanInput.value = '2023-01-01';
            log('📅 Filter Activated: 2023 Posts Only (Genesis Era & First Posts)', 'info');
        } else if (val === '2024') {
            apifyOlderThanInput.value = '2024-12-31';
            apifyNewerThanInput.value = '2024-01-01';
            log('📅 Filter Activated: 2024 Archive', 'info');
        } else if (val === '2025') {
            apifyOlderThanInput.value = '2025-12-31';
            apifyNewerThanInput.value = '2025-01-01';
            log('📅 Filter Activated: 2025 Archive', 'info');
        } else if (val === '2026') {
            apifyOlderThanInput.value = '';
            apifyNewerThanInput.value = '2026-01-01';
            log('📅 Filter Activated: 2026 Recent Year', 'info');
        } else {
            apifyOlderThanInput.value = '';
            apifyNewerThanInput.value = '';
            log('📅 Filter Cleared: All Time (Complete History)', 'info');
        }
    }
});

function updateCustomDates() {
    if (datePresetSelect.value === 'custom') {
        apifyNewerThanInput.value = customStartDate.value || '';
        apifyOlderThanInput.value = customEndDate.value || '';
        if (customStartDate.value || customEndDate.value) {
            log(`📅 Custom window: ${customStartDate.value || 'Beginning'} ➔ ${customEndDate.value || 'Today'}`, 'info');
        }
    }
}
customStartDate.addEventListener('change', updateCustomDates);
customEndDate.addEventListener('change', updateCustomDates);

// View Switcher (JSON vs Cards)
viewJsonBtn.addEventListener('click', () => {
    currentView = 'json';
    viewJsonBtn.classList.add('active');
    viewCardsBtn.classList.remove('active');
    jsonContainer.style.display = 'block';
    postsFeed.style.display = 'none';
});

viewCardsBtn.addEventListener('click', () => {
    currentView = 'cards';
    viewCardsBtn.classList.add('active');
    viewJsonBtn.classList.remove('active');
    jsonContainer.style.display = 'none';
    postsFeed.style.display = 'flex';
});

// Logger Helper
function log(msg, type = 'info') {
    const time = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = `log-line ${type}`;
    line.innerHTML = `[${time}] ${msg}`;
    logTerminal.appendChild(line);
    logTerminal.scrollTop = logTerminal.scrollHeight;
}

clearLogsBtn.addEventListener('click', () => {
    logTerminal.innerHTML = '<div class="log-line info">[System] Logs cleared.</div>';
});

// Timer Helpers
function startTimer() {
    secondsElapsed = 0;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
        const secs = String(secondsElapsed % 60).padStart(2, '0');
        statTimer.innerText = `${mins}:${secs}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// Start Fetching
startBtn.addEventListener('click', async () => {
    const url = targetUrlInput.value.trim();
    if (!url) {
        alert('Please enter a valid Facebook URL.');
        return;
    }

    if (currentEngine === 'apify' && !apifyTokenInput.value.trim()) {
        alert('Please paste your Apify API Token to run the Cloud Scraper (you can get it free from your Apify account).');
        apifyTokenInput.focus();
        return;
    }

    // Reset UI
    allPosts = [];
    jsonCodeView.innerHTML = `<code>// Harvesting in progress...</code>`;
    jsonMeta.innerText = '0 bytes';
    statPostsCount.innerText = '0';
    statScrollProgress.innerText = '0%';
    progressBar.style.width = '0%';
    resultsCount.innerText = '0';
    postsFeed.innerHTML = '';
    postsFeed.appendChild(emptyState);

    copyJsonBtn.disabled = true;
    exportJsonBtn.disabled = true;
    exportCsvBtn.disabled = true;

    startBtn.disabled = true;
    stopBtn.disabled = false;
    systemStatus.className = 'badge status-badge';
    systemStatus.innerHTML = '<span class="pulse-dot" style="background:#38bdf8;"></span> Scraping...';
    statStatus.innerText = 'Connecting...';

    startTimer();
    log(`🚀 Target: ${url} (Engine: ${currentEngine.toUpperCase()})`, 'info');

    connectSSE();

    try {
        const endpoint = currentEngine === 'apify' ? '/api/apify-fetch' : '/api/fetch';
        const payload = currentEngine === 'apify' 
            ? {
                token: apifyTokenInput.value.trim(),
                url: url,
                resultsLimit: parseInt(apifyLimitSelect.value, 10),
                onlyPostsOlderThan: apifyOlderThanInput.value.trim() || undefined,
                onlyPostsNewerThan: apifyNewerThanInput.value.trim() || undefined
            }
            : {
                url: url,
                maxScrolls: parseInt(maxScrollsSelect.value, 10),
                browserMode: browserModeSelect.value,
                autoExpand: autoExpandSelect.value === 'true'
            };

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to start job');
        log('Scrape request accepted by engine.', 'success');
    } catch (err) {
        log(`Error: ${err.message}`, 'error');
        resetUI();
    }
});

// Stop
stopBtn.addEventListener('click', async () => {
    log('⏹ Stop requested by user.', 'warn');
    statStatus.innerText = 'Stopping...';
    try { await fetch('/api/stop', { method: 'POST' }); } catch(e) {}
});

// SSE Listener
function connectSSE() {
    if (eventSource) eventSource.close();
    eventSource = new EventSource('/api/events');

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'log') {
            log(data.message, data.level || 'info');
        } else if (data.type === 'progress') {
            statPostsCount.innerText = data.postsCount;
            statScrollProgress.innerText = `${data.percent}%`;
            progressBar.style.width = `${data.percent}%`;
            statStatus.innerText = data.status || 'Harvesting...';
        } else if (data.type === 'complete') {
            allPosts = data.posts || [];
            displayResults(allPosts);
            log(`🎉 Complete! Successfully harvested ${allPosts.length} posts in pure JSON.`, 'success');
            resetUI();
            eventSource.close();
        } else if (data.type === 'error') {
            log(`Error: ${data.message}`, 'error');
            resetUI();
            eventSource.close();
        }
    };
}

function resetUI() {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    stopTimer();
    systemStatus.className = 'badge status-badge';
    systemStatus.innerHTML = '<span class="pulse-dot"></span> Ready';
    statStatus.innerText = 'Completed';

    if (allPosts.length > 0) {
        copyJsonBtn.disabled = false;
        exportJsonBtn.disabled = false;
        exportCsvBtn.disabled = false;
    }
}

// Display Results in JSON & Cards View
function displayResults(posts) {
    resultsCount.innerText = posts.length;

    // 1. JSON View
    const jsonString = JSON.stringify(posts, null, 2);
    jsonCodeView.innerText = jsonString;
    const bytes = new Blob([jsonString]).size;
    jsonMeta.innerText = `${(bytes / 1024).toFixed(1)} KB (${posts.length} objects)`;

    // 2. Cards View
    postsFeed.innerHTML = '';
    posts.forEach((post, i) => {
        const card = document.createElement('div');
        card.className = 'post-card glass-card';
        
        const postText = post.text || post.content || '(Media / No text)';
        const postDate = post.date || post.time || post.timestamp || `Post #${i + 1}`;
        const likes = post.likes !== undefined ? post.likes : (post.reactionsCount || 0);
        const eraBadge = post.era ? `<span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 1px 6px; border-radius: 4px; font-size: 11px; margin-left: 6px;">${post.era}</span>` : '';

        card.innerHTML = `
            <div class="post-header">
                <span class="post-index-badge">#${i + 1}</span>
                <span class="post-date">${postDate}</span>
                ${eraBadge}
                <span style="color:#fbbf24; font-size:11.5px; margin-left:auto;">👍 ${likes}</span>
            </div>
            <div class="post-content">${escapeHTML(postText)}</div>
        `;
        postsFeed.appendChild(card);
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Copy JSON
copyJsonBtn.addEventListener('click', () => {
    if (!allPosts.length) return;
    navigator.clipboard.writeText(JSON.stringify(allPosts, null, 2));
    log('📋 Entire JSON dataset copied to clipboard!', 'success');
});

// Download JSON
exportJsonBtn.addEventListener('click', () => {
    if (!allPosts.length) return;
    const blob = new Blob([JSON.stringify(allPosts, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `Facebook_Full_Dataset_${Date.now()}.json`);
});

// Download CSV
exportCsvBtn.addEventListener('click', () => {
    if (!allPosts.length) return;
    let csv = 'Post_Number,Date,Likes,Text,URL\n';
    allPosts.forEach((p, idx) => {
        const text = `"${(p.text || p.content || '').replace(/"/g, '""')}"`;
        const date = `"${p.date || p.timestamp || ''}"`;
        const likes = p.likes || 0;
        const url = `"${p.url || ''}"`;
        csv += `${idx + 1},${date},${likes},${text},${url}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `Facebook_Dataset_${Date.now()}.csv`);
});

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    log(`Downloaded ${filename} successfully.`, 'success');
}
