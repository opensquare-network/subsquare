import styled from "styled-components";

import Grvatar from "next-common/components/gravatar";
import Avatar from "next-common/components/avatar";
import Flex from "next-common/components/styled/flex";

const Wrapper = styled(Flex)`
  word-break: break-word;

  > img {
    height: 20px;
    width: 20px;
  }

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

export default function Author({ username, address, emailMd5 }) {
  return (
    <Wrapper>
      {address ? (
        <Avatar address={address} size={20} />
      ) : (
        <Grvatar emailMd5={emailMd5} size={20} />
      )}
      <div>{username}</div>
    </Wrapper>
  );
}
