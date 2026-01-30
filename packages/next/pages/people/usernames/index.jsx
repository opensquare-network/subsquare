import { getPeopleServerSideProps } from "next-common/components/people/common/getServerSideProps";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { PeopleGlobalProvider } from "..";
import getChainSettings from "next-common/utils/consts/settings";
import { CHAIN } from "next-common/utils/constants";

const isPeopleSupported = !!getChainSettings(CHAIN).modules?.people;

const PeopleUsernamesPageImpl = dynamicClientOnly(() =>
  import("next-common/components/people/usernames"),
);

export default function PeopleUsernamesPage() {
  return (
    <PeopleGlobalProvider>
      <PeopleUsernamesPageImpl />
    </PeopleGlobalProvider>
  );
}

export const getServerSideProps = async (ctx) => {
  if (!isPeopleSupported) {
    return {
      notFound: true,
    };
  }

  return await getPeopleServerSideProps(ctx);
};
