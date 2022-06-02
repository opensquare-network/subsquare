import styled from "styled-components";
import { primary_purple_500 } from "next-common/styles/colors";
import { p_12_medium } from "next-common/styles/componentCss";

const Text = styled.div`
  ${p_12_medium};
  color: ${primary_purple_500};
  &:hover {
    cursor: pointer;
  }
`;

function ToggleText({ isToggleOpen, setIsToggleOpen = () => {} }) {
  const handleSwitch = () => {
    setIsToggleOpen(!isToggleOpen);
  };

  return (
    <Text onClick={handleSwitch}>{isToggleOpen ? "Cancel" : "Set Banner"}</Text>
  );
}

export default ToggleText;
