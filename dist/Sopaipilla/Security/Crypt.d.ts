export declare function setRandomSeed(seed: string): void;
export declare class Crypt {
    static encrypt(text: string): string;
    static decrypt(encryptedText: string): string;
    static hash(text: string): Promise<string>;
    static verify(text: string, hash: string): Promise<boolean>;
    static hashBcrypt(text: string): string;
    static verifyBcrypt(text: string, hash: string): boolean;
    static generateToken(length?: number): string;
}
//# sourceMappingURL=Crypt.d.ts.map