import styled from "styled-components";
import { GreyPanel } from "../../styled/containers/greyPanel";

const GreyInfoPanel = styled(GreyPanel)`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: var(--textTertiary);

  flex-grow: 1;
  flex-wrap: wrap;
  padding: 4px 12px;
  gap: 8px;
`;

export default GreyInfoPanel;
