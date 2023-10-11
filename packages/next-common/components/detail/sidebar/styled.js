import styled from "styled-components";
import ExternalLink from "next-common/components/externalLink";
import tw from "tailwind-styled-components";

const Link = tw(ExternalLink)`
  inline-flex items-center gap-2
  text-textTertiary text12Medium
  max-md:mx-6
`;

export { Link };

export const InlineWrapper = styled.div``;
