import { useEffect, useState } from "react";
import useDelegationPrompt from "./useDelegationPrompt";
import useSetAvatarPrompt from "./useSetAvatarPrompt";
import { isEmpty } from "lodash-es";
import ScrollPrompt from "next-common/components/scrollPrompt";

export default function AccountPanelScrollPrompt() {
  const delegationPrompt = useDelegationPrompt();
  const setAvatarPrompt = useSetAvatarPrompt();

  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    setPrompts(
      [delegationPrompt, setAvatarPrompt].filter((item) => !isEmpty(item)),
    );
  }, [delegationPrompt, setAvatarPrompt]);

  return <ScrollPrompt prompts={prompts} />;
}
