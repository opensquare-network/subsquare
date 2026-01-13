import { withCommonProps } from "next-common/lib";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import PoolsContent from "next-common/components/staking/pools";

const isStakingSupported = !!getChainSettings(CHAIN).modules?.staking;

export default function NominationPoolsPage() {
  if (!isStakingSupported) {
    return null;
  }

  return <PoolsContent />;
}

export const getServerSideProps = async (ctx) => {
  if (!isStakingSupported) {
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
