export default function FellowshipMember() {
  return "Please visit `/user/[id]/fellowship`";
}

export const getServerSideProps = async (context) => {
  const { id } = context.query;

  return {
    redirect: {
      destination: `/user/${id}/fellowship`,
      permanent: false,
    },
  };
};
