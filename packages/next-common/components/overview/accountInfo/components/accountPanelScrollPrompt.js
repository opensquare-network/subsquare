import { DelegationPrompt } from "./useDelegationPrompt";
import { AvatarPrompt } from "./useSetAvatarPrompt";
import { AccountPanelScroll } from "next-common/components/scrollPrompt";
import { IdentityPrompt } from "./useSetIdentityPrompt";
import { MultisigPrompt } from "./useMultisigPrompt";
import AssetHubManagePrompt from "./useAssetHubManagePrompt";

export default function AccountPanelScrollPrompt() {
  return (
    <AccountPanelScroll
      items={[
        DelegationPrompt,
        AvatarPrompt,
        IdentityPrompt,
        MultisigPrompt,
        AssetHubManagePrompt,
      ]}
    />
  );
}
