// generate_mock.js
// Node.js script: sinh mock data (email,type,password) và ghi vào data.txt
// Usage: node generate_mock.js [count]
// Default count = 10000

const fs = require("fs");
const crypto = require("crypto");

const count = Number(process.argv[2] || 10000);
const outPath = "data.txt";

// Một vài tên miền và tên mẫu để dễ đọc
const personalDomains = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
];
const disposableDomains = [
  "tempmail.com",
  "mailinator.com",
  "disposablemail.com",
  "sharklasers.com",
];
const firstNames = [
  "anh",
  "bao",
  "chi",
  "dung",
  "hoang",
  "khanh",
  "lan",
  "minh",
  "ngoc",
  "pham",
  "quang",
  "thuy",
  "trang",
  "tuan",
  "vy",
];
const lastNames = [
  "nguyen",
  "tran",
  "le",
  "pham",
  "ho",
  "vu",
  "ngo",
  "duong",
  "do",
  "bui",
];

// helper: lấy số nguyên ngẫu nhiên trong [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// helper: tạo chuỗi ngẫu nhiên từ một tập ký tự
function randFromCharset(length, charset) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return out;
}

// tạo password phức tạp: bắt buộc 1 ký tự hoa, 1 ký tự thường, 1 số, 1 special
function generatePassword() {
  const lowers = "abcdefghijklmnopqrstuvwxyz";
  const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const special = "!@#$%^&*()-_=+[]{}<>?";
  const len = randInt(8, 16);

  // bắt đầu bằng đảm bảo các loại ký tự có mặt
  const parts = [
    lowers.charAt(randInt(0, lowers.length - 1)),
    uppers.charAt(randInt(0, uppers.length - 1)),
    digits.charAt(randInt(0, digits.length - 1)),
    special.charAt(randInt(0, special.length - 1)),
  ];

  // phần còn lại lấy từ tất cả ký tự
  const all = lowers + uppers + digits + special;
  while (parts.join("").length < len) {
    parts.push(all.charAt(randInt(0, all.length - 1)));
  }

  // shuffle parts
  for (let i = parts.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [parts[i], parts[j]] = [parts[j], parts[i]];
  }

  return parts.join("");
}

// tạo email theo 2 loại: personal hoặc disposable
function generateEmail(type) {
  if (type === "personal") {
    // firstname.lastname + maybe number @ domain
    const first = firstNames[randInt(0, firstNames.length - 1)];
    const last = lastNames[randInt(0, lastNames.length - 1)];
    const sep = Math.random() < 0.5 ? "." : "_";
    const maybeNum = Math.random() < 0.35 ? String(randInt(1, 9999)) : "";
    const domain = personalDomains[randInt(0, personalDomains.length - 1)];
    return `${first}${sep}${last}${maybeNum}@${domain}`;
  } else {
    // disposable: randomstring@disposabledomain
    const local = randFromCharset(
      randInt(6, 12),
      "abcdefghijklmnopqrstuvwxyz0123456789"
    );
    const domain = disposableDomains[randInt(0, disposableDomains.length - 1)];
    return `${local}@${domain}`;
  }
}

// open writable stream
const ws = fs.createWriteStream(outPath, { flags: "w" });

// write header (nếu muốn CSV header)
ws.write("email,type,password\n", "utf8");

let i = 0;
function writeChunk() {
  let ok = true;
  while (i < count && ok) {
    i++;
    const type = Math.random() < 0.5 ? "personal" : "disposable";
    const email = generateEmail(type);
    const password = generatePassword();

    // escape nếu cần (ở đây dùng CSV đơn giản, email/password không chứa dấu phẩy thường)
    const line = `${email},${type},${password}\n`;

    // if stream buffer full, wait for drain
    ok = ws.write(line, "utf8");

    if (i % 1000 === 0 || i === count) {
      console.log(`Generated ${i}/${count}`);
    }
  }

  if (i < count) {
    // buffer đầy, chờ drain
    ws.once("drain", writeChunk);
  } else {
    ws.end();
  }
}

ws.on("finish", () => {
  console.log(`Done. Wrote ${count} records to ${outPath}`);
});

ws.on("error", (err) => {
  console.error("Write stream error:", err);
});

writeChunk();
