import ListLayout from "next-common/components/layout/ListLayout";
import { withCommonProps } from "next-common/lib";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import StakingOverviewSummary from "next-common/components/staking/overview/summary";
import NoWalletConnected from "next-common/components/noWalletConnected";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import AccountStaking from "next-common/components/staking/overview/accountStaking";
import AccountNomination from "next-common/components/staking/overview/accountNomination";
import { RelayChainApiProvider } from "next-common/context/relayChain";
import { MyPoolProvider, useMyPool } from "next-common/context/staking/myPool";
import { MyStakingLedgerProvider } from "next-common/context/staking/myStakingLedger";
import { useMyStakingLedger } from "next-common/context/staking/myStakingLedger";
import Loading from "next-common/components/loading";

const isStakingSupported = !!getChainSettings(CHAIN).modules?.staking;

function MyStaking() {
  const { poolMember, loading: isMyPoolLoading } = useMyPool();
  const { nominators, loading: isMyStakingLedgerLoading } =
    useMyStakingLedger();

  const loading = isMyPoolLoading || isMyStakingLedgerLoading;

  if (loading) {
    return (
      <div className="flex justify-center">
        <Loading size={20} />
      </div>
    );
  }

  if (poolMember) {
    return <AccountStaking />;
  }

  if (nominators) {
    return <AccountNomination />;
  }

  return (
    <>
      <AccountStaking />
      <AccountNomination />
    </>
  );
}

export default function StakingPage() {
  const realAddress = useRealAddress();

  if (!isStakingSupported) {
    return null;
  }

  return (
    <RelayChainApiProvider>
      <MyPoolProvider>
        <MyStakingLedgerProvider>
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
              <div className="space-y-6">
                <MyStaking />
              </div>
            )}
          </ListLayout>
        </MyStakingLedgerProvider>
      </MyPoolProvider>
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
