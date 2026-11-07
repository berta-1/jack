import json

p500 = json.load(open(r'c:\Tahir\Mission-1.0\Watchdog Press\WATCHDOG_PRESS_500_POSTS.json', encoding='utf-8'))
p2023 = json.load(open(r'c:\Tahir\Mission-1.0\Watchdog Press\WATCHDOG_PRESS_COMPLETE_2023_2024_POSTS.json', encoding='utf-8'))

master = []

# Process 2023-2024 posts
for p in p2023:
    pid = p.get('id', 0)
    master.append({
        'id': f'archive_{pid}',
        'postId': str(pid),
        'era': '2023-2024 Archive',
        'time': p.get('date') or p.get('detected_date') or '2023',
        'date': p.get('date') or p.get('detected_date') or '2023',
        'url': p.get('url', ''),
        'facebookUrl': p.get('url', ''),
        'text': p.get('text', ''),
        'character_count': p.get('character_count', len(p.get('text', ''))),
        'image': p.get('image', ''),
        'likes': 0,
        'comments': 0,
        'source': 'DOM Feed Harvest (Cleaned)'
    })

# Process 500 recent posts
for i, p in enumerate(p500, 1):
    pid = p.get('postId', str(i))
    thumb = ''
    if p.get('media') and len(p['media']) > 0:
        thumb = p['media'][0].get('thumbnail', '')
    if not thumb:
        thumb = p.get('thumbnail', '')

    master.append({
        'id': f'recent_{pid}',
        'postId': str(pid),
        'era': '2026 Recent',
        'time': p.get('time', '2026'),
        'date': p.get('time', '2026'),
        'url': p.get('url') or p.get('facebookUrl', ''),
        'facebookUrl': p.get('facebookUrl') or p.get('url', ''),
        'text': p.get('text', ''),
        'character_count': len(p.get('text', '')),
        'image': thumb,
        'likes': p.get('likes', 0),
        'comments': p.get('comments', 0),
        'shares': p.get('shares', 0),
        'source': 'Cloud API Extraction'
    })

master_path = r'c:\Tahir\Mission-1.0\Watchdog Press\WATCHDOG_PRESS_MASTER_ARCHIVE_ALL_POSTS.json'
with open(master_path, 'w', encoding='utf-8') as f:
    json.dump(master, f, indent=2, ensure_ascii=False)

print(f'Master archive created with {len(master)} total posts!')
print(f'Saved to: {master_path}')
