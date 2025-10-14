// encryption.js
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY =
    process.env.REACT_APP_ENCRYPTION_KEY || "28778ab27c641f297b7ba4705a24e281";
function getKeyUtf8() {
    // Pad or slice key to 32 bytes for AES-256
    let keyUtf8 = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
    const keyWords = keyUtf8.words;
    const keySigBytes = keyUtf8.sigBytes;

    if (keySigBytes === 32) return keyUtf8;

    // Pad with zeros if shorter than 32 bytes
    if (keySigBytes < 32) {
        const zerosNeeded = 32 - keySigBytes;
        const zeroWords = new Array(Math.ceil(zerosNeeded / 4)).fill(0);
        const newWords = keyWords.concat(zeroWords);
        return CryptoJS.lib.WordArray.create(newWords, 32);
    }

    // Slice if longer than 32 bytes
    return CryptoJS.lib.WordArray.create(keyWords.slice(0, 8), 32); // 8 words * 4 bytes = 32 bytes
}

export function encryptUserId(userId) {
    const key = getKeyUtf8();
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(String(userId), key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    return JSON.stringify({
        iv: CryptoJS.enc.Base64.stringify(iv),
        content: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
    });
}
