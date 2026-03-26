import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import DelegationLayout from "next-common/components/delegation/layout";
import MyDelegation from "next-common/components/delegation/my-delegation";
import { PapiProvider } from "next-common/context/papi";

export default function MyDelegationPage() {
  return (
    <DelegationLayout>
      <PapiProvider>
        <MyDelegation />
      </PapiProvider>
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
