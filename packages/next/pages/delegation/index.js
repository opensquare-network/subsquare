import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import DelegationLayout from "next-common/components/delegation/layout";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";

const DelegateContainer = dynamicClientOnly(() =>
  import("next-common/components/delegation/delegate/container"),
);

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
