import styled from "styled-components";
import { primary_purple_500 } from "next-common/styles/colors";

const Toggler = styled.button`
  background-color: transparent;
  border: none;
  color: ${primary_purple_500};
  font-weight: 700;
`;

function AdvancedToggler() {
  return <Toggler>Create a poll</Toggler>;
}

export default AdvancedToggler;
