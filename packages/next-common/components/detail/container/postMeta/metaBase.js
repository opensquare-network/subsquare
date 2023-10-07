import styled from "styled-components";
import Flex from "../../../styled/flex";
import { usePost } from "../../../../context/post";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import SystemUser from "next-common/components/user/systemUser";
import AddressUser from "next-common/components/user/addressUser";

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

function PostUser() {
  const post = usePost();
  const { sm } = useScreenSize();
  const userMaxWidth = sm ? 236 : 370;
  const userFontSize = 12;

  let user = null;
  if (post?.author) {
    user = (
      <SystemUser
        user={post?.author}
        fontSize={userFontSize}
        maxWidth={userMaxWidth}
      />
    );
  } else {
    user = (
      <AddressUser
        add={post?.proposer || post?.finder}
        fontSize={userFontSize}
        maxWidth={userMaxWidth}
      />
    );
  }

  return user;
}

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
