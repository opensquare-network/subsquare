import Input from "next-common/lib/input";
import PopupLabel from "../label";
import { useCallback, useState } from "react";
import Link from "next/link";
import {
  InfoMessage,
  WarningMessage,
} from "next-common/components/setting/styled";
import { SystemWarning } from "@osn/icons/subsquare";
import useChainOrScanHeight from "next-common/hooks/height";
import BigNumber from "bignumber.js";
import { useDebounce } from "react-use";
import DateOnlySelectModal from "next-common/components/calendar/dateSelectModal/dateOnlySelectModal";
import { useChainSettings } from "next-common/context/chain";
import dayjs from "dayjs";
import IconButton from "next-common/components/iconButton";
import Select from "next-common/components/select";
import NumberInput from "next-common/lib/input/number";

const PROMPT_WIKI_LINK =
  "https://wiki.polkadot.network/docs/learn-guides-treasury#specifying-validfrom-optional";
const PROMPT_DISABLE_CONTENT =
  "The fund can be claimed immediately after proposal execution.";
const PROMPT_EDITABLE_CONTENT =
  "The block number from which the spend can be claimed.";
const WARNING_CONTENT =
  "We suggest a future block height in case of the payment expiration.";

function ValidFromFieldPrompt({ children }) {
  return (
    <InfoMessage className="mt-[8px]">
      <span className="text-textSecondary text14Medium">
        {children}&nbsp;
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

const modeOptions = [
  { label: <span>Date</span>, value: "date" },
  {
    label: <span className="whitespace-nowrap">Block</span>,
    value: "block",
  },
];

function ModeSelect({ mode, setMode }) {
  return (
    <div className="flex items-center gap-2 text12Medium text-textTertiary">
      <span>Mode</span>
      <Select
        small
        itemHeight={24}
        className="!py-2 text12Medium w-[80px]"
        options={modeOptions}
        value={mode}
        onChange={({ value }) => setMode(value)}
      />
    </div>
  );
}

function DateModeInput({ value, setValue }) {
  const latestHeight = useChainOrScanHeight();
  const [showDateSelectModal, setShowDateSelectModal] = useState(false);
  const { blockTime } = useChainSettings();

  const onSelectDate = useCallback(
    (selectedDate) => {
      const now = dayjs().valueOf();
      const selectedTime = selectedDate.getTime();
      const diffInMs = selectedTime - now;
      const estimatedBlocks = Math.ceil(diffInMs / blockTime);

      const estimatedBlockHeight = latestHeight + estimatedBlocks;
      setValue(estimatedBlockHeight.toString());
      setShowDateSelectModal(false);
    },
    [blockTime, latestHeight, setValue],
  );

  const date = value
    ? new Date(Date.now() + (parseInt(value) - latestHeight) * blockTime)
    : null;

  return (
    <>
      <Input
        placeholder="Immediately"
        value={date ? dayjs(date).format("YYYY-MM-DD HH:mm") : ""}
        symbol={
          value ? (
            <IconButton onClick={() => setValue("")}>Clear Date</IconButton>
          ) : (
            <IconButton onClick={() => setShowDateSelectModal(true)}>
              Select Date
            </IconButton>
          )
        }
        disabled
      />
      {showDateSelectModal && (
        <DateOnlySelectModal
          onClose={() => setShowDateSelectModal(false)}
          defaultSelectedDate={date}
          onSelect={onSelectDate}
        />
      )}
    </>
  );
}

function BlockModeInput({ value, setValue }) {
  return (
    <NumberInput
      value={value}
      placeholder="Immediately"
      symbol="Block Height"
      onValueChange={setValue}
      controls={false}
    />
  );
}

export default function ValidFromField({ title = "", value, setValue }) {
  const [shouldShowWarning, setShouldShowWarning] = useState(false);
  const latestHeight = useChainOrScanHeight();
  const [mode, setMode] = useState("date");

  useDebounce(
    () => {
      if (value && /^\d+$/.test(value)) {
        const inputNumber = new BigNumber(value);
        const latestHeightBN = new BigNumber(latestHeight);

        setShouldShowWarning(inputNumber.lt(latestHeightBN));
      } else {
        setShouldShowWarning(false);
      }
    },
    500,
    [value, latestHeight],
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-[8px]">
        <PopupLabel text={title} />
        <ModeSelect mode={mode} setMode={setMode} />
      </div>
      <div className="flex items-center gap-[8px]">
        <div className="flex flex-col w-full">
          {mode === "date" ? (
            <DateModeInput value={value} setValue={setValue} />
          ) : (
            <BlockModeInput value={value} setValue={setValue} />
          )}
        </div>
      </div>
      <ValidFromFieldPrompt>
        {value ? PROMPT_EDITABLE_CONTENT : PROMPT_DISABLE_CONTENT}
      </ValidFromFieldPrompt>
      {shouldShowWarning && <ValidFromFieldWarning />}
    </div>
  );
}
