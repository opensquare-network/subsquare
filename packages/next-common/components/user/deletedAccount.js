import styled from "styled-components";
import AvatarDeleted from "../../assets/imgs/icons/avatar-deleted.svg";
import Flex from "../styled/flex";

const Wrapper = styled(Flex)`
  font-weight: 500;
  word-break: break-all;
  font-size: ${(props) => props.fontSize}px;
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

export default function DeletedAccount({ fontSize }) {
  return (
    <Wrapper fontSize={fontSize}>
      <AvatarDeleted />
      [Deleted Account]
    </Wrapper>
  );
}
