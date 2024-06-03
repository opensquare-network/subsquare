import { SystemTranslate } from "@osn/icons/subsquare";
import TranslationsSelect from "./translationsSelect";
import { useState } from "react";
import { cn } from "next-common/utils";
export default function ContentTranslations({ className }) {
  // selectedLauguage value: SOURCE | SC | ES | RU
  const [selectedLauguage, setSelectedLauguage] = useState("");

  return (
    <div
      className={cn(
        "py-2.5 pl-4 pr-2.5 bg-neutral200 rounded-[8px] flex items-center",
        className,
      )}
    >
      <SystemTranslate className="w-6 h-6 mr-4 text-textTertiary" />
      <TranslationsSelect
        selectedLauguage={selectedLauguage}
        onSelect={(value) => setSelectedLauguage(value)}
        className="flex-1"
      />
    </div>
  );
}
