import React from "react";
import styled from "styled-components";
import Tab from "../tab";

const Count = styled.span`
  color: ${(p) => p.theme.textTertiary};
`;

export const SubSquare = "SubSquare";
export const Polkassembly = "Polkassembly";

export default function SourceTabs({
  detail,
  small = true,
  tabIndex,
  setTabIndex,
}) {
  const { commentsCount, polkassemblyCommentsCount } = detail ?? {};

  return (
    <Tab
      small={small}
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
