import { withCommonProps } from "next-common/lib";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { PeopleGlobalProvider } from "..";

const isPeopleSupported = !!getChainSettings(CHAIN).modules?.people;

const PeopleRegistrarsPageImpl = dynamicClientOnly(() =>
  import("next-common/components/people/registrars"),
);

export default function PeopleRegistrarsPage() {
  if (!isPeopleSupported) {
    return null;
  }

  return (
    <PeopleGlobalProvider>
      <PeopleRegistrarsPageImpl />
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
