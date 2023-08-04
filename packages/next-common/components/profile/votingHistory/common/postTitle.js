import Link from "next/link";
import { Index } from "../styled";
import styled from "styled-components";
import clsx from "clsx";

const Title = styled.span`
  font-style: normal;
  font-weight: 500;
`;

export function PostTitle({
  referendumIndex,
  title,
  isGov2,
  noLink,
  className,
}) {
  let url = `/democracy/referendum/${referendumIndex}`;
  if (isGov2) {
    url = `/referenda/referendum/${referendumIndex}`;
  }
  return (
    <span className={clsx("truncate max-w-[inherit]", className)}>
      <Index>{`#${referendumIndex}`}</Index>
      {noLink ? (
        <Title>{title}</Title>
      ) : (
        <Link href={url} title={title}>
          <Title>{title}</Title>
        </Link>
      )}
    </span>
  );
}
