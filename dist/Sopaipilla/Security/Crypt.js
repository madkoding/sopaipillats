import { createCipheriv, createDecipheriv, randomBytes, createHash, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 32;
let randomSeed;
export function setRandomSeed(seed) {
    randomSeed = seed;
}
function getKey() {
    if (!randomSeed) {
        throw new Error('RANDOM_SEED is not defined. Set it using Crypt.setRandomSeed() before using encryption.');
    }
    return createHash('sha256').update(randomSeed).digest();
}
export class Crypt {
    static encrypt(text) {
        const key = getKey();
        const iv = randomBytes(IV_LENGTH);
        const cipher = createCipheriv(ALGORITHM, key, iv);
        const encrypted = Buffer.concat([
            cipher.update(text, 'utf8'),
            cipher.final(),
        ]);
        const tag = cipher.getAuthTag();
        return Buffer.concat([iv, tag, encrypted]).toString('base64');
    }
    static decrypt(encryptedText) {
        const key = getKey();
        const raw = Buffer.from(encryptedText, 'base64');
        if (raw.length < IV_LENGTH + TAG_LENGTH) {
            throw new Error('Invalid encrypted payload');
        }
        const iv = raw.subarray(0, IV_LENGTH);
        const tag = raw.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
        const encrypted = raw.subarray(IV_LENGTH + TAG_LENGTH);
        const decipher = createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);
        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ]);
        return decrypted.toString('utf8');
    }
    static async hash(text) {
        const salt = randomBytes(SALT_LENGTH);
        const derivedKey = await promisify(scrypt)(text, salt, KEY_LENGTH);
        return `${salt.toString('base64')}:${derivedKey.toString('base64')}`;
    }
    static async verify(text, hash) {
        const [saltB64, keyB64] = hash.split(':');
        const salt = Buffer.from(saltB64, 'base64');
        const storedKey = Buffer.from(keyB64, 'base64');
        const derivedKey = await promisify(scrypt)(text, salt, KEY_LENGTH);
        try {
            return timingSafeEqual(derivedKey, storedKey);
        }
        catch {
            return false;
        }
    }
    static hashBcrypt(text) {
        const bcrypt = require('bcrypt');
        return bcrypt.hashSync(text, 10);
    }
    static verifyBcrypt(text, hash) {
        const bcrypt = require('bcrypt');
        return bcrypt.compareSync(text, hash);
    }
    static generateToken(length = 32) {
        return randomBytes(length).toString('hex');
    }
}
//# sourceMappingURL=Crypt.js.map