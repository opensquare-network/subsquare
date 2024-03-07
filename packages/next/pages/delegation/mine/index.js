import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import MyDelegation from "next-common/components/delegation/my-delegation";
import DelegationLayout from "next-common/components/delegation/layout";

export default function MyDelegationPage() {
  return (
    <DelegationLayout>
      <MyDelegation />
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
