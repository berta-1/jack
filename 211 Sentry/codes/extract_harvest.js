const fs = require('fs');
const readline = require('readline');

const path = "C:/Users/ademt/.gemini/antigravity/brain/87144175-ef60-4650-b360-86ba9c3dd0f7/.system_generated/logs/transcript_full.jsonl";
const fileStream = fs.createReadStream(path);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineNum = 0;
rl.on('line', (line) => {
  lineNum++;
  try {
    const data = JSON.parse(line);
    if (data.type === 'USER_INPUT' && typeof data.content === 'string') {
      if (data.content.includes('"targetAccount": "Deng Clinton (@wrong.dee.7)"')) {
        console.log(`Found Deng Clinton harvest at line ${lineNum}, content length: ${data.content.length}`);
        // Extract JSON array
        const start = data.content.indexOf('[');
        const end = data.content.lastIndexOf(']');
        if (start !== -1 && end !== -1) {
          const jsonStr = data.content.substring(start, end + 1);
          const parsed = JSON.parse(jsonStr);
          console.log(`Successfully parsed ${parsed.length} posts!`);
          fs.writeFileSync("c:/Tahir/Mission-1.0/211 Sentry/raw_archive/DENG_CLINTON_PERSONAL_HARVEST_317.json", JSON.stringify(parsed, null, 2), "utf8");
          console.log("Saved to c:/Tahir/Mission-1.0/211 Sentry/raw_archive/DENG_CLINTON_PERSONAL_HARVEST_317.json");
        }
      }
    }
  } catch(e) {
    console.error(`Error on line ${lineNum}:`, e.message);
  }
});

