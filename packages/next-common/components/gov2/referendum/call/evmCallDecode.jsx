import { InfoDocs } from "@osn/icons/subsquare";
import { CommonTag } from "next-common/components/tags/state/styled";
import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Loading from "next-common/components/loading";
import { cn } from "next-common/utils";
import { decodeInput } from "next-common/utils/evm/decodeInput";
import { contractAddressMapiing } from "next-common/utils/evm/importAbi";
import { useState } from "react";
import { useAsync } from "react-use";

const CallDetailPopup = dynamicPopup(() => import("../../../callDetailPopup"));

export default function EvmCallInputDecode({ evmCallInputs }) {
  return (
    <div className="flex flex-col gap-y-2">
      {evmCallInputs.map((item) => (
        <EvmCallInputDecodeItem
          key={item.target + item.input}
          input={item.input}
          target={item.target}
        />
      ))}
    </div>
  );
}

function EvmCallInputDecodeItem({ input, target }) {
  const [detailPopupVisible, setDetailPopupVisible] = useState(false);
  const name = contractAddressMapiing[target]?.name;
  const { value, error, loading } = useAsync(
    async () => await decodeInput(input, target),
  );

  const [decode, success] = value ?? [];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return null;
  }

  return (
    <div className="flex gap-x-2">
      <CommonTag
        style={{
          backgroundColor: "var(--neutral200)",
          color: "var(--textPrimary)",
        }}
      >
        {name}
      </CommonTag>
      {success && (
        <>
          <span className="text-textTertiary text14Medium">·</span>
          <CommonTag
            style={{
              backgroundColor: "var(--neutral200)",
              color: "var(--textPrimary)",
            }}
          >
            {decode?.method}
          </CommonTag>
        </>
      )}
      {success && (
        <Tooltip content="Call Detail">
          <InfoDocs
            role="button"
            className={cn(
              "w-4 h-4 relative top-[0.5px]",
              "[&_path]:stroke-textTertiary [&_path]:hover:stroke-textSecondary",
              "[&_path]:fill-textTertiary [&_path]:hover:fill-textSecondary",
            )}
            onClick={() => setDetailPopupVisible(true)}
          />
        </Tooltip>
      )}
      {detailPopupVisible && success && (
        <CallDetailPopup
          tableViewData={decode}
          jsonViewData={decode}
          hasTreeViewData={false}
          setShow={setDetailPopupVisible}
        />
      )}
    </div>
  );
}

export function extractEvmInputsWithContext(data) {
  const results = [];
  const allContractAddress = Object.keys(contractAddressMapiing);

  function recurse(obj) {
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      if (obj.section === "evm" && obj.args) {
        let targetAddress = "";
        let inputValue = "";

        for (const arg of obj.args) {
          if (arg.name === "target") {
            targetAddress = arg.value;
          }
          if (arg.name === "input") {
            inputValue = arg.value;
          }
        }

        if (targetAddress && inputValue) {
          results.push({
            target: targetAddress,
            input: inputValue,
          });
        }
      }

      for (const value of Object.values(obj)) {
        recurse(value);
      }
    } else if (Array.isArray(obj)) {
      for (const item of obj) {
        recurse(item);
      }
    }
  }

  recurse(data);
  return results.filter(({ target }) => allContractAddress.includes(target));
}
