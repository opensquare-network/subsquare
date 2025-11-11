import ListLayout from "next-common/components/layout/ListLayout";
import { withCommonProps } from "next-common/lib";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import StakingOverviewSummary from "next-common/components/staking/overview/summary";
import NoWalletConnected from "next-common/components/noWalletConnected";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import AccountStaking from "next-common/components/staking/overview/accountStaking";
import { RelayChainApiProvider } from "next-common/context/relayChain";

const isStakingSupported = !!getChainSettings(CHAIN).modules?.staking;

export default function StakingPage() {
  const realAddress = useRealAddress();

  if (!isStakingSupported) {
    return null;
  }

  return (
    <RelayChainApiProvider>
      <ListLayout
        title={"Overview"}
        seoInfo={{ title: "" }}
        description={"An overview of your staking status, rewards."}
        summary={<StakingOverviewSummary />}
      >
        {!realAddress ? (
          <div className="h-full flex items-center justify-center">
            <NoWalletConnected text="Connect wallet to participate in staking." />
          </div>
        ) : (
          <AccountStaking />
        )}
      </ListLayout>
    </RelayChainApiProvider>
  );
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
