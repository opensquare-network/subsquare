import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { Label } from "../../popup/styled";
import Select from "next-common/components/select";
import { colorStyle, PromptTypes } from "next-common/components/scrollPrompt";
import { useEffect, useMemo, useState } from "react";
import { noop } from "lodash-es";

export default function ThresholdField({
  signatories = [],
  onChange = noop,
  value,
}) {
  const [threshold, setThreshold] = useState(value);
  const [showThresholdError, setShowThresholdError] = useState(false);

  const thresholdOptions = useMemo(() => {
    return Array.from({ length: signatories.length }, (_, i) => ({
      label: `${i + 2}`,
      value: i + 2,
    }));
  }, [signatories]);

  useEffect(() => {
    const maxThreshold = Math.max(
      ...thresholdOptions.map((option) => option.value),
    );
    if (threshold > maxThreshold) {
      setThreshold(undefined);
      setShowThresholdError(true);
    }
  }, [thresholdOptions, threshold]);

  useEffect(() => {
    if (threshold) {
      setShowThresholdError(false);
    }
    onChange(threshold);
  }, [threshold, onChange]);

  return (
    <>
      <div className="flex flex-col gap-y-2">
        <Label>Threshold</Label>
        <Select
          disabled={thresholdOptions.length === 0}
          value={threshold}
          placeholder="Please select the threshold..."
          onChange={(item) => setThreshold(item.value)}
          options={thresholdOptions}
        />
      </div>
      {showThresholdError && (
        <GreyPanel
          style={colorStyle[PromptTypes.ERROR]}
          className="text14Medium px-4 py-2.5"
        >
          The threshold must be less than the number of signatories.
        </GreyPanel>
      )}
    </>
  );
}
