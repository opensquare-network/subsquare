export default async function handler(req, res) {
  const { interval: paramInterval = 12000 } = req.query;
  const parsedInterval = parseInt(paramInterval, 10);
  if (isNaN(parsedInterval) || parsedInterval <= 0) {
    res.status(400).send("Invalid interval");
    return;
  }

  // Use interval no less than 6 seconds
  const minInterval = 6000;
  const interval = Math.max(parsedInterval, minInterval);
  const encoder = new TextEncoder();
  let aborted = false;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

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
    res.write(encoder.encode(JSON.stringify(result)));
    res.flush();
  };

  res.on("close", () => {
    aborted = true;
  });

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
}
