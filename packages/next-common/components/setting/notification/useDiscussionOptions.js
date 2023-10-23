import React, { useEffect } from "react";
import { ToggleItem } from "./styled";
import Toggle from "../../toggle";
import { useCallback, useState } from "react";

export default function useDiscussionOptions({ disabled, ...data }) {
  const [reply, setReply] = useState(!!data.reply);
  const [mention, setMention] = useState(!!data.mention);

  const [isChanged, setIsChanged] = useState(false);
  useEffect(() => {
    setIsChanged(true);
  }, [reply, mention]);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
    }
  };

  const getDiscussionOptionValues = useCallback(
    () => ({ reply, mention }),
    [reply, mention],
  );

  const discussionOptionsComponent = (
    <div>
      <ToggleItem>
        <div>Notify me about comments on my posts</div>
        <Toggle
          disabled={disabled}
          isOn={reply}
          onToggle={changeGuard(setReply)}
        />
      </ToggleItem>
      <ToggleItem>
        <div>Notify me about mentions</div>
        <Toggle
          disabled={disabled}
          isOn={mention}
          onToggle={changeGuard(setMention)}
        />
      </ToggleItem>
    </div>
  );

  return {
    discussionOptionsComponent,
    getDiscussionOptionValues,
    isChanged,
  };
}
