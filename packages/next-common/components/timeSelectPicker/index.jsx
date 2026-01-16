import React from "react";
import Select from "next-common/components/select";

export default function TimeSelectPicker({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
}) {
  const formatNumber = (num) => String(num).padStart(2, "0");

  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    label: formatNumber(i),
    value: i,
  }));

  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    label: formatNumber(i),
    value: i,
  }));

  return (
    <div className="flex items-center justify-center gap-2 select-none">
      <div className="w-20">
        <Select
          value={hour}
          options={hourOptions}
          onChange={(option) => onHourChange(option.value)}
          maxDisplayItem={6}
          itemHeight={32}
        />
      </div>
      <span className="text16Medium text-textSecondary">:</span>
      <div className="w-20">
        <Select
          value={minute}
          options={minuteOptions}
          onChange={(option) => onMinuteChange(option.value)}
          maxDisplayItem={6}
          itemHeight={32}
        />
      </div>
    </div>
  );
}
