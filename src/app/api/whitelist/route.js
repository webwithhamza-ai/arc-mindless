import { ensureSchema, sql } from "@/lib/db";

const SUPPLY = 5555;
const EVM_RE = /^0x[a-fA-F0-9]{40}$/;
const HANDLE_RE = /^[A-Za-z0-9_]{1,15}$/;

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const twitterUsername = String(body?.twitterUsername || "").trim().replace(/^@/, "");
    const evmAddress = String(body?.evmAddress || "").trim();
    const likedRetweeted = Boolean(body?.likedRetweeted);

    if (!HANDLE_RE.test(twitterUsername)) {
      return Response.json({ error: "Invalid X username" }, { status: 400 });
    }
    if (!EVM_RE.test(evmAddress)) {
      return Response.json({ error: "Invalid EVM address" }, { status: 400 });
    }
    if (!likedRetweeted) {
      return Response.json({ error: "Like & retweet step not completed" }, { status: 400 });
    }

    await ensureSchema();

    const existing = await sql`
      SELECT spot_number FROM whitelist_entries WHERE evm_address = ${evmAddress}
    `;
    const spotNumber = existing[0]?.spot_number ?? Math.floor(Math.random() * SUPPLY) + 1;

    const [row] = await sql`
      INSERT INTO whitelist_entries (twitter_username, evm_address, liked_retweeted, spot_number, submitted_at)
      VALUES (${twitterUsername}, ${evmAddress}, ${likedRetweeted}, ${spotNumber}, now())
      ON CONFLICT (evm_address) DO UPDATE SET
        twitter_username = EXCLUDED.twitter_username,
        liked_retweeted = EXCLUDED.liked_retweeted,
        submitted_at = now()
      RETURNING twitter_username, evm_address, spot_number, quote_link
    `;

    return Response.json({
      twitterUsername: row.twitter_username,
      evmAddress: row.evm_address,
      spotNumber: row.spot_number,
      quoteLink: row.quote_link,
    });
  } catch (err) {
    console.error("[POST /api/whitelist]", err);
    return Response.json({ error: err.message || "Server error" }, { status: 503 });
  }
}
