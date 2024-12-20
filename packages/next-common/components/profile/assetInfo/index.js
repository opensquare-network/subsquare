import AssetDisplay from "./assetDisplay";
import UserAccountProvider, {
  useUserAccountInfo,
} from "next-common/context/user/account";

export default function AssetInfo({ address }) {
  return (
    <UserAccountProvider address={address}>
      <AssetInfoImpl />
    </UserAccountProvider>
  );
}

function AssetInfoImpl() {
  const { info: accountInfo } = useUserAccountInfo();

  if (!accountInfo) {
    return null;
  }

  return <AssetDisplay accountInfo={accountInfo} />;
}
