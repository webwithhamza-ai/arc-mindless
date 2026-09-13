import { ensureSchema, sql } from "@/lib/db";

const SUPPLY = 5555;
const MIN_MISSIONS = 2;
const EVM_RE = /^0x[a-fA-F0-9]{40}$/;
const HANDLE_RE = /^[A-Za-z0-9_]{1,15}$/;

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const twitterUsername = String(body?.twitterUsername || "").trim().replace(/^@/, "");
    const evmAddress = String(body?.evmAddress || "").trim();
    const followed = Boolean(body?.followed);
    const reposted = Boolean(body?.reposted);
    const liked = Boolean(body?.liked);
    const missionCount = [followed, reposted, liked].filter(Boolean).length;

    if (!HANDLE_RE.test(twitterUsername)) {
      return Response.json({ error: "Invalid X username" }, { status: 400 });
    }
    if (!EVM_RE.test(evmAddress)) {
      return Response.json({ error: "Invalid EVM address" }, { status: 400 });
    }
    if (missionCount < MIN_MISSIONS) {
      return Response.json({ error: `Complete at least ${MIN_MISSIONS} missions` }, { status: 400 });
    }

    await ensureSchema();

    const existing = await sql`
      SELECT spot_number FROM whitelist_entries WHERE evm_address = ${evmAddress}
    `;
    if (existing.length > 0) {
      return Response.json(
        { error: "This wallet is already registered for the whitelist." },
        { status: 409 }
      );
    }
    const spotNumber = Math.floor(Math.random() * SUPPLY) + 1;

    const [row] = await sql`
      INSERT INTO whitelist_entries
        (twitter_username, evm_address, followed, reposted, liked, spot_number, submitted_at)
      VALUES
        (${twitterUsername}, ${evmAddress}, ${followed}, ${reposted}, ${liked}, ${spotNumber}, now())
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
    if (err?.code === "23505") {
      // Unique-constraint race: two near-simultaneous submits for the same address.
      return Response.json(
        { error: "This wallet is already registered for the whitelist." },
        { status: 409 }
      );
    }
    return Response.json({ error: err.message || "Server error" }, { status: 503 });
  }
}
