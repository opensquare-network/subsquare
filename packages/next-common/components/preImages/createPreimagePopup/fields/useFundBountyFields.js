import { useState } from "react";
import useUSDxBalanceField from "./useUSDxBalanceField";
import useAddressComboField from "./useAddressComboField";
import TextAreaField from "next-common/components/popup/fields/textAreaField";
import PopupLabel from "next-common/components/popup/label";
import Input from "next-common/lib/input";
import Tab from "next-common/components/tab";

const metadataTabs = [
  { tabId: "text", tabTitle: "Text" },
  { tabId: "metadata", tabTitle: "Metadata Hash" },
];

export default function useFundBountyFields() {
  const {
    value: [inputBalance, symbol],
    component: usdxBalanceField,
  } = useUSDxBalanceField();
  const { value: curator, component: curatorField } = useAddressComboField({
    title: "Curator",
  });
  const [inputMode, setInputMode] = useState("text");
  const [description, setDescription] = useState("");
  const [inputMetadataHash, setInputMetadataHash] = useState("");

  return {
    value: {
      symbol,
      inputBalance,
      curator,
      inputMode,
      description,
      inputMetadataHash,
    },
    component: (
      <>
        {usdxBalanceField}
        {curatorField}
        <div className="flex flex-col gap-3">
          <PopupLabel text="Metadata" />
          <Tab
            tabs={metadataTabs}
            selectedTabId={inputMode}
            setSelectedTabId={setInputMode}
          />
          {inputMode === "text" ? (
            <TextAreaField
              title="Description"
              placeholder="Please fill the description about this bounty..."
              text={description}
              setText={setDescription}
            />
          ) : (
            <div>
              <Input
                placeholder="0x..."
                value={inputMetadataHash}
                onChange={(event) => setInputMetadataHash(event.target.value)}
              />
              <p className="mt-2 text12Medium text-textTertiary">
                The metadata preimage must already exist on chain.
              </p>
            </div>
          )}
        </div>
      </>
    ),
  };
}
