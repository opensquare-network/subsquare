import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { cn } from "next-common/utils";

export const Wrapper = styled(Flex)`
  align-items: flex-start;
  flex-wrap: wrap;
  color: var(--textSecondary);
`;

export const GreyWrapper = styled(GreyPanel)`
  flex-flow: wrap;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  padding: 8px 12px;
  margin-top: 16px;
`;

export const GreyItem = styled.div`
  display: inline-block;
  margin-right: 12px;

  > .username {
    color: var(--textSecondary);
  }
`;

/**
 * @param {{noHover, highlight} & React.HTMLProps<HTMLDivElement>} props
 */
export function Item({ noHover, highlight, ...props } = {}) {
  return (
    <Flex
      role="button"
      {...props}
      className={cn(
        "text14Medium",
        "text-textTertiary [&_svg_path]:fill-textTertiary [&_svg_path]:stroke-textTertiary",
        "space-x-2",
        "hover:text-textSecondary [&_svg_path]:hover:fill-textSecondary [&_svg_path]:hover:stroke-textSecondary",
        noHover && "pointer-events-none",
        highlight &&
          "text-textSecondary [&_svg_path]:fill-textSecondary [&_svg_path]:stroke-textSecondary",
        props.className,
      )}
    />
  );
}
