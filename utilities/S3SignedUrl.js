const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3Client = require("../config/s3");

const DEFAULT_EXPIRY_SECONDS = 60 * 60;
const MIN_EXPIRY_SECONDS = 60;
const MAX_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // SigV4 ceiling.

const signedUrlExpirySeconds = () => {
    const configured = parseInt(process.env.S3_SIGNED_URL_EXPIRY, 10);
    if (isNaN(configured)) return DEFAULT_EXPIRY_SECONDS;
    return Math.min(
        Math.max(configured, MIN_EXPIRY_SECONDS),
        MAX_EXPIRY_SECONDS,
    );
};

const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const objectUrlPrefixSource = () => {
    const bucket = process.env.S3_BUCKET_NAME;
    if (!bucket) return null;

    const escapedBucket = escapeForRegExp(bucket);
    const host = "s3[.-][a-z0-9.-]*amazonaws\\.com";
    return `https://(?:${escapedBucket}\\.${host}/|${host}/${escapedBucket}/)`;
};

let cachedPrefixPattern;
const prefixPattern = () => {
    if (cachedPrefixPattern === undefined) {
        const source = objectUrlPrefixSource();
        cachedPrefixPattern = source ? new RegExp(`^${source}`, "i") : null;
    }
    return cachedPrefixPattern;
};

// Returns the object key for a URL that points at our bucket, otherwise null.
const extractObjectKey = (url) => {
    if (typeof url !== "string" || !url.startsWith("https://")) return null;

    const pattern = prefixPattern();
    const prefix = pattern && url.match(pattern);
    if (!prefix) return null;

    const encodedKey = url.slice(prefix[0].length).split("?")[0].split("#")[0];
    if (!encodedKey) return null;

    try {
        return decodeURIComponent(encodedKey);
    } catch {
        return encodedKey;
    }
};

const signatureCache = new Map();
const MAX_CACHED_SIGNATURES = 5000;

const cachedSignature = (key) => {
    const entry = signatureCache.get(key);
    if (!entry) return null;
    if (entry.reusableUntil <= Date.now()) {
        signatureCache.delete(key);
        return null;
    }
    return entry.url;
};

const pruneSignatureCache = () => {
    if (signatureCache.size <= MAX_CACHED_SIGNATURES) return;

    const now = Date.now();
    signatureCache.forEach((entry, key) => {
        if (entry.reusableUntil <= now) signatureCache.delete(key);
    });

    const overflow = signatureCache.size - MAX_CACHED_SIGNATURES;
    if (overflow <= 0) return;
    [...signatureCache.keys()]
        .slice(0, overflow)
        .forEach((key) => signatureCache.delete(key));
};

exports.signObjectKey = async (key) => {
    const cached = cachedSignature(key);
    if (cached) return cached;

    const expiresIn = signedUrlExpirySeconds();
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn });

    signatureCache.set(key, {
        url,
        reusableUntil: Date.now() + (expiresIn / 2) * 1000,
    });
    pruneSignatureCache();
    return url;
};

exports.invalidateSignedUrl = (urlOrKey) => {
    const key = extractObjectKey(urlOrKey) ?? urlOrKey;
    signatureCache.delete(key);
};

const signKeys = async (keys) => {
    const signed = await Promise.all(
        [...keys].map((key) => exports.signObjectKey(key)),
    );
    return new Map([...keys].map((key, index) => [key, signed[index]]));
};

const isPlainObject = (value) => {
    if (value === null || typeof value !== "object") return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
};

const collectKeys = (value, keys) => {
    if (typeof value === "string") {
        const key = extractObjectKey(value);
        if (key) keys.add(key);
        return;
    }
    if (Array.isArray(value)) {
        value.forEach((item) => collectKeys(item, keys));
        return;
    }
    if (isPlainObject(value)) {
        Object.values(value).forEach((item) => collectKeys(item, keys));
    }
};

const replaceKeys = (value, signedByKey) => {
    if (typeof value === "string") {
        const key = extractObjectKey(value);
        return key ? (signedByKey.get(key) ?? value) : value;
    }
    if (Array.isArray(value)) {
        return value.map((item) => replaceKeys(item, signedByKey));
    }
    if (isPlainObject(value)) {
        return Object.fromEntries(
            Object.entries(value).map(([field, item]) => [
                field,
                replaceKeys(item, signedByKey),
            ]),
        );
    }
    return value;
};

exports.signS3UrlsDeep = async (payload) => {
    const keys = new Set();
    collectKeys(payload, keys);
    if (keys.size === 0) return payload;

    return replaceKeys(payload, await signKeys(keys));
};

// Same prefix, followed by everything up to the end of the attribute value.
const htmlUrlPattern = () =>
    new RegExp(`${objectUrlPrefixSource()}[^\\s"'<>)]*`, "gi");

// Same substitution for the HTML templates.
exports.signS3UrlsInHtml = async (html) => {
    if (typeof html !== "string" || !prefixPattern()) return html;

    const matches = html.match(htmlUrlPattern());
    if (!matches) return html;

    const keys = new Set();
    matches.forEach((url) => {
        const key = extractObjectKey(url);
        if (key) keys.add(key);
    });
    if (keys.size === 0) return html;

    const signedByKey = await signKeys(keys);
    return html.replace(htmlUrlPattern(), (url) => {
        const key = extractObjectKey(url);
        return key ? (signedByKey.get(key) ?? url) : url;
    });
};

exports.extractObjectKey = extractObjectKey;
