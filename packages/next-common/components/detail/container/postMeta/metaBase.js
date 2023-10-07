import styled from "styled-components";
import Flex from "../../../styled/flex";
import PostUser from "./postUser";

const DividerWrapper = styled(Flex)`
  flex-wrap: wrap;

  > :not(:first-child) {
    display: inline-flex;
    align-items: center;

    @media (max-width: 768px) {
      display: none;
    }

    ::before {
      content: "·";
      font-size: 12px;
      color: var(--textTertiary);
      margin: 0 8px;
    }
  }
`;

export default function PostMetaBase({ children, state }) {
  return (
    <div className="flex items-center justify-between flex-nowrap">
      <DividerWrapper>
        <PostUser />
        {children}
      </DividerWrapper>
      {state}
    </div>
  );
}
