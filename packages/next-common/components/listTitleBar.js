import styled from "styled-components";
import { TitleContainer } from "./styled/containers/titleContainer";
import Link from "next-common/components/link";
import { cn } from "next-common/utils";

const TitleLink = styled.span`
  &:hover {
    text-decoration: underline;
  }
`;

export default function ListTitleBar({
  titleContainerClassName,
  className,
  title = "",
  titleCount = null,
  titleExtra = null,
  link,
}) {
  return (
    <TitleContainer
      className={cn(
        "max-sm:flex-col max-sm:!items-start max-sm:gap-[8px]",
        titleContainerClassName,
      )}
    >
      <div className={className}>
        {link ? (
          <Link href={link || ""} passHref>
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
