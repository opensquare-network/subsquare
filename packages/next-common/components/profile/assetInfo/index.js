import AssetDisplay from "./assetDisplay";
import UserAccountDataProvider, {
  useUserAccountInfo,
} from "next-common/context/user/accountData";

export default function AssetInfo({ address }) {
  return (
    <UserAccountDataProvider address={address}>
      <AssetInfoImpl />
    </UserAccountDataProvider>
  );
}

function AssetInfoImpl() {
  const { info: accountInfo } = useUserAccountInfo();

  if (!accountInfo) {
    return null;
  }

  return <AssetDisplay accountInfo={accountInfo} />;
}
