import { isNil } from "lodash-es";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import StakingHeader from "./stakingHeader";
import StakingBalance from "./stakingBalance";
import Divider from "next-common/components/styled/layout/divider";

export default function AccountStaking() {
  const { width } = useWindowSize();

  if (isNil(width)) {
    return null;
  }

  return (
    <NeutralPanel className="p-6 space-y-4">
      <StakingHeader width={width} />
      <Divider />
      <StakingBalance />
    </NeutralPanel>
  );
}
