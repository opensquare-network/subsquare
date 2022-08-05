import styled from "styled-components";

const SubLink = styled.a`
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.primaryPurple500};
  cursor: pointer;
`;

export default SubLink;
