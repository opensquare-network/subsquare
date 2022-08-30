export default function Member() {
  return null;
}

export function getServerSideProps(context) {
  const { res } = context;
  const { id } = context.query;

  //todo: remove this & use a next.config
  res.statusCode = 302;
  res.setHeader("Location", `/user/${id}`);
  res.end();

  return { props: {} };
}
