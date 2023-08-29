import React from "react";
import styled from "styled-components";
import Tab from "../tab";

const Count = styled.span`
  color: var(--textTertiary);
`;

export const SubSquare = "SubSquare";
export const Polkassembly = "Polkassembly";

export default function SourceTabs({ detail, tabIndex, setTabIndex }) {
  const { commentsCount, polkassemblyCommentsCount } = detail ?? {};

  return (
    <Tab
      tabs={[
        {
          tabId: SubSquare,
          tabTitle: (
            <>SubSquare{!!commentsCount && <Count>({commentsCount})</Count>}</>
          ),
        },
        {
          tabId: Polkassembly,
          tabTitle: (
            <>
              Polkassembly
              {!!polkassemblyCommentsCount && (
                <Count>({polkassemblyCommentsCount})</Count>
              )}
            </>
          ),
        },
      ]}
      selectedTabId={tabIndex}
      setSelectedTabId={setTabIndex}
    />
  );
}
