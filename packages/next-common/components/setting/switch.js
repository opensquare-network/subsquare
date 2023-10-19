import styled from "styled-components";
import Toggle from "../toggle";

const Wrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: right;
`;

export default function Switch({ isUnset, isOn, onToggle }) {
  return (
    <Wrapper>
      <span className={isUnset ? "text-textTertiary" : "text-textPrimary"}>
        {isUnset ? "Unset" : isOn ? "Active" : "Off"}
      </span>
      <Toggle disabled={isUnset} isOn={!isUnset && isOn} onToggle={onToggle} />
    </Wrapper>
  );
}
