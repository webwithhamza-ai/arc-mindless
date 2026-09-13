import { ensureSchema, sql } from "@/lib/db";

const EVM_RE = /^0x[a-fA-F0-9]{40}$/;
const TWEET_LINK_RE = /^https?:\/\/(www\.)?(twitter|x)\.com\/[A-Za-z0-9_]{1,15}\/status\/\d+/;

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const evmAddress = String(body?.evmAddress || "").trim();
    const quoteLink = String(body?.quoteLink || "").trim();

    if (!EVM_RE.test(evmAddress)) {
      return Response.json({ error: "Invalid EVM address" }, { status: 400 });
    }
    if (!TWEET_LINK_RE.test(quoteLink)) {
      return Response.json({ error: "Invalid quote tweet link" }, { status: 400 });
    }

    await ensureSchema();

    const [row] = await sql`
      UPDATE whitelist_entries
      SET quote_link = ${quoteLink}, confirmed_at = now()
      WHERE evm_address = ${evmAddress}
      RETURNING twitter_username, evm_address, spot_number, quote_link
    `;

    if (!row) {
      return Response.json({ error: "No whitelist entry for that address yet" }, { status: 404 });
    }

    return Response.json({
      twitterUsername: row.twitter_username,
      evmAddress: row.evm_address,
      spotNumber: row.spot_number,
      quoteLink: row.quote_link,
    });
  } catch (err) {
    console.error("[POST /api/whitelist/confirm]", err);
    return Response.json({ error: err.message || "Server error" }, { status: 503 });
  }
}
