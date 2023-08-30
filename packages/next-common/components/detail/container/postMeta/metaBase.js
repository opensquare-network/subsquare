import styled from "styled-components";
import Flex from "../../../styled/flex";
import User from "../../../user";
import { usePost } from "../../../../context/post";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";

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
  const post = usePost();
  const { sm } = useScreenSize();

  return (
    <div className="flex items-center justify-between flex-nowrap">
      <DividerWrapper>
        <User
          user={post.author}
          add={post.proposer || post.finder}
          fontSize={12}
          maxWidth={sm ? 236 : 370}
        />
        {children}
      </DividerWrapper>
      {state}
    </div>
  );
}
