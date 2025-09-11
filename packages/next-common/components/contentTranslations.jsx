import { SystemTranslate } from "@osn/icons/subsquare";
import TranslationsSelect from "./translationsSelect";
import { useState } from "react";

export default function ContentTranslations() {
  // selectedLanguage value: SOURCE | SC | ES | RU
  const [selectedLanguage, setSelectedLauguage] = useState("");

  return (
    <div className="py-2.5 pl-4 pr-2.5 mb-4 bg-neutral200 rounded-[8px] flex items-center">
      <SystemTranslate className="w-6 h-6 mr-4 text-textTertiary" />
      <TranslationsSelect
        selectedLanguage={selectedLanguage}
        onSelect={(value) => setSelectedLauguage(value)}
      />
    </div>
  );
}
