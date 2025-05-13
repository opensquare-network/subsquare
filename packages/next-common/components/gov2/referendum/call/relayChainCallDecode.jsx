"use client";

import { InfoDocs } from "@osn/icons/subsquare";
import { CommonTag } from "next-common/components/tags/state/styled";
import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { cn } from "next-common/utils";
import { useState, useEffect } from "react";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import WindowSizeProvider from "next-common/context/windowSize";
import styled from "styled-components";
import { isObject } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import { useAsync } from "react-use";
import { hexToU8a } from "@polkadot/util";
import { isCollectivesChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";

const CallDetailPopup = dynamicPopup(() => import("../../../callDetailPopup"));

const separateNumber = 5;

const NameTag = styled(CommonTag)`
  background-color: var(--neutral200);
  color: var(--textPrimary);
  white-space: nowrap;
`;

export default function RelayChainCallDecodeViewList({ relayChainDecodes }) {
  const [showMore, setShowMore] = useState(false);
  const shouldCollapsed = relayChainDecodes?.length > separateNumber;

  return (
    <WindowSizeProvider>
      <div className="flex flex-col">
        <div className="flex flex-col gap-y-2">
          {relayChainDecodes.slice(0, separateNumber).map((item, index) => (
            <RelayChainCallDecodeViewItem
              key={"always" + index}
              decode={item}
            />
          ))}
          {showMore &&
            shouldCollapsed &&
            relayChainDecodes
              ?.slice(separateNumber)
              .map((item, index) => (
                <RelayChainCallDecodeViewItem
                  key={"sometimes" + index}
                  decode={item}
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

function RelayChainCallDecodeViewItem({ decode }) {
  const isMobile = useIsMobile();
  const [detailPopupVisible, setDetailPopupVisible] = useState(false);

  if (!decode) {
    return null;
  }

  return (
    <div
      className={cn("flex gap-2", {
        "flex-wrap": isMobile,
      })}
    >
      <NameTag>{decode?.section}</NameTag>
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
export async function extractRelayChainInputsWithContext(data) {
  const encodedResults = [];

  async function findEncoded(item) {
    if (!isObject(item)) {
      return;
    }

    if (Array.isArray(item)) {
      await Promise.all(item.map(findEncoded));
      return;
    }

    if (item.encoded && typeof item.encoded === "string") {
      encodedResults.push(item.encoded);
    }

    await Promise.all(Object.values(item).map(findEncoded));
  }

  await findEncoded(data);
  return encodedResults;
}

export function useRelayChainCallDecodeType(data) {
  const api = useContextApi();
  const chain = useChain();
  const [decodes, setDecodes] = useState([]);
  const [loading, setLoading] = useState(false);

  const { value } = useAsync(async () =>
    isCollectivesChain(chain) ? extractRelayChainInputsWithContext(data) : [],
  );

  useEffect(() => {
    const decodes = [];
    setLoading(true);
    if (api && value?.length) {
      for (const encode of value) {
        try {
          const result = api?.createType("Call", hexToU8a[encode]);
          const json = result?.toHuman();
          if (json) {
            decodes.push(json);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    setDecodes(decodes);
    setLoading(false);
  }, [api, value]);

  return {
    value: decodes,
    loading,
  };
}
