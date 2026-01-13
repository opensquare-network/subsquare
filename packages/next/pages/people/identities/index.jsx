import { withCommonProps } from "next-common/lib";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { PeopleGlobalProvider } from "..";

const isPeopleSupported = !!getChainSettings(CHAIN).modules?.people;

const PeopleIdentitiesPageImpl = dynamicClientOnly(() =>
  import("next-common/components/people/identities"),
);

export default function PeopleIdentitiesPage() {
  if (!isPeopleSupported) {
    return null;
  }

  return (
    <PeopleGlobalProvider>
      <PeopleIdentitiesPageImpl />
    </PeopleGlobalProvider>
  );
}

export const getServerSideProps = async (ctx) => {
  if (!isPeopleSupported) {
    return {
      notFound: true,
    };
  }

  return withCommonProps(async () => {
    return {
      props: {},
    };
  })(ctx);
};
