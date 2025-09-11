import tw from "tailwind-styled-components";
import { useState, useRef, useMemo, useEffect } from "react";
import { SystemVoteAye } from "@osn/icons/subsquare";
import Divider from "next-common/components/styled/layout/divider";
import Caret from "next-common/components/icons/caret";
import { useClickAway } from "react-use";

const SelectTrigger = tw.div`
  flex items-center justify-between
  bg-neutral100 border border-neutral400 hover:border-neutral500 rounded-lg
  h-10 px-4 cursor-pointer
`;

const DropdownMenu = tw.div`
  absolute scrollbar-pretty
  w-full mt-1 bg-neutral100 shadow-200
  border border-neutral300 rounded-lg
  max-h-[320px] overflow-y-auto z-50
`;

const MenuSection = tw.div`
  py-2 px-2
`;

const MenuItem = tw.div`
 flex items-center justify-between
 rounded-md py-[10px] pl-[16px] pr-[10px]
 cursor-pointer hover:bg-neutral200
   ${(props) => props?.theme?.isDark && "hover:bg-neutral200"}
     ${(p) => p.selected && "bg-neutral200"}
`;

const LANGUAGE_CODES = {
  SOURCE: "SOURCE",
  CHINESE_SIMPLIFIED: "SC",
  SPANISH: "ES",
  RUSSIAN: "RU",
};

const DEFAULT_LANGUAGE_OPTION = {
  label: "Source",
  value: LANGUAGE_CODES.SOURCE,
};

const AVAILABLE_LANGUAGES = [
  {
    label: "Chinese (Simplified)",
    value: LANGUAGE_CODES.CHINESE_SIMPLIFIED,
  },
  {
    label: "Spanish",
    value: LANGUAGE_CODES.SPANISH,
  },
  {
    label: "Russian",
    value: LANGUAGE_CODES.RUSSIAN,
  },
];

function LanguageOption({ className, onChange, label, value, selected }) {
  return (
    <MenuItem
      className={className}
      onClick={() => onChange(value)}
      selected={selected}
    >
      <span className="text-textPrimary text14Medium">{label}</span>
      {selected && <SystemVoteAye className="w-5 h-5 text-theme500" />}
    </MenuItem>
  );
}

const ALL_LANGUAGE_OPTIONS = [DEFAULT_LANGUAGE_OPTION, ...AVAILABLE_LANGUAGES];

export default function TranslationsSelect({
  selectedLanguage = DEFAULT_LANGUAGE_OPTION.value,
  onSelect,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const ref = useRef();

  useClickAway(ref, () => setIsDropdownOpen(false));

  const currentLanguageLabel = useMemo(() => {
    return ALL_LANGUAGE_OPTIONS.find(
      (option) => option.value === selectedLanguage,
    )?.label;
  }, [selectedLanguage]);

  useEffect(() => {
    if (!selectedLanguage) {
      onSelect(DEFAULT_LANGUAGE_OPTION.value);
    }
  }, [onSelect, selectedLanguage]);

  return (
    <div className="relative flex-1" ref={ref}>
      <SelectTrigger onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <span className="text-textPrimary text14Medium">
          {currentLanguageLabel}
        </span>
        <Caret isGrey down={!isDropdownOpen} />
      </SelectTrigger>
      {isDropdownOpen && (
        <DropdownMenu>
          <MenuSection>
            <LanguageOption
              onChange={(value) => {
                onSelect(value);
                setIsDropdownOpen(false);
              }}
              selected={selectedLanguage === DEFAULT_LANGUAGE_OPTION.value}
              label={DEFAULT_LANGUAGE_OPTION.label}
              value={DEFAULT_LANGUAGE_OPTION.value}
            />
          </MenuSection>
          <Divider />
          <MenuSection className="flex flex-wrap">
            {AVAILABLE_LANGUAGES.map((language) => (
              <LanguageOption
                key={language.value}
                className="md:basis-1/3 box-border max-md:basis-full"
                onChange={(value) => {
                  onSelect(value);
                  setIsDropdownOpen(false);
                }}
                selected={selectedLanguage === language.value}
                label={language.label}
                value={language.value}
              />
            ))}
          </MenuSection>
        </DropdownMenu>
      )}
    </div>
  );
}
