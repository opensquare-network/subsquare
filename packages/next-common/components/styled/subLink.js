import styled from "styled-components";

const SubLink = styled.a`
  display: inline-block;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: ${(props) =>
    props.disabled ? "var(--textTertiary)" : "var(--theme500)"};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

export default SubLink;
