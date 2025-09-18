import styled from "styled-components";
import AvatarDeleted from "../../assets/imgs/icons/avatar-deleted.svg";
import Flex from "../styled/flex";
import { addressEllipsis } from "next-common/utils/";
import Username from "next-common/components/user/username";

const Wrapper = styled(Flex)`
  font-weight: 500;
  word-break: break-all;
  font-size: 1em;
  color: var(--textSecondary);
  > svg {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    circle:last-child {
      fill: var(--neutral400);
    }
    circle:first-child {
      fill: var(--neutral200);
    }
  }
`;

export default function DeletedAccount({ address }) {
  return (
    <Wrapper>
      <AvatarDeleted />
      {address ? (
        <Username username={addressEllipsis(address)} />
      ) : (
        "[Deleted Account]"
      )}
    </Wrapper>
  );
}
