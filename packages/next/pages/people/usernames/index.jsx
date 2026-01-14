import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { PeopleGlobalProvider } from "..";
import getChainSettings from "next-common/utils/consts/settings";
import { CHAIN } from "next-common/utils/constants";
export { getServerSideProps } from "../index";

const PeopleUsernamesPageImpl = dynamicClientOnly(() =>
  import("next-common/components/people/usernames"),
);

const isPeopleSupported = !!getChainSettings(CHAIN).modules?.people;

export default function PeopleUsernamesPage() {
  if (!isPeopleSupported) {
    return null;
  }

  return (
    <PeopleGlobalProvider>
      <PeopleUsernamesPageImpl />
    </PeopleGlobalProvider>
  );
}
