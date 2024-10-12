import Input from "next-common/components/input";
import PopupLabel from "../label";
import Toggle from "next-common/components/toggle";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  InfoMessage,
  WarningMessage,
} from "next-common/components/setting/styled";
import { SystemWarning } from "@osn/icons/subsquare";
import { useBlockHeight } from "next-common/hooks/common/useBlockHeight";
import BigNumber from "bignumber.js";
import { useDebounce } from "react-use";

const PROMPT_WIKI_LINK =
  "https://wiki.polkadot.network/docs/learn-guides-treasury#specifying-validfrom-optional";
const PROMPT_DISABLE_CONTENT =
  "The fund can be claimed immediately after proposal execution.";
const PROMPT_EDITABLE_CONTENT =
  "The block number from which the spend can be claimed.";
const WARNING_CONTENT =
  "We suggest a future block height in case of the payment expiration.";

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

function ValidFromFieldWarning() {
  return (
    <WarningMessage className="mt-[8px]">
      <div className="flex items-center flex-start gap-[8px] grow">
        <SystemWarning width={20} height={20} />
        <span className="text14Medium">{WARNING_CONTENT}</span>
      </div>
    </WarningMessage>
  );
}

export default function ValidFromField({ title = "", value, setValue }) {
  const [isEditable, setIsEditable] = useState(false);
  const [shouldShowWarning, setShouldShowWarning] = useState(false);
  const latestHeight = useBlockHeight();

  useEffect(() => {
    setValue(isEditable ? "" : "None");
  }, [isEditable, setValue]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value.trim();
    setValue(inputValue);
  };

  useDebounce(
    () => {
      if (isEditable && value && /^\d+$/.test(value)) {
        const inputNumber = new BigNumber(value);
        const latestHeightBN = new BigNumber(latestHeight);

        setShouldShowWarning(inputNumber.lt(latestHeightBN));
      } else {
        setShouldShowWarning(false);
      }
    },
    500,
    [value, isEditable, latestHeight],
  );

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
      {shouldShowWarning && <ValidFromFieldWarning />}
    </div>
  );
}
