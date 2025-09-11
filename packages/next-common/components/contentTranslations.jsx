import { SystemTranslate } from "@osn/icons/subsquare";
import TranslationsSelect from "./translationsSelect";
import { useState } from "react";

export default function ContentTranslations() {
  // selectedLauguage value: SOURCE | SC | ES | RU
  const [selectedLauguage, setSelectedLauguage] = useState("");

  return (
    <div className="py-2.5 pl-4 pr-2.5 mb-4 bg-neutral200 rounded-[8px] flex items-center">
      <SystemTranslate className="w-6 h-6 mr-4 text-textTertiary" />
      <TranslationsSelect
        selectedLauguage={selectedLauguage}
        onSelect={(value) => setSelectedLauguage(value)}
      />
    </div>
  );
}
