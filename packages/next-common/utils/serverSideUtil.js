export function to404(context) {
  const { res } = context;
  res.statusCode = 302;
  res.setHeader("Location", `/404`);
  return res.end();
}
