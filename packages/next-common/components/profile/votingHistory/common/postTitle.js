import Link from "next/link";
import { Index } from "../styled";
import styled from "styled-components";

const Title = styled.span`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
`;

export function PostTitle({ referendumIndex, title, isGov2 }) {
  let url = `/democracy/referendum/${referendumIndex}`;
  if (isGov2) {
    url = `/referenda/referendum/${referendumIndex}`;
  }
  return (
    <div className="truncate max-w-[inherit]">
      <Index>{`#${referendumIndex}`}</Index>
      <Link href={url} title={title}>
        <Title>{title}</Title>
      </Link>
    </div>
  );
}
