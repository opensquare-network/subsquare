export default function Member() {
  return null;
}

export function getServerSideProps(context) {
  const { res } = context;
  const { id } = context.query;

  res.statusCode = 302;
  res.setHeader("Location", `https://${process.env.CHAIN}.subscan.io/account/${id}`);
  res.end();

  return { props: {} };
};
