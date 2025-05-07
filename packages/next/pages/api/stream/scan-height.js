export const runtime = "edge";

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const paramInterval = searchParams.get("interval") || 12000;
  const parsedInterval = parseInt(paramInterval, 10);
  if (isNaN(parsedInterval) || parsedInterval <= 0) {
    return new Response("Invalid interval", { status: 400 });
  }

  // Use interval no less than 6 seconds
  const minInterval = 6000;
  const interval = Math.max(parsedInterval, minInterval);

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  let aborted = false;

  const feedScanHeight = async () => {
    const resp = await fetch(
      new URL(
        "inspect/scan-height",
        process.env.NEXT_PUBLIC_BACKEND_API_END_POINT,
      ),
    );
    if (!resp.ok) {
      return;
    }
    const result = await resp.json();
    await writer.ready;
    writer.write(encoder.encode(JSON.stringify(result)));
  };

  const startEmitData = async () => {
    // eslint-disable-next-line no-constant-condition
    while (!aborted) {
      try {
        await feedScanHeight();
      } catch (e) {
        // ignore error
      }
      await new Promise((resolve) => {
        setTimeout(resolve, interval);
      });
    }
  };

  // Stop streaming when the client disconnects
  request.signal.addEventListener("abort", () => {
    aborted = true;
  });

  startEmitData();

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
