import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";

export const Wrapper = styled(Flex)`
  align-items: flex-start;
  flex-wrap: wrap;
`;

export const GreyWrapper = styled(GreyPanel)`
  flex-flow: wrap;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  padding: 8px 12px;
  margin-top: 16px;
`;

export const GreyItem = styled.div`
  display: inline-block;
  margin-right: 12px;

  > .username {
    color: var(--textSecondary);
  }
`;
