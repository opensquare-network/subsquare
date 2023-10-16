import styled from "styled-components";
import Toggle from "../toggle";

const Wrapper = styled.div`
  display: flex;
  gap: 16px;
  width: 100px;
  justify-content: right;
  margin-left: 24px;
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
