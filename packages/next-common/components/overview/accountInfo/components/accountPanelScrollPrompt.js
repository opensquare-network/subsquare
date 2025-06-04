import { useEffect, useState } from "react";
import useDelegationPrompt from "./useDelegationPrompt";
import useSetAvatarPrompt from "./useSetAvatarPrompt";
import { isEmpty } from "lodash-es";
import ScrollPrompt from "next-common/components/scrollPrompt";
import useSetIdentityPrompt from "./useSetIdentityPrompt";

export default function AccountPanelScrollPrompt() {
  const delegationPrompt = useDelegationPrompt();
  const setAvatarPrompt = useSetAvatarPrompt();
  const setIdentityPrompt = useSetIdentityPrompt();

  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    setPrompts(
      [delegationPrompt, setAvatarPrompt, setIdentityPrompt].filter(
        (item) => !isEmpty(item),
      ),
    );
  }, [delegationPrompt, setAvatarPrompt, setIdentityPrompt]);

  return <ScrollPrompt prompts={prompts} />;
}
