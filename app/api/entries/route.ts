export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store" };

export async function GET() {
  return Response.json({ mode: "local-storage", entries: {} }, { headers });
}

export async function POST() {
  return Response.json(
    { error: "FranAPP guarda las elecciones directamente en este dispositivo." },
    { status: 410, headers },
  );
}
