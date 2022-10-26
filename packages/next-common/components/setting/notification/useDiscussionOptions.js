import React from "react";
import { Label, ToggleItem } from "./styled";
import Toggle from "../../toggle";
import { useCallback, useState } from "react";

export default function useDiscussionOptions({ saving, disabled, ...data }) {
  const [reply, setReply] = useState(data.reply);
  const [mention, setMention] = useState(data.mention);

  const isChanged = (
    data.reply !== reply ||
    data.mention !== mention
  );

  const changeGuard = (setter) => (data) => {
    if (!saving && !disabled) {
      setter(data);
    }
  };

  const getDiscussionOptionValues = useCallback(
    () => ({ reply, mention }),
    [reply, mention]
  );

  const discussionOptionsComponent = (
    <div>
      <Label>Discussion</Label>
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
