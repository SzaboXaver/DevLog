import crypto from "node:crypto";

const algorithm = "aes-256-gcm";

const secretKey = process.env.TOKEN_ENCRYPTION_KEY;

if (!secretKey || Buffer.from(secretKey, "hex").length !== 32) {
    throw new Error("Invalid encryption key!");
}

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(
        algorithm,
        Buffer.from(secretKey!, "hex"),
        iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return [
        iv.toString("hex"),
        authTag.toString("hex"),
        encrypted
    ].join(":");
}

export function decrypt(encryptedData: string): string {
    const [ivHex, authTagHex, encryptedText] = encryptedData.split(":");

    const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(secretKey!, "hex"),
        Buffer.from(ivHex, "hex")
    );

    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}