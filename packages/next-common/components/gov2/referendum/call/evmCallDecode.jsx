"use client";

import { InfoDocs } from "@osn/icons/subsquare";
import { CommonTag } from "next-common/components/tags/state/styled";
import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { cn } from "next-common/utils";
import { decodeInput } from "next-common/utils/evm/decodeInput";
import { contractAddressMap } from "next-common/utils/evm/importAbi";
import { useState } from "react";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import WindowSizeProvider from "next-common/context/windowSize";
import styled from "styled-components";
import { isObject } from "lodash-es";

const CallDetailPopup = dynamicPopup(() => import("../../../callDetailPopup"));

const separateNumber = 5;

const NameTag = styled(CommonTag)`
  background-color: var(--neutral200);
  color: var(--textPrimary);
  white-space: nowrap;
`;

export default function EvmCallInputDecode({ evmCallInputs }) {
  const [showMore, setShowMore] = useState(false);
  const shouldCollapsed = evmCallInputs?.length > separateNumber;

  return (
    <WindowSizeProvider>
      <div className="flex flex-col">
        <div className="flex flex-col gap-y-2">
          {evmCallInputs.slice(0, separateNumber).map((item, index) => (
            <EvmCallInputDecodeItem
              key={"always" + index}
              decode={item.decodeResult}
              contractAddress={item.contractAddress}
            />
          ))}
          {showMore &&
            shouldCollapsed &&
            evmCallInputs
              ?.slice(separateNumber)
              .map((item, index) => (
                <EvmCallInputDecodeItem
                  key={"sometimes" + index}
                  decode={item.decodeResult}
                  contractAddress={item.contractAddress}
                />
              ))}
        </div>
        {shouldCollapsed && (
          <div className="mt-4">
            <span
              role="button"
              className="text12Medium text-theme500"
              onClick={() => {
                setShowMore(!showMore);
              }}
            >
              Show {showMore ? "Less" : "More"}
            </span>
          </div>
        )}
      </div>
    </WindowSizeProvider>
  );
}

function EvmCallInputDecodeItem({ decode, contractAddress }) {
  const isMobile = useIsMobile();
  const [detailPopupVisible, setDetailPopupVisible] = useState(false);
  const name = contractAddressMap[contractAddress]?.name;

  if (!decode) {
    return null;
  }

  return (
    <div
      className={cn("flex gap-2", {
        "flex-wrap": isMobile,
      })}
    >
      <NameTag>{name}</NameTag>
      <span className="text-textTertiary text14Medium">·</span>
      <div className="flex gap-2">
        <NameTag>{decode?.method}</NameTag>
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
      </div>
      {detailPopupVisible && (
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

export async function extractEvmInputsWithContext(data) {
  const validContractAddresses = Object.keys(contractAddressMap);
  const results = [];

  async function findEvmInputs(item) {
    if (!isObject(item)) {
      return;
    }

    if (Array.isArray(item)) {
      item.forEach(findEvmInputs);
      return;
    }

    if (isEvmSection(item)) {
      const result = await extractTargetAndInput(item.args);
      if (result) {
        results.push(result);
      }
    }

    Object.values(item).forEach(findEvmInputs);
  }

  function isEvmSection(item) {
    return item.section === "evm" && Array.isArray(item.args);
  }

  async function extractTargetAndInput(args) {
    let target = "";
    let input = "";

    for (const arg of args) {
      if (arg.name === "target") {
        target = arg.value;
      }
      if (arg.name === "input") {
        input = arg.value;
      }
      if (target && input) {
        break;
      }
    }

    if (!isValidContractAddress(target)) {
      return null;
    }

    const [decodeResult, isSuccess] = await decodeInput(input, target);

    if (!isSuccess) {
      return null;
    }

    return {
      decodeResult,
      contractAddress: target,
    };
  }

  function isValidContractAddress(address) {
    return validContractAddresses.includes(address);
  }

  findEvmInputs(data);
  return results;
}
