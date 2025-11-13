import { S3Client } from '@aws-sdk/client-s3';

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const getFirstEnvValue = (envValue?: string | null) =>
  envValue?.split(',').map((value) => value.trim()).find(Boolean) || '';

const rawPublicUrl = getFirstEnvValue(process.env.R2_PUBLIC_URL);
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';

const encodeObjectKey = (objectKey: string) =>
  objectKey
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

const hostNeedsBucketPath = (hostname: string) =>
  hostname.endsWith('.r2.dev') || hostname.endsWith('.r2.cloudflarestorage.com');

const ensureBucketInPath = (url: URL) => {
  if (!R2_BUCKET_NAME) {
    return url;
  }

  const segments = url.pathname.split('/').filter(Boolean);
  if (segments[0] !== R2_BUCKET_NAME) {
    url.pathname = `/${[R2_BUCKET_NAME, ...segments].join('/')}`;
  }

  return url;
};

const getBaseOrigin = () => {
  if (rawPublicUrl) {
    return stripTrailingSlash(rawPublicUrl);
  }

  if (R2_ACCOUNT_ID) {
    return `https://pub-${R2_ACCOUNT_ID}.r2.dev`;
  }

  throw new Error('R2_PUBLIC_URL or R2_ACCOUNT_ID must be configured');
};

const getPublicBaseUrl = () => {
  const baseOrigin = getBaseOrigin();

  try {
    const parsed = new URL(baseOrigin);
    const hostnameRequiresBucket = hostNeedsBucketPath(parsed.hostname);
    const finalUrl = hostnameRequiresBucket ? ensureBucketInPath(parsed) : parsed;
    return stripTrailingSlash(finalUrl.toString());
  } catch (error) {
    if (!R2_BUCKET_NAME) {
      throw new Error('R2_BUCKET_NAME is not configured');
    }
    return stripTrailingSlash(`${baseOrigin}/${R2_BUCKET_NAME}`);
  }
};

const safeDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
};

const extractObjectKey = (url: URL) => {
  const pathSegments = url.pathname.split('/').filter(Boolean);
  if (pathSegments.length === 0) {
    return '';
  }

  if (R2_BUCKET_NAME) {
    const bucketIndex = pathSegments.indexOf(R2_BUCKET_NAME);
    if (bucketIndex !== -1) {
      return pathSegments.slice(bucketIndex + 1).join('/');
    }
  }

  return pathSegments.join('/');
};

const isR2Host = (hostname: string) =>
  hostname.endsWith('.r2.cloudflarestorage.com') || hostname.endsWith('.r2.dev');

export const buildR2ObjectPublicUrl = (objectKey: string) => {
  const baseUrl = getPublicBaseUrl();
  const encodedKey = encodeObjectKey(objectKey);
  return `${baseUrl}/${encodedKey}`;
};

export const normalizeR2ObjectUrl = (url?: string | null) => {
  if (!url) {
    return '';
  }

  if (!R2_BUCKET_NAME) {
    return url;
  }

  try {
    const parsed = new URL(url);
    if (!isR2Host(parsed.hostname)) {
      return url;
    }

    const objectKey = extractObjectKey(parsed);
    if (!objectKey) {
      return url;
    }

    return buildR2ObjectPublicUrl(safeDecodeURIComponent(objectKey));
  } catch (error) {
    return url;
  }
};

export const r2 = new S3Client({
  region: 'auto', // Región automática para R2
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});
