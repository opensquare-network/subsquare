import { useEffect, useState } from "react";
import useDelegationPrompt from "./useDelegationPrompt";
import useSetAvatarPrompt from "./useSetAvatarPrompt";
import { isEmpty } from "lodash-es";
import ScrollPrompt from "next-common/components/scrollPrompt";
import useSetIdentityPrompt from "./useSetIdentityPrompt";
import useMultisigPrompt from "./useMultisigPrompt";
import useAssetHubManagePrompt from "./useAssetHubManagePrompt";
import { AssetHubMetadataProvider } from "../context/assetHubMetadataContext";

export default function AccountPanelScrollPrompt() {
  return (
    <AssetHubMetadataProvider>
      <AccountPanelScrollPromptImpl />
    </AssetHubMetadataProvider>
  );
}

function AccountPanelScrollPromptImpl() {
  const delegationPrompt = useDelegationPrompt();
  const setAvatarPrompt = useSetAvatarPrompt();
  const setIdentityPrompt = useSetIdentityPrompt();
  const multisigPrompt = useMultisigPrompt();
  const assetHubManagePrompt = useAssetHubManagePrompt();

  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    setPrompts(
      [
        multisigPrompt,
        delegationPrompt,
        setAvatarPrompt,
        setIdentityPrompt,
        assetHubManagePrompt,
      ].filter((item) => !isEmpty(item)),
    );
  }, [
    assetHubManagePrompt,
    delegationPrompt,
    multisigPrompt,
    setAvatarPrompt,
    setIdentityPrompt,
  ]);

  return (
    <ScrollPrompt
      prompts={prompts}
      setPrompts={setPrompts}
      pageSize={prompts.length > 2 ? 2 : 1}
    />
  );
}
