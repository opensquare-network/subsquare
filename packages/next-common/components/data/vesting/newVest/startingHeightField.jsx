import { useCallback, useState } from "react";
import Input from "next-common/lib/input";
import PopupLabel from "next-common/components/popup/label";
import Select from "next-common/components/select";
import NumberInput from "next-common/lib/input/number";
import IconButton from "next-common/components/iconButton";
import DateOnlySelectModal from "next-common/components/calendar/dateSelectModal/dateOnlySelectModal";
import { useChainSettings } from "next-common/context/chain";
import dayjs from "dayjs";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import { useChain } from "next-common/context/chain";
import { isRelayChain } from "next-common/utils/chain";
import Tooltip from "next-common/components/tooltip";
import { SystemQuestion } from "@osn/icons/subsquare";

const modeOptions = [
  { label: <span>Date</span>, value: "date" },
  {
    label: <span className="whitespace-nowrap">Block</span>,
    value: "block",
  },
];

function ModeSelect({ mode, setMode }) {
  return (
    <div className="mb-[8px]">
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
  const latestHeight = useAhmLatestHeight();
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
        placeholder="Starting height"
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
      placeholder="Starting height"
      symbol="Block Height"
      onValueChange={setValue}
      controls={false}
    />
  );
}

function StartingHeightLabel() {
  const chain = useChain();
  if (!isRelayChain(chain)) {
    return "Starting Height";
  }

  return (
    <div className="inline-flex items-center space-x-1">
      <span>Starting Height</span>
      <Tooltip content="Vested transfer is determined by the Relay Chain block height">
        <SystemQuestion className="w-4 h-4 [&_path]:fill-textTertiary" />
      </Tooltip>
    </div>
  );
}

function StartingHeightStatus({ onHeightClick }) {
  const chain = useChain();
  const height = useAhmLatestHeight();

  if (!height) {
    return null;
  }

  const label = isRelayChain(chain) ? "Relay Chain Height" : "Current Height";

  return (
    <span className="text14Medium text-textTertiary">
      {label}:{" "}
      <span
        className="cursor-pointer text-textPrimary"
        onClick={() => onHeightClick?.(height)}
      >
        {height.toLocaleString()}
      </span>
    </span>
  );
}

export default function StartingHeightField({ value, setValue }) {
  const [mode, setMode] = useState("block");

  return (
    <div>
      <div className="flex justify-between items-center">
        <PopupLabel text={<StartingHeightLabel />} />
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
      <div className="mt-1 w-full flex justify-end">
        <StartingHeightStatus onHeightClick={(height) => setValue(height)} />
      </div>
    </div>
  );
}
