import { useCallback, useMemo, useState } from "react";
import Input from "next-common/lib/input";
import PopupLabel from "next-common/components/popup/label";
import Select from "next-common/components/select";
import NumberInput from "next-common/lib/input/number";
import IconButton from "next-common/components/iconButton";
import DateSelectModal from "next-common/components/calendar/dateSelectModal";
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
  const [selectedDate, setSelectedDate] = useState(null);
  const { blockTime } = useChainSettings();

  const onSelectDate = useCallback(
    (selectedDate) => {
      const now = dayjs().valueOf();
      const selectedTime = selectedDate.getTime();
      const diffInMs = selectedTime - now;
      const estimatedBlocks = Math.ceil(diffInMs / blockTime);

      const estimatedBlockHeight = latestHeight + estimatedBlocks;
      setValue(estimatedBlockHeight.toString());
      setSelectedDate(selectedDate);
      setShowDateSelectModal(false);
    },
    [blockTime, latestHeight, setValue],
  );

  const onClearDate = useCallback(() => {
    setValue("");
    setSelectedDate(null);
  }, [setValue]);

  const displayDate = useMemo(() => {
    if (selectedDate) {
      return selectedDate;
    }

    if (value) {
      return new Date(
        // eslint-disable-next-line react-hooks/purity
        Date.now() + (parseInt(value) - latestHeight) * blockTime,
      );
    }

    return null;
  }, [selectedDate, value, latestHeight, blockTime]);

  return (
    <>
      <Input
        placeholder="Starting from"
        value={displayDate ? dayjs(displayDate).format("YYYY-MM-DD HH:mm") : ""}
        symbol={
          value ? (
            <IconButton onClick={onClearDate}>Clear Date</IconButton>
          ) : (
            <IconButton onClick={() => setShowDateSelectModal(true)}>
              Select Date
            </IconButton>
          )
        }
        disabled
      />
      {showDateSelectModal && (
        <DateSelectModal
          onClose={() => setShowDateSelectModal(false)}
          defaultSelectedDate={displayDate}
          onSelect={onSelectDate}
          mode="select"
        />
      )}
    </>
  );
}

function BlockModeInput({ value, setValue }) {
  return (
    <NumberInput
      value={value}
      placeholder="Starting from"
      symbol="Block Height"
      onValueChange={setValue}
      controls={false}
    />
  );
}

function StartingHeightLabel() {
  const chain = useChain();
  if (!isRelayChain(chain)) {
    return "Starting From";
  }

  return (
    <div className="inline-flex items-center space-x-1">
      <span>Starting From</span>
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
  const [mode, setMode] = useState("date");

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
      <div className="mt-2 w-full flex justify-end">
        <StartingHeightStatus onHeightClick={(height) => setValue(height)} />
      </div>
    </div>
  );
}
