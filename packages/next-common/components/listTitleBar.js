import styled from "styled-components";
import { TitleContainer } from "./styled/containers/titleContainer";
import Link from "next/link";

const TitleLink = styled.a`
  &:hover {
    text-decoration: underline;
  }
`;

export default function ListTitleBar({
  className,
  title = "",
  titleCount = null,
  titleExtra = null,
  link,
}) {
  return (
    <TitleContainer className="max-sm:flex-col max-sm:!items-start max-sm:gap-[8px]">
      <div className={className}>
        {link ? (
          <Link href={link || ""} passHref legacyBehavior>
            <TitleLink>{title}</TitleLink>
          </Link>
        ) : (
          <span>{title}</span>
        )}

        {!!titleCount && (
          <small className="text-textTertiary ml-2 text14Medium">
            {titleCount}
          </small>
        )}
      </div>
      {titleExtra}
    </TitleContainer>
  );
}
