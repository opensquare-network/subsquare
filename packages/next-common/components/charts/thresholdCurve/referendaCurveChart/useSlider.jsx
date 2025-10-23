import { useState, useMemo } from "react";
import Slider from "next-common/components/slider";
import { debounce } from "lodash-es";

export default function useSlider(chartArea, showAyeNay, max) {
  const style = useMemo(() => {
    const { left = 0, right = 0 } = chartArea || {};
    return {
      paddingLeft: `${left}px`,
      paddingRight: showAyeNay ? `calc(100% - ${right}px)` : "0px",
    };
  }, [chartArea, showAyeNay]);

  const onAfterChange = debounce(() => {
    setRanging(false);
  }, [100]);
  const [rangeData, setRangeData] = useState([0, max]);
  const [ranging, setRanging] = useState(false);

  const component = chartArea ? (
    <div className="pt-2" style={style}>
      <Slider
        defaultValue={rangeData}
        min={0}
        max={max}
        minDistance={50}
        onBeforeChange={() => {
          setRanging(true);
        }}
        onAfterChange={onAfterChange}
        onChange={setRangeData}
        formatValue={() => null}
      />
    </div>
  ) : null;

  return {
    ranging,
    rangeData,
    component,
  };
}
