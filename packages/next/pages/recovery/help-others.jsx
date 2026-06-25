import Recovery from "next-common/components/recovery";
import NoWalletConnected from "next-common/components/assethubMigrationAssets/noWalletConnected";
import { withCommonProps } from "next-common/lib";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import getChainSettings from "next-common/utils/consts/settings";
import { CHAIN } from "next-common/utils/constants";

export default function HelpOthersPage() {
  const realAddress = useRealAddress();

  if (!realAddress) {
    return <NoWalletConnected />;
  }

  return <Recovery activeTab="help_others" />;
}

export const getServerSideProps = async (ctx) => {
  const { modules } = getChainSettings(CHAIN);
  if (!modules?.recovery) {
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
