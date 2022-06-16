import styled from "styled-components";
import { primary_purple_500 } from "next-common/styles/colors";

const Toggler = styled.button`
  user-select: none;
  background-color: transparent;
  border: none;
  color: ${primary_purple_500};
  font-weight: 700;
  cursor: pointer;
`;

function AdvancedToggler({ isAdvanced, setIsAdvanced = () => {} }) {
  return (
    <Toggler onClick={() => setIsAdvanced(!isAdvanced)}>
      {isAdvanced ? "Cancel" : "Create a poll"}
    </Toggler>
  );
}

export default AdvancedToggler;
