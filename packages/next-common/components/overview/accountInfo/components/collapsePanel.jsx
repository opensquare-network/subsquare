import { useState } from "react";
import { ArrowTriangleUp, ArrowTriangleDown } from "@osn/icons/subsquare";
import styled from "styled-components";

const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--neutral400);
  border-radius: 4px;
  width: 20px;
  height: 20px;

  > svg path {
    fill: var(--textSecondary);
  }
`;

export default function CollapsePanel({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const Icon = isCollapsed ? ArrowTriangleUp : ArrowTriangleDown;

  return (
    <>
      <div className="flex items-center justify-between">
        <Wrapper>
          <Icon
            role="button"
            className="w-3 h-3 [&_path]:fill-textTertiary"
            onClick={toggleCollapse}
          />
        </Wrapper>
      </div>
      {isCollapsed && <div className="space-y-4">{children}</div>}
    </>
  );
}
