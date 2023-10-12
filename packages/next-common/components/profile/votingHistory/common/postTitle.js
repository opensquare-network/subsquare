import Link from "next/link";
import { Index } from "../styled";
import styled from "styled-components";
import { cn } from "next-common/utils";
import { useTitleLink } from "./moduleTab";

const Title = styled.span`
  font-style: normal;
  font-weight: 500;
`;

export function PostTitle({ referendumIndex, title, noLink, className }) {
  const url = useTitleLink(referendumIndex);
  return (
    <div className={cn("truncate max-w-[inherit] text-textPrimary", className)}>
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
