import { useEffect, useState } from "react";
import useDelegationPrompt from "./useDelegationPrompt";
import useSetAvatarPrompt from "./useSetAvatarPrompt";
import { isEmpty } from "lodash-es";
import ScrollPrompt from "next-common/components/scrollPrompt";
import useSetIdentityPrompt from "./useSetIdentityPrompt";
import useMultisigPrompt from "./useMultisigPrompt";

export default function AccountPanelScrollPrompt() {
  const delegationPrompt = useDelegationPrompt();
  const setAvatarPrompt = useSetAvatarPrompt();
  const setIdentityPrompt = useSetIdentityPrompt();
  const multisigPrompt = useMultisigPrompt();

  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    setPrompts(
      [
        multisigPrompt,
        delegationPrompt,
        setAvatarPrompt,
        setIdentityPrompt,
      ].filter((item) => !isEmpty(item)),
    );
  }, [delegationPrompt, multisigPrompt, setAvatarPrompt, setIdentityPrompt]);

  return <ScrollPrompt prompts={prompts} />;
}
