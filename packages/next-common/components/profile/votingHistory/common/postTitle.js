import Link from "next/link";
import { Index } from "../styled";
import styled from "styled-components";
import clsx from "clsx";
import { useIsReferenda } from "./moduleTab";

const Title = styled.span`
  font-style: normal;
  font-weight: 500;
`;

export function PostTitle({ referendumIndex, title, noLink, className }) {
  const isReferenda = useIsReferenda();
  let url = `/democracy/referendum/${referendumIndex}`;
  if (isReferenda) {
    url = `/referenda/referendum/${referendumIndex}`;
  }
  return (
    <div className={clsx("truncate max-w-[inherit]", className)}>
      <Index>{`#${referendumIndex}`}</Index>
      {noLink ? (
        <Title>{title}</Title>
      ) : (
        <Link href={url} title={title}>
          <Title>{title}</Title>
        </Link>
      )}
    </div>
  );
}
