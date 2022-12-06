import styled from "styled-components";
import { p_14_normal } from "../../styles/componentCss";
import { addressEllipsis } from "../../utils";
import Tooltip from "../tooltip";

const Wrapper = styled.div`
  display: flex;
  margin-top: 8px;
  align-items: center;
  padding: 10px 16px;
  justify-content: space-between;

  ${p_14_normal}
  color: ${(p) => p.theme.textSecondary};
  .proxyaddr {
    font-weight: 500;
    color: ${(p) => p.theme.textPrimary};
  }

  background: ${(p) => p.theme.grey100Bg};
  border-radius: 4px;
`;

export default function ProxyInfo({ address }) {
  const shortAddr = addressEllipsis(address);
  return (
    <Wrapper>
      <span>
        As proxy of <span className="proxyaddr">{shortAddr}</span>
      </span>
      <Tooltip content={"Extirinsic will be wrapped in a proxy call"} />
    </Wrapper>
  );
}
