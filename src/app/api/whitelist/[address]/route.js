import { ensureSchema, sql } from "@/lib/db";

const EVM_RE = /^0x[a-fA-F0-9]{40}$/;

export async function GET(_req, { params }) {
  try {
    const { address } = await params;
    const evmAddress = String(address || "").trim();
    if (!EVM_RE.test(evmAddress)) {
      return Response.json({ error: "Invalid EVM address" }, { status: 400 });
    }

    await ensureSchema();

    const [row] = await sql`
      SELECT twitter_username, evm_address, spot_number, quote_link
      FROM whitelist_entries WHERE evm_address = ${evmAddress}
    `;
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });

    return Response.json({
      twitterUsername: row.twitter_username,
      evmAddress: row.evm_address,
      spotNumber: row.spot_number,
      quoteLink: row.quote_link,
    });
  } catch (err) {
    console.error("[GET /api/whitelist/:address]", err);
    return Response.json({ error: err.message || "Server error" }, { status: 503 });
  }
}
