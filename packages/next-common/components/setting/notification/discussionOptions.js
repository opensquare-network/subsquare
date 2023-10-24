import React from "react";
import { ToggleItem } from "./styled";
import Toggle from "../../toggle";
import { useState } from "react";
import { useDebounceAutoSaveDiscussionOptions } from "./common";

export default function DiscussionOptions({ disabled, ...data }) {
  const [reply, setReply] = useState(!!data.reply);
  const [mention, setMention] = useState(!!data.mention);

  const [isChanged, setIsChanged] = useState(false);

  const changeGuard = (setter) => (data) => {
    if (!disabled) {
      setter(data);
      setIsChanged(true);
    }
  };

  useDebounceAutoSaveDiscussionOptions(isChanged, {
    reply,
    mention,
  });

  return (
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
}
