import { CHAIN } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import getChainSettings from "next-common/utils/consts/settings";
import { PeopleGlobalProvider } from "..";

const isPeopleSupported = !!getChainSettings(CHAIN).modules?.people;

const PeopleOverviewPageImpl = dynamicClientOnly(() =>
  import("next-common/components/people/judgement"),
);

export default function PeoplePage() {
  return (
    <PeopleGlobalProvider>
      <PeopleOverviewPageImpl />
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
