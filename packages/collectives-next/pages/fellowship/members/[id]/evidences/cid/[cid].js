import EvidencePage from "next-common/components/pages/fellowship/member/evidence";

export default EvidencePage;

export function getServerSideProps(context) {
  const { cid, id: member } = context.params;
  return {
    props: {
      cid,
      member,
    },
  };
}
