import NoWalletConnected from "next-common/components/assethubMigrationAssets/noWalletConnected";
import { withCommonProps } from "next-common/lib";
import useExistentialDeposit from "next-common/utils/hooks/chain/useExistentialDeposit";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import AssethubMigrationAssets from "next-common/components/assethubMigrationAssets";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default function AssetsPage() {
  const realAddress = useRealAddress();
  useExistentialDeposit();

  if (!realAddress) {
    return <NoWalletConnected />;
  }

  return <AssethubMigrationAssets />;
}

export const getServerSideProps = async (ctx) => {
  if (!isAssetHubMigrated()) {
    return {
      notFound: true,
    };
  }

  const tracksProps = await fetchOpenGovTracksProps();

  return withCommonProps(async () => {
    return {
      props: {
        ...tracksProps,
      },
    };
  })(ctx);
};
