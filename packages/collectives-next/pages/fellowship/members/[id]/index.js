export default function FellowshipMember() {
  return "Please visit `/user/[id]/fellowship`";
}

export const getServerSideProps = async (context) => {
  const { id } = context.query;

  return {
    redirect: {
      // The id arrives decoded, so anything that is not URL-safe has to go back through
      // encodeURIComponent: a path a visitor pasted with Chinese text glued to it produced a
      // Location header the server refuses, which surfaced as a 500 instead of a redirect.
      destination: `/user/${encodeURIComponent(id)}/fellowship`,
      permanent: false,
    },
  };
};
