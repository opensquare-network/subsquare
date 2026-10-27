import AssetInfo from "next-common/components/profile/bio/assetInfo";
import RightPanelContainer from "next-common/components/profile/bio/rightPanelContainer";
import VotesPowerPanel from "next-common/components/profile/OpenGovBio/votesPower";
import UserPapiAccountProvider from "next-common/context/user/papiAccount";
import { useChainSettings } from "next-common/context/chain";
import PanelLoading from "./panelLoading";

export default function Panels({ address, isResolving }) {
  const { modules } = useChainSettings();
  const hasReferenda = !!modules?.referenda;

  if (isResolving) {
    return (
      <RightPanelContainer>
        <PanelLoading />
        {hasReferenda && <PanelLoading />}
      </RightPanelContainer>
    );
  }

  return (
    <RightPanelContainer>
      <UserPapiAccountProvider address={address}>
        <AssetInfo address={address} />
        {hasReferenda && <VotesPowerPanel address={address} />}
      </UserPapiAccountProvider>
    </RightPanelContainer>
  );
}
