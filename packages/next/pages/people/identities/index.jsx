import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { PeopleGlobalProvider } from "..";
import { getPeopleServerSideProps } from "next-common/components/people/common/getServerSideProps";

const isPeopleSupported = !!getChainSettings(CHAIN).modules?.people;

const PeopleIdentitiesPageImpl = dynamicClientOnly(() =>
  import("next-common/components/people/identities"),
);

export default function PeopleIdentitiesPage() {
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

  return await getPeopleServerSideProps(ctx);
};
