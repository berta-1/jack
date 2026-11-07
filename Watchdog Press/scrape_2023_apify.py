import sys
import json
import time
import urllib.request
import urllib.error

def fetch_2023(token):
    if not token or not token.startswith('apify_api_'):
        print("Error: Invalid Apify API token format.")
        return

    actor_id = 'apify~facebook-posts-scraper'
    start_url = f'https://api.apify.com/v2/acts/{actor_id}/runs?token={token}'
    target_page = 'https://web.facebook.com/profile.php?id=100092417213397'

    payload = {
        "startUrls": [{"url": target_page}],
        "resultsLimit": 100,
        "onlyPostsOlderThan": "2023-12-31",
        "onlyPostsNewerThan": "2023-01-01",
        "caption": True,
        "commentsMode": "RANKED_UNFILTERED"
    }

    print(f"🚀 Launching Apify Cloud Scraper specifically for 2023 Archive...")
    print(f"Target: {target_page}")
    print(f"Date Window: 2023-01-01 to 2023-12-31 | Limit: 100 posts")

    req = urllib.request.Request(
        start_url,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            run_id = data['data']['id']
            default_dataset_id = data['data']['defaultDatasetId']
            print(f"✅ Cloud worker started successfully! Run ID: {run_id}")
    except Exception as e:
        print(f"❌ Failed to start Apify job: {e}")
        return

    # Polling
    print("⏳ Cloud worker is extracting 2023 posts from Facebook...")
    poll_count = 0
    while True:
        time.sleep(5)
        poll_count += 1
        status_url = f'https://api.apify.com/v2/actor-runs/{run_id}?token={token}'
        try:
            with urllib.request.urlopen(status_url) as s_resp:
                s_data = json.loads(s_resp.read().decode('utf-8'))
                status = s_data['data']['status']
                print(f"  [Status #{poll_count}]: {status}...")
                if status in ['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT']:
                    if status != 'SUCCEEDED':
                        print(f"❌ Run failed with status: {status}")
                        return
                    break
        except Exception as err:
            print(f"  Warning: status check retry ({err})...")
            continue

    # Download Dataset
    print("📥 Downloading 2023 dataset from Apify...")
    dataset_url = f'https://api.apify.com/v2/datasets/{default_dataset_id}/items?token={token}&format=json'
    
    for attempt in range(1, 4):
        try:
            with urllib.request.urlopen(dataset_url) as d_resp:
                posts = json.loads(d_resp.read().decode('utf-8'))
                print(f"🎉 Successfully retrieved {len(posts)} posts from 2023!")
                
                output_file = r'c:\Tahir\Mission-1.0\Watchdog Press\WATCHDOG_PRESS_2023_ONLY.json'
                with open(output_file, 'w', encoding='utf-8') as out:
                    json.dump(posts, out, indent=2, ensure_ascii=False)
                print(f"💾 Saved 2023 archive to: {output_file}")
                
                # Check for May 15, 2023 post
                for p in posts:
                    text = p.get('text', '') or ''
                    if '15 May 2023' in text or 'Shield of Justice' in text or '2023-05-15' in p.get('time', ''):
                        print("\n⭐ FOUND MAY 15, 2023 FOUNDING POST:")
                        print("ID:", p.get('postId'))
                        print("Time:", p.get('time'))
                        print("Snippet:", text[:200])
                return
        except Exception as e:
            print(f"Retry download ({e})...")
            time.sleep(3)

if __name__ == '__main__':
    if len(sys.argv) > 1:
        fetch_2023(sys.argv[1].strip())
    else:
        print("Usage: python scrape_2023_apify.py <YOUR_API_TOKEN>")
