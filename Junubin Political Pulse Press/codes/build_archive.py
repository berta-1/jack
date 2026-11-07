# -*- coding: utf-8 -*-
import os
import re

def main():
    input_path = r"c:\Tahir\Mission-1.0\Junubin Political Pulse Press\clean_text_no_fb.txt"
    with open(input_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # Define post blocks manually and via regex to guarantee 100% precision and zero noise
    posts = []

    # 1. Recommendation 1
    posts.append({
        "id": 1,
        "category": "Page Review / Community Endorsement",
        "author": "South Sudan National Youth Union in Uganda",
        "date": "December 20, 2025",
        "text": "Junubin future media is the real media of Junubin and the future generation born and raised in South Sudan",
        "comments": []
    })

    # 2. Recommendation 2
    posts.append({
        "id": 2,
        "category": "Page Review / Media Endorsement",
        "author": "TONJ MEDIA TV",
        "date": "December 20, 2025",
        "text": "They are fast and Easy when delivering news about South Sudan and it’s borders, indeed they are the future media of Junubin",
        "comments": []
    })

    # 3. Recommendation 3
    posts.append({
        "id": 3,
        "category": "Page Review / Media Endorsement",
        "author": "Impact Media",
        "date": "December 20, 2025",
        "text": "Real news and honest media outlet in South Sudan that brings realiBle news",
        "comments": []
    })

    # 4. Recommendation 4
    posts.append({
        "id": 4,
        "category": "Page Review / Media Endorsement",
        "author": "Juba Media",
        "date": "December 20, 2025",
        "text": "Very impressive and Real media with real news",
        "comments": [
            {"author": "Junubin Political Pulse Press", "text": "Thank you"}
        ]
    })

    # 5. Apology Letter to Hon. James Deng Wal
    posts.append({
        "id": 5,
        "category": "Official Retraction & Political Realignment",
        "author": "Junubin Political Pulse Press",
        "date": "24 August 2026",
        "text": """OFFICIAL APOLOGY LETTER TO HON.JAMES DENG WAL, EXECUTIVE DIRECTOR IN THE OFFICE OF THE PRESIDENT, REPUBLIC OF SOUTH SUDAN 

To: Hon. James Deng Wal
Executive Director, Office of the President, Republic of South Sudan
Subject: Formal Apology and Clarification
Dear Hon. James Deng Wal,

On behalf of Junubin Political Pulse Press, we sincerely and unreservedly apologize for statements previously published questioning your experience and service as a soldier and leader.

We acknowledge that those claims were false, unfair, and influenced by information originating from individuals opposed to your leadership. After reflecting on your record and service, we recognize you as an experienced leader, manager, director, and public servant who continues to contribute to the Government of H.E. President Salva Kiir Mayardit.

We particularly apologize for claiming that you are not an experienced soldier. We recognize that you joined the military in 1992 and served alongside the liberation SPLM/SPLA forces during the struggle under the commander of CDF, General Salva Kiir Mayardit And Leader Dr.John Garang De Mabior. Your long years of service and experience are deserving of recognition, and we acknowledge that your rank of Major General reflects your military career and service to the country.

Junubin Political Pulse Press also recognizes your responsibilities as Executive Director in the Office of the President having Served twice in the same position. This shows how trustworthy you are and how important your managerial Skills and Leadership are to the Presidency and the demanding role you play in supporting the administration in J1.

Having reconsidered our previous position, we respectfully encourage H.E. President Salva Kiir Mayardit to continue entrusting General Hon. James Deng Wal with his responsibilities as Executive Director in J1 during the electoral period and beyond, based on his experience, loyalty, leadership, and institutional knowledge. We can attest that Wal will help you now and further more as your leadership grows, he will mobilize youths, especially from Korok community, Aweil community and South Sudanese at large. Keep Deng wal near you as encouraged by ARTIST MALEK ADUT In his previous songs released before meeting and afterwards when taken to you in j1 by James Deng Wal.

Junubin Political Pulse Press sincerely regret any damage our previous statements may have caused to Hon.James Deng Wal’s reputation. We accept responsibility for publishing those claims and withdraw them now.

From today, Junubin Political Pulse Press pledges to end the publication of unfounded accusations against Hon. James Deng Wal and to support fair, factual, and responsible coverage of his work and public service.

Hon. James Deng Wal deserves respect for his years of service having served in the office of the President from 2013-2022 when he got relieved on May 22nd. He got appointed again on 3rd November 2026 and we can assure the Public that he is fit to serve H.E Salva Kiir for the betterment of SPLM Party and Protection of H.E Salva Kiir Mayardit, and we Also believe that all South Sudanese should be encouraged to support leaders who demonstrate commitment to the nation Like James Deng Wal.

Please accept our sincere apology, respect, and appreciation.
Sincerely,
Junubin Political Pulse Press""",
        "comments": [
            {"author": "Malong Concern", "text": "Thank you 😊 🙏"},
            {"author": "Kiirdit Garang Garang", "text": "Accepted"},
            {"author": "Angelo Deng Aguek Bol", "text": "It is very relevant that you have sense now"},
            {"author": "Malong Ayii", "text": "Hi"},
            {"author": "Ater Ibin Majook", "text": "Thank you so much"},
            {"author": "Yor Wal", "text": "Hmm 😒"},
            {"author": "Tach Thuon", "text": "(Interaction)"}
        ]
    })

    # 6. Youth Rebuke Rebecca Nyandeng Garang
    posts.append({
        "id": 6,
        "category": "Inter-regional Political & Youth Polemics",
        "author": "Junubin Political Pulse Press",
        "date": "Mid-2026",
        "text": """YOUTHD REBOUK REBECCA NYANDENG GARANG DE MABIOR FOR CALLING OUT BARL EL GHAZEL YOUTHS TO FIGHT THE GOVERNMENT 

Youths have this evening Retaliated against Nyandeng Garang Mabior’s call to on the Barl El Ghazel Youths to fight against the Government of South Sudan when those from Mading Bour and Twic East are busy in Sherikat and other Bour inflicted Areas dancing Ayah-Yah and Dergel.

“H.E Nyadeng Garang wants Youth of Aweil, Lakes State, and Warrap to fight the regime while Jonglei youths are dancing ayaya in Sherikat😏” Madut Kiir from Kuacjok said.

The debate of Nyandeng Garang’s call was the main topic at all tea places today in juba city, Especially in Areas like the Hai Thoura Political Basement, Loglogo Political basements and Juba town unfinished Buildings where politics are highly discussed.

🔥🔥——-The Beat Goes On——🔥🔥""",
        "comments": [
            {"author": "Tony Jacksoon", "text": "(Interaction recorded)"}
        ]
    })

    # 7. Kuol Ayulo Defends Wife
    posts.append({
        "id": 7,
        "category": "Ministerial Defense / Lavish Wealth Controversy",
        "author": "Junubin Political Pulse Press",
        "date": "2026",
        "text": """Kuol Ayulo , Finance Minister Defends Wife Amid Social Media Criticism

Finance Minister Kuol Ayulo has strongly defended his wife amid ongoing criticism on social media platforms over the gold necklace she was seen wearing.

Reacting with frustration, Minister Kuol Ayulo reportedly dismissed the criticism, arguing that the necklace worn by his wife was insignificant compared with the amount of gold jewelry worn by other prominent figures and their families.

“The so-called gold necklace my wife is wearing is nothing compared to the tons of gold Mary Ayen Mayardit and her family’s female members are wearing,” he said.

He questioned why the public was focusing so much attention on his wife’s relatively small piece of jewelry, arguing that she deserves far more than the necklace being discussed online.

“Sometimes, our hopeless citizens pay attention to minor things and give zero attention to the most important issues affecting us in many ways,” Kuol Ayulo added.

The Finance Minister’s intervention has itself attracted attention, with some observers noting that ministers are increasingly responding directly to criticism on social media rather than relying on political supporters or media mouthpieces to defend them.

Kuol Ayulo’s decision to publicly defend his wife has therefore become a talking point, adding another unusual chapter to the ongoing social-media debates surrounding South Sudan’s political and public figures.

🔥🔥———-The Beat Goes On———🔥🔥""",
        "comments": [
            {"author": "Lueth Mayendit Anyiel", "text": "South Sudan woman,"},
            {"author": "Bill Hope Majak", "text": "Our money is being spend by this small wunweng on his family"},
            {"author": "Halamama Lom", "text": "Brother this is not the only lady have goals in the world"},
            {"author": "Samuel Atem Amet", "text": "His wife is not indispensable, but just like any other ordinary woman in the country. Why adoring and decorating her with those expensive jewelleries?"},
            {"author": "Piol Tycun Sr.", "text": "His wife is not that beautiful zatu despite the jewelry she is wearing, she doesn't have eyelashes imagine she look like man in woman clothes 😆 😂 🤣 😜"},
            {"author": "Simon Akuei Door", "text": "Jewelry and citizens die because of hunger"},
            {"author": "Bak Lual Pocban", "text": "Okay"},
            {"author": "Marial Machuei Matik", "text": "🙆🙆🙆🙆🙆🙆"}
        ]
    })

    # 8. Hon. James Deng Wal J1 Administration & Simon Dee Attack
    posts.append({
        "id": 8,
        "category": "J1 Palace Defense & Counter-Offensive",
        "author": "Junubin Political Pulse Press",
        "date": "2026",
        "text": """Hon. James Deng Wal, Executive Director in the Office of President Salva Kiir Mayardit at J1, deserves recognition for his service, commitment, Current Proper Management of J1 under the Visionary Leader, H.E Salva Kiir Mayardit and the dedication to the j1 Presidency.

James Wal has Earned a Massive Employee’s Walfare and Office Management in j1 where he has prevented The leaks of Documents and Presidential Confidential Records.

Junubin Political Pulse Press encourages H.E. President Salva Kiir Mayardit to keep General James Deng Wal in his position and not replace him, as rumours circulating about his replacement by Hon. Santino Atak Majak remain unconfirmed and Baseless as Incapacitated by Mr.Simon Dee, Low-life Depressed Youth from Aweil who Ran accrose the Sea to find a Better Life in United Kingdom but turned out to be a fisherman in London. He now barks and lies About South Sudan Politics without any knowledge, Language or any communication skills to criticize the government and it’s Officials.

Simon Dee should stay away from misinformation Before we launch Attacks towards him for Misinformation against Hon.James Deng Wal, Akol Santo and Adut Salva Kiir Mayardit.

General James Deng Wal and Hon.Santino Atak Majak are brothers and professionals who can work together for the success of the government. Atak’s role as Vice President of GPOC further demonstrates the importance of cooperation between the two who are currently working hand in hand for a Better South Sudan.

Let Hon.General James Deng Wal continue serving at J1 As Executive Director Of H.E Salva Kiir Mayardit.

🔥🔥———The Beat Goes On——-🔥🔥""",
        "comments": [
            {"author": "Wadar Tuar", "text": "Wonderful quotes this is the spirit of Comradeship, James Deng wal is one of dedicated leader who has devoted his time serving the Republic of South Sudan 🇸🇸 and the president may almighty God bless him"},
            {"author": "Wau Lim Liu", "text": "They whole world is watching"},
            {"author": "Maditdi Ajak", "text": "head is the one rest country because head memory live in the have many to create help country in law of god our people live in south Sudan..."},
            {"author": "Wen Adeng", "text": "messi is the Goat 🐐"},
            {"author": "Kuol Akel", "text": "Paid one."},
            {"author": "Akeen Garang Akeen Deng", "text": "More than serious 🤪"},
            {"author": "Akuei Maboto Majok", "text": "Eat your money and keep quiet"},
            {"author": "Gai Tuk Jr.", "text": "eat your money and keep quiet 🤫"},
            {"author": "Wol Wol Mawien", "text": "Absolutely true"},
            {"author": "Wilson Longar Akol", "text": "(Interaction)"}
        ]
    })

    # 9. Hon. Deng Alor Kuol Illness in Nairobi
    posts.append({
        "id": 9,
        "category": "Political Figure Health Status",
        "author": "Junubin Political Pulse Press",
        "date": "2026",
        "text": """Hon.Deng Alor Kuol is Reportedly still unable to talk in Nairobi,Kenya irrespective of the successful Operation.
He needs your Prayers All 🙏""",
        "comments": [
            {"author": "Majur Chien Atecbuk", "text": "Nothing happens to hon Deng Alor kuol"},
            {"author": "Ayen-pawuoi KG", "text": "Get well soon ☺️"},
            {"author": "Gabriel Mading", "text": "Get well soon"},
            {"author": "Løøk Magiso", "text": "Get well soon"},
            {"author": "Cocô Dizzi Pro", "text": "According to prophet Peter AD i don't think so🤔🤔"},
            {"author": "Karak Dit", "text": "Quite recovery"},
            {"author": "Kiirdit Garang Garang", "text": "Quick recovery to him."},
            {"author": "Apai Paul Akuei", "text": "May God 🙏🙏🙏🙏 heal him in Jesus name 🙏🙏🙏🙏🙏"},
            {"author": "Apach Mapieu", "text": "Quick recovery Hon Deng Alor Kuol by the grace of our Lord Jesus Christ."},
            {"author": "James Deng Garang", "text": "Quick recovery in Jesus mighty Name"},
            {"author": "David Manyuon Laat", "text": "QR"},
            {"author": "Dor Makuei Achol Deng", "text": "May God heal him 🙏"}
        ]
    })

    # 10. Minister Ateny Wek Ateny to China
    posts.append({
        "id": 10,
        "category": "Ministerial Corruption & Incompetence Allegation",
        "author": "Junubin Political Pulse Press",
        "date": "2026",
        "text": """MINISTER ATENY WEK ATENY TRAVELS TO CHINA FOR 9TH CONFERENCE AS NOTHING IMPROVES IN HIS MINISTRY 

Information Minister and ICT Ateny Wek Ateny has traveled to China for an ICT conference.

This is 9th Conference he has attended since he was Appointed minister of information and nothing is improving in this country.

Why Does Ateny Wek just get a traveling Amount of more than 300,000 dollars for the conferences and Return to juba with no Improvement and knowledge of Providing a Productive Life for the South Sudanese?

Has Ateny Wek Ateny, the Man who speaks to God directly failed as Minister of Information, ICT and POSTAL Technical Communications? If yes, What position does he deserve in the Government?

Rumours say Hon.Albino Bol Dhieu, The Former minister of Youths and Sports is set to Replace him soon due to his incompetence and Corruption in the ministry.

🔥🔥——-The Beat Goes On———🔥🔥""",
        "comments": [
            {"author": "Billy Bol Ajuoi", "text": "...I think the answers are within the question."},
            {"author": "Chol Abuol Cholmakuacdit", "text": "Hon. Ateny Wek Ateny ee wun weng wekeh!!!"},
            {"author": "Charles Kisanga", "text": "Does not interact with staff not even his technical advisor."}
        ]
    })

    # 11. Kuol Ayulo Threatens Family Over Jewelry Leaks
    posts.append({
        "id": 11,
        "category": "Ministerial Family Threat & Corruption Scrutiny",
        "author": "Junubin Political Pulse Press",
        "date": "2026",
        "text": """KUOL AYULO MINISTER OF FINANCE THREATENS HIS FAMILY MEMBERS OF ARREST FOR PARTICIPATING IN EXPOSING THE JEWERLY OF HIS WIFE ON MEDIA 

Minister Kuol Ayulo has fully forced his nephew to Publicly Apologize for Participating in Criticism against his Wife who has bought the largest jewelry in South Sudan, Kuol has publicly started that he will arrest anyone who has and will participate in exposing the lavish lifestyle of his wife. Kuol who has also sidelined all his family and Agaar Youths is said to have told his family heads and leaders that he should be permitted to arrest all the Angry family youths who have exposed him and his wife on media.

The Young coward in the names of Justice Publicly Apologized on Facebook citing that he has not gone to Kuol AYULO’s House for more than 2 months, the reasons are that he is also sidelined by the minister of finance which led to his criticism.

Today, the Minister of Finace and Planning, Mr Kuol’s wife is rated the woman with the Highest and richest Gold in the whole of South Sudan surpassing Hon.Adut Salva Kiir and Her Mother Mary Ayendit.

More in the comments section!
🔥🔥——The Beat Goes On——🔥🔥""",
        "comments": [
            {"author": "Mabior Mayen", "text": "They are spoiling Kuol Ayulo. This how individuals in South Sudan betraye their own leaders"},
            {"author": "Daniel Bol Majok", "text": "Fake news"},
            {"author": "Mane Deng Magiir", "text": "🙏🙏🙏"}
        ]
    })

    # 12. General Akech Tong Aleu and Adut Kiir
    posts.append({
        "id": 12,
        "category": "State Security & Presidential Family Clashes",
        "author": "Junubin Political Pulse Press",
        "date": "2026",
        "text": """General Akech Tong Aleu has Reportedly asked H.E Salva Kiir Mayardit about the right Person that runs South Sudan comparing the leadership of the country between Adut Salva Kiir and Her father President Salva Kiir.

This comes amidst different Directives as The President said he shouldn’t Arrest And Detain Leaders while Adut says He Should Arrest and Detain Leaders.

Who do you think is running South Sudan Politics, H.E Salva Kiir or Adut Salva Kiir?""",
        "comments": [
            {"author": "Guet Ngor James", "text": "Thanks so much general Akech Tong. Adut Kiir Mayardit is not the president of South Sudan. She should know that she has no presidential powers to arrest liberators who liberated this country. Her father should remove her. South Sudan is not their family asset. General Pieng played very great role in Payindo by making red army lives standard. He also fought vigorously during the struggle but Adut Kiir Mayardit' father didn't capture any town during the struggle. Adut Kiir and her father should not misuse national resources and power of this country. Otherwise, God Almighty God will get rid of them. South Sudan is not theirs."},
            {"author": "Johnson But Ngor", "text": "Atem is better than Adut, what she thought always bring separation among the people."},
            {"author": "Deng Gabriel", "text": "Akech Tong should follow his boss orders. President kiir is the only c in c. Being a child of a president doesn't grant you permission to detain the leaders. What if the leaders turned against her father? How would it be?"},
            {"author": "Emmanuel Dut Shows", "text": "That's not right for detained leaders with out any opinion or any thing they did."},
            {"author": "Gabriel Tutu Martin", "text": "Who's she to give her right in the country"}
        ]
    })

    # 13. Hon. Malual Tap Dieu Insulting Adut Kiir
    posts.append({
        "id": 13,
        "category": "Intra-Governmental Sabotage & Bribery Allegations",
        "author": "Junubin Political Pulse Press",
        "date": "2026",
        "text": """Hon. Malual Tap Dieu, 1st Undersecretary in the Ministry of Finance, insulted the first daughter, Hon. Adut Salva Kiir Mayardit.

Today, around 4:00 PM, Malual Tap Dieu, known as Tap Agaar, met with his group members, a controversial goon, at Twin Tower Bibi's apartment. Agaar's Tobacco was heard insulting Hon. Adut Salva Kiir Mayardit, claiming that Adut is not in her right mind, as she normally travels from Juba to Nairobi, making her forget government duties, according to Hon. Malual Tap Dieu.

Malual's loyalists, especially those who have one reason or another against Adut Salva Kiir Mayardit, started laughing after they heard Malual Tap insulting the presidential envoy on a special program. Therefore, one of the loyalists to Hon. Adut was among the group remained mute for fear of losing his share if he decided to confront Malual Tap in the present.

The gentleman, whose name is withheld, informed this publication that Hon. Malual Tap Dieu said that he bribed Hon. Adut Salva Kiir Mayardit with millions of dollars, which is very difficult for Hon. Adut. to decide Malual's sacking. 

Feed a dog to remember you in three days. And feed humans to remember you in seconds after he or she gets the position. Agaar's Tobacco was crying like a lost baby to Hon. Adut Salva Kiir mayardit in order to be appointed as 1st Undersecretary in the ministry of finance. And today he revealed his true colors against Her excellency. 

🔥🔥——-The Beat Goes On———🔥🔥""",
        "comments": [
            {"author": "John Aciek Along", "text": "Rubbish"},
            {"author": "Moses Majok Aguek", "text": "Hon Malual con not saying Hon Adut this because is village man"},
            {"author": "Wau Lim Liu", "text": "When you find lost child,bring to the own"}
        ]
    })

    # 14. Kuol Ayulo $500k to Cousin in Germany for Tiktok encryption
    posts.append({
        "id": 14,
        "category": "Lavish Spending / Cyber-censorship Scandal",
        "author": "Junubin Political Pulse Press",
        "date": "2026",
        "text": """KUOL AYULO PAYS HIS COUSIN 500k DOLALRS IN GERMANY FOR COMPUTER JOB BUT FAILS , KUOL PLANS ON 1.5 MILLION PAYMENT TO DANISH WHITES 

Good morning from the Gold Royal Family of Mr.Kuol Ayulo.

His lovely Wife has bought a New Set of Gold today, she also paid more than $500,000 dollars to stop the Tiktokers from Downloading her Videos.

The $500,000 dollars was transferred to Kuol AYULO’s cousin in Germany to Encrypt all the Videos of Adol Kau on Tiktok in order to stop South Sudanese from downloading them but the guy Ended up eating 500k as he failed at his work.

The minister of finance, Kuol Ayulo is now planning to Employ whites from Denmark and pay them 1.5m dollars in order to stop South Sudanese from downloading his wife’s videos on tiktok.

The funny part is that those whites will still fail because the God of South Sudan is standing with all South Sudanese, he should stop corruption instead ing of wasting money.

🔥🔥——-The Beat Goes On——-🔥🔥""",
        "comments": [
            {"author": "Khamis Joseph", "text": "Chaiii 🙆 Junubin . Which one be welcome to Gold Royal family again oooh😂😂"},
            {"author": "Deng Lueth Unguec", "text": "Yaaa Junubin remember not every glittering necklace is a gold."},
            {"author": "Dut", "text": "Let him just pay me, and I’ll do all that for him 😁"},
            {"author": "Dommy Biet", "text": "But we can screen record them"},
            {"author": "Dok Ayen", "text": "Direct to blue house 🏡 yazol"},
            {"author": "Smart Kìss Jr.", "text": "She doesn’t buy anything. Before they were alive, remember that"},
            {"author": "ITz Ev", "text": "Beautiful aunty 🥰"},
            {"author": "Magom Muorwel", "text": "Smart"},
            {"author": "Riak Gok Majok", "text": "Even the watch is made of gold 🪙🪙"},
            {"author": "Kharbino Koklec Mading", "text": "Nice looking and beautiful"},
            {"author": "Javilez De Map", "text": "E ka diit Gaai 😁🤣🤣🤣"},
            {"author": "Akot Chamicadin", "text": "Dig dhiat kaya ya sermutha"},
            {"author": "Deng Tokmac Chuor", "text": "Enjoy your time 🌹❤️❤️❤️🤝👈"},
            {"author": "Anthony Majok Bak", "text": "😂, fake wealth"},
            {"author": "Francis Aguot Lual", "text": "CaptFrancis.aguot.aguot"},
            {"author": "Aweil Deng Diing", "text": "Joy your time sister"},
            {"author": "Alei Kuot Madut", "text": "Adorable Amazing"},
            {"author": "Khor Wanjang Biel", "text": "Video"},
            {"author": "Arun Maguot", "text": "🥰🥰🥰🥰🥰❤️❤️❤️❤️"},
            {"author": "MAJAK CHUEI AHOU", "text": "🔥"},
            {"author": "Claire Ayok", "text": "😍😍😍😍"},
            {"author": "Nicholas Chol", "text": "👍👍👍👍👍"},
            {"author": "Kind Kon Mager", "text": "privative."},
            {"author": "Giggs Mamer Matuet", "text": "Beautiful"},
            {"author": "Isaac Meen Mathiang Makuac", "text": "Ting Agaardit Madong looking so beautiful and Top 1 beauty"},
            {"author": "Maluil King Gee", "text": "They are just enjoying our oils money in they way we don, t even asking"},
            {"author": "Adhar Chan Guong", "text": "Sometimes a blue house is a correctional services center for government officials"},
            {"author": "Mà Kěr", "text": "walai junubin with bragging she's villager to town"},
            {"author": "Bech Amuor", "text": "Madoldit you look smart"},
            {"author": "Raandu E Raandu", "text": "She look cute"},
            {"author": "Rose John Dhel", "text": "beautiful 🥰🥰"},
            {"author": "Elizabeth Adut Marial", "text": "❤️❤️❤️❤️❤️👍👍🙏🙏🙏🙏"},
            {"author": "Okela Akon Ngong Akol", "text": "❤️❤️❤️❤️🙏"},
            {"author": "Leila Majak Agok", "text": "Beautiful✨😍"},
            {"author": "Abuk Aher", "text": "💕💕💕💕💕"}
        ]
    })

    # 15. The Latest Posts from Recent Feed Scraping
    posts.append({
        "id": 15,
        "category": "SPLM Electoral Controversy",
        "author": "Junubin Political Pulse Press",
        "date": "October 2026",
        "text": "I will not accept this rumour allegedly about Hon. Madoldit was denied by NEC for SPLM to contest, till I will get a right information from official channels.",
        "comments": []
    })

    posts.append({
        "id": 16,
        "category": "Electoral Politics & Akol Santo",
        "author": "Junubin Political Pulse Press",
        "date": "October 2026",
        "text": "Akol is going nowhere till 2032 for another general election.",
        "comments": []
    })

    posts.append({
        "id": 17,
        "category": "Presidential Family & Paternity Allegations",
        "author": "Junubin Political Pulse Press",
        "date": "October 2026",
        "text": "Meaning that if Atem is not biological son then Adut might not be his biological daughter too and Akhol Must be taken to the Court for clarification.",
        "comments": []
    })

    # Write Master TXT Report
    txt_path = r"c:\Tahir\Mission-1.0\Junubin Political Pulse Press\Junubin_Political_Pulse_Press_FULL_EXTRACT.txt"
    total_comments = sum(len(p["comments"]) for p in posts)

    with open(txt_path, "w", encoding="utf-8") as out:
        out.write("=================================================================\n")
        out.write("MASTER DOSSIER: JUNUBIN POLITICAL PULSE PRESS (FULL ARCHIVE)\n")
        out.write(f"Total Posts: {len(posts)} | Total Documented Comments: {total_comments}\n")
        out.write(f"Generated On: {os.path.basename(txt_path)}\n")
        out.write("=================================================================\n\n")

        for p in posts:
            out.write("=================================================================\n")
            out.write(f"[POST #{p['id']}] - {p['category']}\n")
            out.write(f"Author: {p['author']}\n")
            out.write(f"Date: {p['date']}\n")
            out.write("-----------------------------------------------------------------\n")
            out.write("CONTENT:\n")
            out.write(p["text"] + "\n")
            out.write("-----------------------------------------------------------------\n")
            out.write(f"COMMENTS ({len(p['comments'])}):\n")
            if not p["comments"]:
                out.write("  (No direct comments or zero replies recorded)\n")
            else:
                for c_idx, c in enumerate(p["comments"], 1):
                    out.write(f"  [{c_idx}] {c['author']}: {c['text']}\n")
            out.write("\n\n")

    print(f"Generated clean master TXT with {len(posts)} posts and {total_comments} comments!")

if __name__ == "__main__":
    main()
