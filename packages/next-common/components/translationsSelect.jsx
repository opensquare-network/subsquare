import tw from "tailwind-styled-components";
import { useState, useRef, useMemo, useEffect } from "react";
import { SystemVoteAye } from "@osn/icons/subsquare";
import Divider from "next-common/components/styled/layout/divider";
import Caret from "next-common/components/icons/caret";
import { useClickAway } from "react-use";

export const Select = tw.div`
  flex items-center justify-between
  bg-neutral100 border border-neutral400 hover:border-neutral500 rounded-lg
  h-10 px-4 cursor-pointer
`;

const OptionsDiv = tw.div`
  absolute scrollbar-pretty
  w-full mt-1 bg-neutral100 shadow-200
  border border-neutral300 rounded-lg
  max-h-[320px] overflow-y-auto z-50
`;

const OptionsRowDiv = tw.div`
  py-2 px-2
`;

const OptionsItemDiv = tw.div`
 flex items-center justify-between
 rounded-md py-[10px] pl-[16px] pr-[10px]
 cursor-pointer hover:bg-neutral200
   ${(props) => props?.theme?.isDark && "hover:bg-neutral200"}
     ${(p) => p.selected && "bg-neutral200"}
`;

export function Item({ className, onChange, label, value, selected }) {
  return (
    <OptionsItemDiv
      className={className}
      onClick={() => onChange(value)}
      selected={selected}
    >
      <span className="text-textPrimary text14Medium">{label}</span>
      {selected && <SystemVoteAye className="w-5 h-5 text-theme500" />}
    </OptionsItemDiv>
  );
}

const ChineseSimplified = "SC";
const Spanish = "ES";
const Russian = "RU";

const sourceData = {
  label: "Source",
  value: "SOURCE",
};

const dataRestOptions = [
  {
    label: "Chinese (Simplified)",
    value: ChineseSimplified,
  },
  {
    label: "Spanish",
    value: Spanish,
  },
  {
    label: "Russian",
    value: Russian,
  },
];

const dataOptions = [sourceData, ...dataRestOptions];

export default function TranslationsSelect({
  selectedLauguage = sourceData.value,
  onSelect,
}) {
  const [show, setShow] = useState(false);
  const ref = useRef();

  useClickAway(ref, () => setShow(false));

  const curLabel = useMemo(() => {
    return dataOptions.find((i) => i.value === selectedLauguage)?.label;
  }, [selectedLauguage]);

  useEffect(() => {
    if (!selectedLauguage) {
      onSelect(sourceData.value);
    }
  }, [onSelect, selectedLauguage]);

  return (
    <div className="relative flex-1" ref={ref}>
      <Select onClick={() => setShow(!show)}>
        <span className="text-textPrimary text14Medium">{curLabel}</span>
        <Caret isGrey down={!show} />
      </Select>
      {show && (
        <OptionsDiv>
          <OptionsRowDiv>
            <Item
              onChange={(value) => {
                onSelect(value);
                setShow(false);
              }}
              selected={selectedLauguage === sourceData.value}
              label={sourceData.label}
              value={sourceData.value}
            />
          </OptionsRowDiv>
          <Divider />
          <OptionsRowDiv className="flex flex-wrap">
            {dataRestOptions.map((i) => (
              <Item
                key={i.value}
                className="md:basis-1/3 box-border max-md:basis-full"
                onChange={(value) => {
                  onSelect(value);
                  setShow(false);
                }}
                selected={selectedLauguage === i.value}
                label={i.label}
                value={i.value}
              />
            ))}
          </OptionsRowDiv>
        </OptionsDiv>
      )}
    </div>
  );
}
