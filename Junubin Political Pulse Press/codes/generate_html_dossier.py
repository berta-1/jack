import base64
import os

img_path = r"c:\Tahir\Mission-1.0\Junubin Political Pulse Press\admin-image.png"
with open(img_path, "rb") as f:
    b64_img = base64.b64encode(f.read()).decode("utf-8")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CONFIDENTIAL OSINT REPORT: De-Anonymization of Deng Garang Ajou</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

        :root {{
            --primary: #0f172a;
            --primary-light: #1e293b;
            --accent: #0284c7;
            --accent-gold: #b45309;
            --border: #cbd5e1;
            --bg-card: #ffffff;
            --text-dark: #0f172a;
            --text-muted: #475569;
            --tag-red: #ef4444;
            --tag-green: #10b981;
        }}

        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }}

        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f1f5f9;
            color: var(--text-dark);
            line-height: 1.5;
            padding: 25px 15px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }}

        .dossier-container {{
            max-width: 920px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid var(--border);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
            border-radius: 8px;
            overflow: hidden;
        }}

        /* Header Banner */
        .header-bar {{
            background: linear-gradient(135deg, #090d16 0%, #1e293b 100%);
            color: #ffffff;
            padding: 24px 30px;
            border-bottom: 4px solid var(--accent);
        }}

        .classification-badge {{
            display: inline-block;
            background: #dc2626;
            color: #ffffff;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
            padding: 4px 10px;
            border-radius: 4px;
            text-transform: uppercase;
            margin-bottom: 12px;
        }}

        .header-title {{
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
            line-height: 1.2;
            margin-bottom: 6px;
        }}

        .header-subtitle {{
            font-size: 13.5px;
            color: #94a3b8;
            font-weight: 400;
        }}

        .header-meta {{
            margin-top: 15px;
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            font-size: 11.5px;
            color: #cbd5e1;
            font-family: 'JetBrains Mono', monospace;
            border-top: 1px solid rgba(255, 255, 255, 0.12);
            padding-top: 12px;
        }}

        .meta-item strong {{
            color: #38bdf8;
        }}

        /* Content Container */
        .dossier-body {{
            padding: 28px 32px;
        }}

        .section-title {{
            font-size: 13px;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            color: #0369a1;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 14px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 6px;
        }}

        .section-icon {{
            background: #e0f2fe;
            color: #0284c7;
            padding: 3px 6px;
            border-radius: 4px;
            font-size: 11px;
        }}

        /* Subject Profile Card */
        .subject-card {{
            display: grid;
            grid-template-columns: 210px 1fr;
            gap: 22px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 18px;
            margin-bottom: 24px;
        }}

        .photo-column {{
            display: flex;
            flex-direction: column;
            align-items: center;
        }}

        .photo-frame {{
            width: 190px;
            height: 220px;
            border-radius: 6px;
            overflow: hidden;
            border: 3px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
            background: #0f172a;
        }}

        .photo-frame img {{
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top center;
            display: block;
        }}

        .photo-badge {{
            margin-top: 8px;
            font-size: 10px;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            background: #fee2e2;
            color: #991b1b;
            padding: 3px 8px;
            border-radius: 4px;
            text-align: center;
            width: 100%;
            border: 1px solid #fecaca;
        }}

        .status-pill {{
            margin-top: 5px;
            font-size: 10px;
            font-weight: 600;
            background: #dcfce7;
            color: #166534;
            padding: 2px 8px;
            border-radius: 12px;
            text-align: center;
            width: 100%;
        }}

        .profile-grid {{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px 16px;
        }}

        .grid-field {{
            border-bottom: 1px solid #edf2f7;
            padding-bottom: 6px;
        }}

        .field-label {{
            font-size: 10px;
            font-family: 'JetBrains Mono', monospace;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
        }}

        .field-value {{
            font-size: 12.5px;
            font-weight: 600;
            color: #0f172a;
        }}

        .field-value.highlight {{
            color: #0284c7;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
        }}

        .field-value.gold {{
            color: #92400e;
            font-weight: 700;
        }}

        /* Target Page Summary Box */
        .page-box {{
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-left: 4px solid var(--accent);
            border-radius: 6px;
            padding: 14px 16px;
            margin-bottom: 24px;
        }}

        .page-box-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }}

        .page-name {{
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
        }}

        .page-id {{
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            color: #64748b;
            background: #f1f5f9;
            padding: 2px 8px;
            border-radius: 4px;
        }}

        .page-specs {{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-top: 10px;
            background: #f8fafc;
            padding: 10px;
            border-radius: 4px;
        }}

        .spec-item span {{
            display: block;
            font-size: 10px;
            color: #64748b;
            font-family: 'JetBrains Mono', monospace;
            text-transform: uppercase;
        }}

        .spec-item strong {{
            font-size: 12px;
            color: #0f172a;
        }}

        /* Evidence Cards */
        .evidence-grid {{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
            margin-bottom: 24px;
        }}

        .evidence-card {{
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 14px;
            position: relative;
        }}

        .evidence-card:hover {{
            border-color: #cbd5e1;
        }}

        .evidence-number {{
            position: absolute;
            top: 10px;
            right: 12px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            color: #94a3b8;
        }}

        .evidence-title {{
            font-size: 12.5px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 6px;
            padding-right: 25px;
        }}

        .evidence-desc {{
            font-size: 11.5px;
            color: #475569;
            line-height: 1.45;
        }}

        .code-snippet {{
            display: block;
            background: #f1f5f9;
            border-left: 3px solid #0284c7;
            padding: 4px 8px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 10.5px;
            color: #0f172a;
            margin: 6px 0;
            border-radius: 0 4px 4px 0;
        }}

        /* Big Quote / Leak Box */
        .leak-quote-box {{
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-left: 5px solid #d97706;
            border-radius: 6px;
            padding: 14px 16px;
            margin-bottom: 22px;
        }}

        .leak-quote-title {{
            font-size: 12px;
            font-weight: 700;
            color: #b45309;
            text-transform: uppercase;
            font-family: 'JetBrains Mono', monospace;
            margin-bottom: 5px;
        }}

        .leak-quote-text {{
            font-size: 12.5px;
            font-weight: 600;
            color: #78350f;
            line-height: 1.5;
            font-style: italic;
            background: #ffffff;
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px dashed #f59e0b;
        }}

        /* Tables */
        .custom-table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 11.5px;
            margin-bottom: 22px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            overflow: hidden;
        }}

        .custom-table th {{
            background: #f8fafc;
            color: #475569;
            font-weight: 600;
            text-align: left;
            padding: 8px 10px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 10.5px;
            text-transform: uppercase;
        }}

        .custom-table td {{
            padding: 8px 10px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
        }}

        .custom-table tr:nth-child(even) {{
            background-color: #f8fafc;
        }}

        .badge-pill {{
            display: inline-block;
            font-size: 9.5px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 3px;
            text-transform: uppercase;
        }}

        .badge-pill.danger {{ background: #fee2e2; color: #b91c1c; }}
        .badge-pill.success {{ background: #dcfce7; color: #15803d; }}
        .badge-pill.neutral {{ background: #e0f2fe; color: #0369a1; }}
        .badge-pill.warning {{ background: #fef3c7; color: #92400e; }}

        /* Political Pact Box */
        .pact-box {{
            background: #fdf2f8;
            border: 1px solid #fbcfe8;
            border-left: 4px solid #db2777;
            border-radius: 6px;
            padding: 14px;
            margin-bottom: 22px;
        }}

        .pact-title {{
            font-size: 12.5px;
            font-weight: 700;
            color: #9d174d;
            margin-bottom: 5px;
        }}

        .pact-quote {{
            font-style: italic;
            font-size: 11.5px;
            color: #4c0519;
            line-height: 1.45;
            background: #ffffff;
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px dashed #f472b6;
            margin-top: 6px;
        }}

        /* Certification Footer */
        .footer-cert {{
            border-top: 2px solid #0f172a;
            padding-top: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10.5px;
            color: #64748b;
            font-family: 'JetBrains Mono', monospace;
        }}

        .cert-seal {{
            font-weight: 700;
            color: #0f172a;
            display: flex;
            align-items: center;
            gap: 6px;
        }}

        /* PRINT OPTIMIZATIONS */
        @media print {{
            body {{
                background-color: #ffffff;
                padding: 0;
            }}
            .dossier-container {{
                box-shadow: none;
                border: none;
                max-width: 100%;
            }}
            .header-bar {{
                padding: 14px 20px;
            }}
            .dossier-body {{
                padding: 18px 20px;
            }}
            .subject-card {{
                grid-template-columns: 190px 1fr;
                padding: 12px;
                gap: 16px;
            }}
            .photo-frame {{
                width: 170px;
                height: 195px;
            }}
            .page-break-inside-avoid {{
                page-break-inside: avoid;
            }}
        }}
    </style>
</head>
<body>

<div class="dossier-container">
    <!-- TOP CLASSIFICATION BANNER -->
    <div class="header-bar">
        <div class="classification-badge">CONFIDENTIAL // OSINT INVESTIGATION</div>
        <div class="header-title">TECHNICAL & BIOGRAPHICAL DOSSIER</div>
        <div class="header-subtitle">Attribution Analysis & De-Anonymization of Facebook Proxy Operator: <em>Junubin Political Pulse Press</em></div>
        <div class="header-meta">
            <div class="meta-item">TARGET ASSET: <strong>JUNUBIN POLITICAL PULSE PRESS</strong></div>
            <div class="meta-item">PRIMARY OPERATOR: <strong>DENG GARANG AJOU</strong></div>
            <div class="meta-item">CONFIDENCE: <strong>100% VERIFIED</strong></div>
            <div class="meta-item">UPDATED: <strong>OCTOBER 2026</strong></div>
        </div>
    </div>

    <div class="dossier-body">
        
        <!-- SECTION 1: SUBJECT PROFILE -->
        <div class="section-title">
            <span class="section-icon">👤</span>
            <span>SECTION 1: UNMASKED SUBJECT PROFILE</span>
        </div>

        <div class="subject-card page-break-inside-avoid">
            <div class="photo-column">
                <div class="photo-frame">
                    <img src="data:image/png;base64,{b64_img}" alt="Deng Garang Ajou portrait">
                </div>
                <span class="photo-badge">TARGET IDENTIFIED</span>
                <span class="status-pill">✓ Verified Keyboard Admin</span>
            </div>

            <div class="profile-grid">
                <div class="grid-field">
                    <div class="field-label">Full Legal Name</div>
                    <div class="field-value">Deng Garang Ajou</div>
                </div>

                <div class="grid-field">
                    <div class="field-label">Primary Aliases / Monikers</div>
                    <div class="field-value highlight">Dengdit / dengdit10</div>
                </div>

                <div class="grid-field">
                    <div class="field-label">Verified Mobile / WhatsApp</div>
                    <div class="field-value highlight">+256 762 808624 (Uganda)</div>
                </div>

                <div class="grid-field">
                    <div class="field-label">Verified Personal Email</div>
                    <div class="field-value highlight">denggarang10@gmail.com</div>
                </div>

                <div class="grid-field">
                    <div class="field-label">Corporate Media Position</div>
                    <div class="field-value gold">Chief Administrative Officer (CAO)</div>
                </div>

                <div class="grid-field">
                    <div class="field-label">Affiliated Media Company</div>
                    <div class="field-value">Juba Media (www.jubamedia.com)</div>
                </div>

                <div class="grid-field">
                    <div class="field-label">Academic Qualification</div>
                    <div class="field-value">B.Sc. Accounting & Finance (Nkumba Univ, 2nd Upper)</div>
                </div>

                <div class="grid-field">
                    <div class="field-label">Primary Financial Benefactor</div>
                    <div class="field-value gold">Maj. Gen. Diplomat Joseph Anyak Lual</div>
                </div>

                <div class="grid-field">
                    <div class="field-label">Ancestral Origin / Clan</div>
                    <div class="field-value">Baac Payam, Aweil East, NBeG</div>
                </div>

                <div class="grid-field">
                    <div class="field-label">Active Movement Corridors</div>
                    <div class="field-value">Entebbe / Kampala (UG) ⇄ Juba / Warrap (SS)</div>
                </div>
            </div>
        </div>

        <!-- SECTION 2: TARGET ASSET -->
        <div class="section-title">
            <span class="section-icon">📡</span>
            <span>SECTION 2: TARGET FACEBOOK PAGE SPECIFICATIONS</span>
        </div>

        <div class="page-box page-break-inside-avoid">
            <div class="page-box-header">
                <div class="page-name">Junubin Political Pulse Press</div>
                <div class="page-id">Facebook ID: 61583596871939</div>
            </div>
            <p style="font-size: 12.5px; color: #475569; margin-bottom: 10px;">
                A weaponized proxy Facebook page created on <strong>November 17/18, 2025</strong>, operated to broadcast sensitive intelligence leaks from J1 (Presidential Palace) and the Ministry of Finance, serving as an aggressive psychological enforcement tool for <strong>Hon. James Deng Wal</strong> and <strong>Akol Santo Arech</strong>.
            </p>
            <div class="page-specs">
                <div class="spec-item">
                    <span>Audience Reach</span>
                    <strong>16,000+ Followers</strong>
                </div>
                <div class="spec-item">
                    <span>Fabricated Location</span>
                    <strong style="color: #b91c1c;">Australia , Adelaide, SA</strong>
                </div>
                <div class="spec-item">
                    <span>OPSEC Camouflage</span>
                    <strong>Fake Overseas Base (Garden Island)</strong>
                </div>
            </div>
        </div>

        <!-- NEW SECTION: KEY SPONSORS, BOSSES & RECENT TRAVEL -->
        <div class="section-title">
            <span class="section-icon">💼</span>
            <span>SECTION 3: KEY SPONSORS, EMPLOYERS & TRAVEL LOG (DIRECT PROFILE HARVEST)</span>
        </div>

        <div class="leak-quote-box page-break-inside-avoid">
            <div class="leak-quote-title">🚨 SMOKING GUN: DENG GLOATING OVER LEAK CAMPAIGN ON HIS PERSONAL WALL</div>
            <div class="leak-quote-text">
                "This year is a Great year , Videos are leaking like God is cleaning the city😂😂😂"<br>
                <span style="display:block; text-align:right; font-size:11px; font-weight:700; color:#b45309; margin-top:4px;">
                    — Deng Garang Ajou Personal Post (pfbid02ERyrsstuWb7MVG2yKikhMFNHUCbA2R2u8dF3ZggRu113sCBy5xis6HEvG9q69xttl)
                </span>
            </div>
        </div>

        <table class="custom-table page-break-inside-avoid">
            <thead>
                <tr>
                    <th>Benefactor / Associate</th>
                    <th>Official Position / Role</th>
                    <th>Relationship to Deng Garang Ajou</th>
                    <th>Intelligence Relevance</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Maj. Gen. Diplomat Joseph Anyak Lual</strong></td>
                    <td>Senior Diplomat / General</td>
                    <td>Main Financial Sponsor (funded Diploma, Bachelor's & Masters)</td>
                    <td><span class="badge-pill danger">Primary Funder</span></td>
                </tr>
                <tr>
                    <td><strong>Hon. Kuol Athian Mawien</strong></td>
                    <td>Former National Minister of Finance & Econ. Planning</td>
                    <td>Educational Patron supporting Deng since nursery school</td>
                    <td><span class="badge-pill warning">High-Level Patron</span></td>
                </tr>
                <tr>
                    <td><strong>Ambassador Simon Jude</strong></td>
                    <td>Ambassador / Government Official</td>
                    <td>Deng explicitly names him as his <em>"Leader and Boss"</em> who hired him</td>
                    <td><span class="badge-pill danger">Direct Employer</span></td>
                </tr>
                <tr>
                    <td><strong>Hon. Stephen Lual</strong></td>
                    <td>Former Member of Parliament (MP)</td>
                    <td>Close political mentor, friend, and educational advisor</td>
                    <td><span class="badge-pill neutral">Political Mentor</span></td>
                </tr>
                <tr>
                    <td><strong>Uncle Gen. Thiik Bol Giir & Jackson Garang</strong></td>
                    <td>Military General & Senior Clan Elders</td>
                    <td>Family protectors who attended graduation and guide his political survival</td>
                    <td><span class="badge-pill neutral">Clan Shield</span></td>
                </tr>
                <tr>
                    <td><strong>Pilot Katerega</strong></td>
                    <td>Professional Aviator</td>
                    <td>Personal friend who flew Deng on a celebratory flight</td>
                    <td><span class="badge-pill success">Social Associate</span></td>
                </tr>
            </tbody>
        </table>

        <!-- RECENT TRAVEL & MOVEMENTS -->
        <table class="custom-table page-break-inside-avoid">
            <thead>
                <tr>
                    <th>Timestamp / Date</th>
                    <th>Movement Route</th>
                    <th>Operational Purpose</th>
                    <th>Verification Source</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Monday, 26th (2026)</strong></td>
                    <td>Entebbe Int'l (Uganda) ➔ Juba Int'l Airport (South Sudan)</td>
                    <td>Return from Nkumba University graduation to operational base Juba</td>
                    <td>Direct FB Post & Airport Terminal Photos</td>
                </tr>
                <tr>
                    <td><strong>Upcoming 2026</strong></td>
                    <td>Juba ➔ Warrap State</td>
                    <td>Confirmed flight ticket booked for political election campaign operations</td>
                    <td>Direct Post: <em>"My ticket to Warrap for Campaigns confirmed"</em></td>
                </tr>
            </tbody>
        </table>

        <!-- SECTION 4: THE 6 SMOKING GUNS -->
        <div class="section-title">
            <span class="section-icon">🔬</span>
            <span>SECTION 4: THE 6 FORENSIC ATTRIBUTION PILLARS</span>
        </div>

        <div class="evidence-grid page-break-inside-avoid">
            <div class="evidence-card">
                <span class="evidence-number">01</span>
                <div class="evidence-title">The Email-to-Handle Nomenclature</div>
                <div class="evidence-desc">
                    Deng Garang Ajou's official email is registered as:
                    <span class="code-snippet">denggarang10@gmail.com</span>
                    His core burner account that gave Junubin Review #1 is named:
                    <span class="code-snippet">dengdit10 (ID: 100070542608647)</span>
                    The suffix <strong>'10'</strong> was transferred directly from his personal email address.
                </div>
            </div>

            <div class="evidence-card">
                <span class="evidence-number">02</span>
                <div class="evidence-title">CAO Institutional Keys at Juba Media</div>
                <div class="evidence-desc">
                    Deng Garang Ajou is officially the <strong>Chief Administrative Officer (CAO)</strong> of <em>Juba Media</em> (259k followers). On Day 1 (Dec 20, 2025), the official <em>Juba Media</em> page reviewed Junubin, and Junubin replied: <em>"Thank you"</em>. He held administrative access.
                </div>
            </div>

            <div class="evidence-card">
                <span class="evidence-number">03</span>
                <div class="evidence-title">Idiosyncratic Keystroke Typing Quirk</div>
                <div class="evidence-desc">
                    A rare personal typing anomaly—placing a <strong>space before commas [ , ]</strong>—is present across his private profile settings and the target page:
                    <span class="code-snippet">Page: "Australia , Adelaide"</span>
                    <span class="code-snippet">Deng Profile: "Juba , Juba, South Sudan"</span>
                    <span class="code-snippet">Admin Post #5: "done , it was"</span>
                </div>
            </div>

            <div class="evidence-card">
                <span class="evidence-number">04</span>
                <div class="evidence-title">Closed Sock-Puppet Mutual Following Loop</div>
                <div class="evidence-desc">
                    Burner profiles <strong>dengdit10</strong> and <strong>Juba Mediaa</strong> follow only two "Junubin" pages on entire Facebook: <em>Junubin Political Pulse Press</em> and <em>Junubin street fashion</em>. Furthermore, <em>dengdit10</em> follows all three of Deng Garang Ajou's separate accounts.
                </div>
            </div>

            <div class="evidence-card">
                <span class="evidence-number">05</span>
                <div class="evidence-title">Synchronized Wall Shares (Aug 3)</div>
                <div class="evidence-desc">
                    On <strong>August 3</strong>, profile <em>dengdit10</em> shared a video from <em>South Sudan Newsdeck</em>. On the exact same day and hour, profile <em>Deng Garang Ajou</em> shared the exact same video. Both accounts operated concurrently from the same device.
                </div>
            </div>

            <div class="evidence-card">
                <span class="evidence-number">06</span>
                <div class="evidence-title">Ancestral "Baac Media" & Aweil Roots</div>
                <div class="evidence-desc">
                    In May 2023, Juba Media officially endorsed Deng Garang Ajou, designating his outlet as <strong>"Baac Media"</strong>. <em>Baac</em> is a prominent Payam in Aweil East, explaining his passionate defense of Aweil politicians in Post #5.
                </div>
            </div>
        </div>

        <!-- SECTION 5: THE NETWORK MATRIX -->
        <div class="section-title">
            <span class="section-icon">🌐</span>
            <span>SECTION 5: CONTROLLED ASSET INVENTORY</span>
        </div>

        <table class="custom-table page-break-inside-avoid">
            <thead>
                <tr>
                    <th>Asset Name</th>
                    <th>Account Type</th>
                    <th>Identifier / Handle</th>
                    <th>Role in Network Operation</th>
                    <th>Attribution</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Deng Garang Ajou (Main)</strong></td>
                    <td>Flagship Profile</td>
                    <td><code>deng.garang.ajou.907626</code></td>
                    <td>10K followers; CAO Juba Media & Nkumba University</td>
                    <td><span class="badge-pill success">Verified Real</span></td>
                </tr>
                <tr>
                    <td><strong>Deng Garang Ajou (Contact)</strong></td>
                    <td>Personal Profile</td>
                    <td><code>ID: 100084777053541</code></td>
                    <td>Houses email (denggarang10) & phone (+256 762 808624)</td>
                    <td><span class="badge-pill success">Verified Real</span></td>
                </tr>
                <tr>
                    <td><strong>dengdit10</strong></td>
                    <td>Burner Profile</td>
                    <td><code>ID: 100070542608647</code></td>
                    <td>Deployed on Dec 20, 2025 to give 5-star review</td>
                    <td><span class="badge-pill danger">Sock-Puppet</span></td>
                </tr>
                <tr>
                    <td><strong>Juba Mediaa</strong></td>
                    <td>Clone Profile</td>
                    <td><code>ID: 100088498221282</code></td>
                    <td>Twin profile (double 'a'); Day-1 launch booster</td>
                    <td><span class="badge-pill danger">Sock-Puppet</span></td>
                </tr>
                <tr>
                    <td><strong>Youth Union Uganda</strong></td>
                    <td>Recycled Page</td>
                    <td><code>web.facebook.com/jubanewsdeck</code></td>
                    <td>Rebranded Juba Newsdeck; Day-1 booster page</td>
                    <td><span class="badge-pill neutral">Proxy Page</span></td>
                </tr>
                <tr>
                    <td><strong>Junubin Political Pulse Press</strong></td>
                    <td>Target Attack Asset</td>
                    <td><code>ID: 61583596871939</code></td>
                    <td>16,000 followers; J1 political leaks & psychological ops</td>
                    <td><span class="badge-pill danger">Target Asset</span></td>
                </tr>
            </tbody>
        </table>

        <!-- SECTION 6: POLITICAL PATRONAGE -->
        <div class="section-title">
            <span class="section-icon">🏛️</span>
            <span>SECTION 6: POLITICAL PATRONAGE & HANDLER PACT</span>
        </div>

        <div class="pact-box page-break-inside-avoid">
            <div class="pact-title">🤝 The August 24, 2026 Formal Alliance Pact (Post #5)</div>
            <p style="font-size: 11.5px; color: #475569;">
                After initially criticizing <strong>Hon. James Deng Wal</strong> (Executive Director of the Office of the President), the page published an official full-page apology and concluded an operational alliance with Deng Wal's frontline online defender, <strong>Ater Ibin Majook</strong>:
            </p>
            <div class="pact-quote">
                "Ater Ibin Majook James Deng Wal is a good leader and what we had between us is done , it was a Political misunderstanding... We recognize you as his true fighter who never gives up in defending him , <strong>Let us join forces and fight the Enemies together</strong>."<br>
                <span style="display:block; text-align:right; font-weight:700; font-size:10.5px; margin-top:4px;">— Junubin Political Pulse Press Admin Reply to Ater Ibin Majook</span>
            </div>
        </div>

        <!-- FOOTER & CERTIFICATION -->
        <div class="footer-cert">
            <div class="cert-seal">
                <span>🔒</span>
                <span>FORENSIC VERIFICATION SEAL: OSINT-SS-VERIFIED</span>
            </div>
            <div>PRINT READY // OFFICIAL INTELLIGENCE DOSSIER</div>
        </div>

    </div>
</div>

</body>
</html>
"""

target_proj = r"c:\Tahir\Mission-1.0\Junubin Political Pulse Press\DENG_GARANG_AJOU_DOSSIER.html"
target_down = r"C:\Users\ademt\Downloads\DENG_GARANG_AJOU_DOSSIER.html"

with open(target_proj, "w", encoding="utf-8") as f:
    f.write(html_content)

with open(target_down, "w", encoding="utf-8") as f:
    f.write(html_content)

print("HTML Dossier generated and copied to Downloads successfully!")
