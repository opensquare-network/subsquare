export const EMPTY_SERVER_PROPS = {props:{}};

export function to404(context) {
  const { res } = context;
  res.statusCode = 302;
  res.setHeader("Location", `/404`);
  res.end();
  return EMPTY_SERVER_PROPS;
}
