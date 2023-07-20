import Link from "next/link";
import { Index } from "../styled";
import styled from "styled-components";

const Title = styled.span`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
`;

export function PostTitle({ vote, isGov2 }) {
  let url = `/democracy/referendum/${vote.referendumIndex}`;
  if (isGov2) {
    url = `/referenda/referendum/${vote.referendumIndex}`;
  }
  return (
    <div>
      <Index>{`#${vote.referendumIndex}`}</Index>
      <Link href={url}>
        <Title>{vote.proposal?.title}</Title>
      </Link>
    </div>
  );
}
