"use client";

import { decodeInput } from "next-common/utils/evm/decodeInput";
import { contractAddressMap } from "next-common/utils/evm/importAbi";
import { isObject } from "lodash-es";
import { useAsync } from "react-use";
import Row from "next-common/components/listInfo/row";
import { DecodeCallItem } from "./decodeItem";
import DecodeCallList from "./decodeList";

export default function EvmCall({ call }) {
  const { value: evmCallDecodes = [] } = useAsync(async () =>
    extractEvmInputsWithContext(call),
  );

  if (!evmCallDecodes?.length) {
    return null;
  }

  return (
    <Row
      row={[
        "EVM Calls",
        <DecodeCallList
          key="element"
          list={evmCallDecodes}
          renderItem={(item, index) => (
            <DecodeCallItem
              key={`EvmCallDecode-${index}`}
              decode={item.decodeResult}
              method={item.decodeResult?.method}
              section={contractAddressMap[item.contractAddress]?.name}
            />
          )}
        />,
      ]}
    />
  );
}

export async function extractEvmInputsWithContext(data) {
  const validContractAddresses = Object.keys(contractAddressMap);
  const decodeResults = [];

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
        decodeResults.push(result);
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
  return decodeResults;
}
