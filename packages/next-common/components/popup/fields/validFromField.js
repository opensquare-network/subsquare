import Input from "next-common/components/input";
import PopupLabel from "../label";
import Toggle from "next-common/components/toggle";
import { useState, useEffect } from "react";
import Link from "next/link";
import { InfoMessage } from "next-common/components/setting/styled";

const PROMPT_WIKI_LINK =
  "https://wiki.polkadot.network/docs/learn-guides-treasury#specifying-validfrom-optional";
const PROMPT_DISABLE_CONTENT =
  "The fund can be claimed immediately after proposal execution.";
const PROMPT_EDITABLE_CONTENT =
  "The block number from which the spend can be claimed.";

function ValidFromFieldToggleSwitch({ isEditable, setIsEditable }) {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="text-textSecondary text12Medium whitespace-nowrap">
        Edit Mode
      </span>
      <Toggle
        size="small"
        isOn={isEditable}
        onToggle={() => setIsEditable(!isEditable)}
      />
    </div>
  );
}

function ValidFromFieldPrompt({ isEditable }) {
  const content = isEditable ? PROMPT_EDITABLE_CONTENT : PROMPT_DISABLE_CONTENT;
  return (
    <InfoMessage className="mt-[8px]">
      <span className="text-textSecondary text14Medium">
        {content}&nbsp;
        <Link className="underline" href={PROMPT_WIKI_LINK}>
          Wiki
        </Link>
        ↗
      </span>
    </InfoMessage>
  );
}

export default function ValidFromField({ title = "", value, setValue }) {
  const [isEditable, setIsEditable] = useState(false);
  useEffect(() => {
    setValue(isEditable ? "" : "None");
  }, [isEditable, setValue]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value.trim();
    setValue(inputValue);
  };

  const placeholder = isEditable ? "Please input a block height..." : "";
  return (
    <div>
      <div className="flex justify-between items-center mb-[8px]">
        <PopupLabel text={title} />
        <ValidFromFieldToggleSwitch
          isEditable={isEditable}
          setIsEditable={setIsEditable}
        />
      </div>
      <Input
        value={value}
        placeholder={placeholder}
        symbol="Block Height"
        onChange={handleInputChange}
        disabled={!isEditable}
      />
      <ValidFromFieldPrompt isEditable={isEditable} />
    </div>
  );
}
