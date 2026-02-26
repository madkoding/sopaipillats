export declare class Env {
    private static vars;
    static load(path?: string): void;
    static get(key: string, defaultValue?: string): string | undefined;
    static require(key: string): string;
    static getInt(key: string, defaultValue?: number): number | undefined;
    static getBool(key: string, defaultValue?: boolean): boolean | undefined;
    static all(): Record<string, string>;
    static has(key: string): boolean;
}
//# sourceMappingURL=Env.d.ts.map