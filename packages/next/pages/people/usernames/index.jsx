import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { PeopleGlobalProvider } from "..";

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
