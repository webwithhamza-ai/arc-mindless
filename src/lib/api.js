// Talks to the Next.js route handlers under src/app/api/.

async function request(path, options) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export function submitWhitelist({ twitterUsername, evmAddress, followed, reposted, liked }) {
  return request("/whitelist", {
    method: "POST",
    body: JSON.stringify({ twitterUsername, evmAddress, followed, reposted, liked }),
  });
}

export function confirmSpot({ evmAddress, quoteLink }) {
  return request("/whitelist/confirm", {
    method: "POST",
    body: JSON.stringify({ evmAddress, quoteLink }),
  });
}

export function lookupWhitelist(evmAddress) {
  return request(`/whitelist/${encodeURIComponent(evmAddress)}`);
}
