import Slider from "next-common/components/slider";
import { useCallback, useEffect, useState } from "react";

function ReferendaSlider({ referendumCount, onSliderChange, defaultRange }) {
  return (
    <div style={{ marginTop: 9, marginBottom: 12 }}>
      <Slider
        min={0}
        max={referendumCount - 1}
        onChange={onSliderChange}
        formatValue={(val) => val}
        defaultValue={defaultRange}
      />
    </div>
  );
}

export default function useReferendaSlider(referendumCount) {
  const [rangeFrom, setRangeFrom] = useState(0);
  const [rangeTo, setRangeTo] = useState(-1);

  useEffect(() => {
    setRangeTo(referendumCount);
  }, [referendumCount]);

  const onSliderChange = useCallback(([from, to]) => {
    setRangeFrom(from);
    setRangeTo(to);
  }, []);

  const slider = (
    <ReferendaSlider
      referendumCount={referendumCount}
      onSliderChange={onSliderChange}
      defaultRange={[rangeFrom, rangeTo]}
    />
  );

  return {
    component: slider,
    rangeFrom,
    rangeTo,
  };
}
