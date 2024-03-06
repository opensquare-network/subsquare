import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import DelegateContainer from "next-common/components/delegation/delegate/container";
import DelegationLayout from "next-common/components/delegation/layout";

export default function ReferendaPage() {
  return (
    <DelegationLayout>
      <DelegateContainer />
    </DelegationLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      ...tracksProps,
    },
  };
});
