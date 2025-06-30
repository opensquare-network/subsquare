import Loading from "next-common/components/loading";
import { NavigationWrapper } from "../navigation/navigators";

export default function LoadingWhitelistNavigationBar() {
  return (
    <NavigationWrapper>
      <Loading size={20} />
    </NavigationWrapper>
  );
}
