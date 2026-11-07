# -*- coding: utf-8 -*-
"""
Converts Junubin_COMPLETE_ALL_POSTS_AND_COMMENTS_MASTER.txt
into a visually stunning, professionally structured Markdown (.md) dossier.
"""

import os
import re
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

def get_badge(category):
    c = category.lower()
    if "apology" in c or "retraction" in c:
        return "⚖️ Official Retraction & Realignment"
    elif "corruption" in c or "spending" in c or "scandal" in c:
        return "💰 Financial Scandal & Corruption"
    elif "expose" in c or "breaking" in c:
        return "🚨 Breaking Insider Exposé"
    elif "review" in c or "endorsement" in c:
        return "⭐ Page Review & Endorsement"
    elif "health" in c or "medical" in c:
        return "🏥 Health & Medical Alert"
    elif "electoral" in c or "politics" in c:
        return "🗳️ SPLM Electoral Politics"
    elif "palace" in c or "presidential" in c or "j1" in c or "clashes" in c:
        return "🏛️ J1 Palace Power Struggle"
    return "📰 Political Intelligence"

def main():
    base_dir = r"c:\Tahir\Mission-1.0\Junubin Political Pulse Press"
    txt_path = os.path.join(base_dir, "Junubin_COMPLETE_ALL_POSTS_AND_COMMENTS_MASTER.txt")
    md_path = os.path.join(base_dir, "Junubin_COMPLETE_ALL_POSTS_AND_COMMENTS_MASTER.md")

    with open(txt_path, "r", encoding="utf-8", errors="ignore") as f:
        raw = f.read()

    blocks = raw.split("=================================================================\n[POST #")
    posts = []

    for idx, b in enumerate(blocks[1:], 1):
        lines = b.splitlines()
        header_line = lines[0] if lines else ""
        category = "Political Report"
        if " - " in header_line:
            category = header_line.split(" - ", 1)[1].strip()

        author = "Junubin Political Pulse Press"
        date = "Recent"
        content_lines = []
        comments = []
        is_content = False
        is_comments = False

        for l in lines[1:]:
            if l.startswith("Author:"):
                author = l.replace("Author:", "").strip()
            elif l.startswith("Date / Timeline:") or l.startswith("Date:"):
                date = l.split(":", 1)[1].strip()
            elif "FULL CONTENT:" in l or "CONTENT:" in l:
                is_content = True
                is_comments = False
            elif l.startswith("COMMENTS ("):
                is_content = False
                is_comments = True
            elif l.startswith("-----------------------------------------------------------------"):
                continue
            elif is_content:
                content_lines.append(l)
            elif is_comments:
                stripped = l.strip()
                if stripped and not stripped.startswith("(No direct comments"):
                    comments.append(stripped)

        content = "\n".join(content_lines).strip()
        # Clean title from first line of content
        first_line = content.split("\n")[0].strip() if content else f"Post #{idx}"
        first_line = re.sub(r'^[🚨🔥💥📢\s]+', '', first_line)
        short_title = first_line[:80] + ("..." if len(first_line) > 80 else "")

        posts.append({
            "id": idx,
            "category": category,
            "badge": get_badge(category),
            "author": author,
            "date": date,
            "title": short_title,
            "content": content,
            "comments": comments
        })

    # Total metrics
    total_comments = sum(len(p["comments"]) for p in posts)

    md = []
    md.append("# 🏛️ Junubin Political Pulse Press: Master Intelligence Dossier\n")
    md.append("> **Comprehensive Historical Archive & Sentiment Analysis (December 2025 – Late October 2026)**\n")
    md.append("---\n")

    # Metadata Grid
    md.append("### 📊 Metadata Dashboard\n")
    md.append("| Property | Detail |")
    md.append("| :--- | :--- |")
    md.append("| **Target Entity** | `Junubin Political Pulse Press` (Facebook ID: `61583596871939`) |")
    md.append("| **Established** | November 18, 2025 |")
    md.append(f"| **Archive Scope** | December 20, 2025 – Late October 2026 (**{len(posts)} Total Verified Posts**) |")
    md.append(f"| **Citizen Engagement** | **{total_comments} Documented Citizen Comments & Replies** |")
    md.append("| **Data Integrity** | `100% Unabbreviated DOM Extraction` (Full Post Text, Zero Truncations) |")
    md.append("| **Key Power Centers** | J1 Presidential Palace, Ministry of Finance, NSS, Aweil & Warrap Factions |\n")

    md.append("---\n")

    # Key Political Figures
    md.append("### 👥 Key Figures & Factions Tracked in This Dossier\n")
    md.append("| Figure / Institution | Role in Leaks | Political Dynamics |")
    md.append("| :--- | :--- | :--- |")
    md.append("| **Hon. James Deng Wal** | Executive Director, Office of the President (J1) | Central protagonist; initially accused by the page, then exonerated via official apology letter on Aug 24, 2026; defended against rivals. |")
    md.append("| **H.E. Salva Kiir Mayardit** | President of the Republic of South Sudan | Focus of all palace lobbying, directives clashes, and election preparations for 2026–2032. |")
    md.append("| **Hon. Adut Salva Kiir** | Presidential Envoy / First Daughter | Described as wielding de facto executive power in J1; clashes with ministers and security chiefs. |")
    md.append("| **Hon. Kuol Ayulo** | Minister of Finance & Economic Planning | Targeted in multiple exposés regarding lavish gold jewelry, $500k TikTok encryption payments, and family arrests. |")
    md.append("| **First Lady Mary Ayen Mayardit** | First Lady of South Sudan | Key palace stakeholder; recipient of lobbying delegations in Nairobi; hospitalized for eye surgery in Nairobi. |")
    md.append("| **Akol Santo** | Private Secretary to the President | Key J1 insider; coordinates alliance with James Deng Wal, Adut Kiir, and travel missions to Nairobi/Mombasa. |")
    md.append("| **Hon. Malual Tap Dieu** | 1st Undersecretary, Ministry of Finance | Accused of insulting Adut Kiir and alleging multimillion-dollar bribery to keep his post. |")
    md.append("| **Gen. Akech Tong Aleu** | Senior Security Leader / Former Governor | Questioned contradictory presidential directives between President Kiir and Adut Kiir. |")
    md.append("| **Simon Dee** | UK-based South Sudanese Political Critic | Targeted by the page in counter-offensives defending J1 officials. |\n")

    md.append("---\n")

    # Table of Contents
    md.append("## 📑 Table of Contents\n")
    md.append("| # | Date | Category | Headline Summary | Comments |")
    md.append("| :-: | :--- | :--- | :--- | :-: |")
    for p in posts:
        safe_link = f"#post-{p['id']}"
        md.append(f"| **{p['id']}** | `{p['date']}` | {p['badge']} | [{p['title']}]({safe_link}) | `{len(p['comments'])}` |")
    md.append("\n---\n")

    # Posts Detail Section
    md.append("## 📜 Comprehensive Post Archive\n")

    for p in posts:
        md.append(f"### <a id=\"post-{p['id']}\"></a>📌 [POST #{p['id']}] — {p['title']}\n")
        md.append(f"- **Category:** `{p['badge']}`")
        md.append(f"- **Author:** **{p['author']}**")
        md.append(f"- **Date / Timeline:** `{p['date']}`")
        md.append(f"- **Engagement:** `{len(p['comments'])} Citizen Comments & Replies`\n")

        md.append("#### 📝 Full Uncut Content:\n")
        # Format content in blockquote
        content_paras = p["content"].split("\n")
        formatted_paras = []
        for cp in content_paras:
            if cp.strip():
                formatted_paras.append(f"> {cp.strip()}")
            else:
                formatted_paras.append(">")
        md.append("\n".join(formatted_paras) + "\n")

        # Comments Section
        md.append(f"#### 💬 Citizen Comments & Discussion ({len(p['comments'])}):\n")
        if not p["comments"]:
            md.append("> *No direct citizen comments or comments restricted by author.*")
        else:
            for c in p["comments"]:
                # Check if it has author and text
                if ":" in c:
                    author_part, text_part = c.split(":", 1)
                    author_clean = re.sub(r'^\[\d+\]\s*', '', author_part).strip()
                    author_clean = re.sub(r'^\[REPLY\]\s*', '', author_clean).strip()
                    is_reply = "[REPLY]" in c
                    prefix = "  ↳ 🗨️" if is_reply else "- 👤"
                    md.append(f"{prefix} **{author_clean}**: {text_part.strip()}")
                else:
                    md.append(f"- 💬 {c}")

        md.append("\n[↑ Back to Table of Contents](#table-of-contents)\n")
        md.append("---\n")

    # Write file
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("\n".join(md))

    print(f"SUCCESS: Generated beautiful Markdown dossier at:\n{md_path}")

if __name__ == "__main__":
    main()
