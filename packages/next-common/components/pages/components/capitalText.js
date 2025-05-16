import styled from "styled-components";

const Span = styled.span`
  text-transform: capitalize;
`;

export default function CapitalText({ children }) {
  return <Span>{children}</Span>;
}
