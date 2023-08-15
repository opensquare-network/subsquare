import Link from "next/link";
import { Index } from "../styled";
import styled from "styled-components";
import clsx from "clsx";
import { useModuleName } from "./moduleTab";

const Title = styled.span`
  font-style: normal;
  font-weight: 500;
`;

export function PostTitle({ referendumIndex, title, noLink, className }) {
  const module = useModuleName();
  const url = `/${module}/referendum/${referendumIndex}`;
  return (
    <div
      className={clsx("truncate max-w-[inherit] text-textPrimary", className)}
    >
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
