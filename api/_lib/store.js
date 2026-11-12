// Tiny JSON document store on a private Vercel Blob store.
import { put, get, list, del } from '@vercel/blob';

export async function readJson(pathname, fallback = null) {
  const res = await get(pathname, { access: 'private', useCache: false });
  if (!res) return fallback;
  return JSON.parse(await new Response(res.stream).text());
}

export async function writeJson(pathname, data, { create = false } = {}) {
  await put(pathname, JSON.stringify(data), {
    access: 'private', contentType: 'application/json',
    addRandomSuffix: false, allowOverwrite: !create, cacheControlMaxAge: 60,
  });
  return data;
}

export async function readAll(prefix) {
  const blobs = [];
  let cursor;
  do {
    const page = await list({ prefix, limit: 1000, cursor });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const out = [];
  for (let i = 0; i < blobs.length; i += 16) {
    const chunk = await Promise.all(blobs.slice(i, i + 16).map((b) => readJson(b.pathname).catch(() => null)));
    out.push(...chunk.filter(Boolean));
  }
  return out;
}

export const remove = (pathname) => del(pathname);

export const json = (data, status = 200, headers = {}) =>
  Response.json(data, { status, headers: { 'cache-control': 'no-store', ...headers } });
