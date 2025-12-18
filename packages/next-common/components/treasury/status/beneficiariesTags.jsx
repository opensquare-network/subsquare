import { isEmpty } from "lodash-es";
import { useEffect, useRef, useState } from "react";
import Tooltip from "next-common/components/tooltip";
import tw from "tailwind-styled-components";

const TagsWrapper = tw.div`
  flex gap-2
  relative
  overflow-hidden
`;

const TagsContainer = tw.div`
  flex gap-2
  overflow-hidden
  flex-1
  min-w-0
`;

const EllipsisIndicator = tw.span`
  absolute right-0 top-0 bottom-0
  flex items-center
  text-textTertiary text12Medium
  pointer-events-none
  bg-gradient-to-l from-white via-white to-transparent
  pl-1
`;

const Tag = tw.div`
  text12Medium capitalize
  flex justify-center items-center
  py-0.5 px-2
  border border-neutral400 rounded
  whitespace-nowrap text-textSecondary
  flex-shrink-0
`;

export default function BeneficiariesTags({ tags = [], maxWidth = 220 }) {
  const containerRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (containerRef?.current) {
      const container = containerRef.current;
      const isOverflow = container.scrollWidth > maxWidth;
      setIsOverflowing(isOverflow);
    }
  }, [tags, maxWidth]);

  if (isEmpty(tags)) {
    return <span className="text14Medium text-textTertiary">-</span>;
  }

  return (
    <Tooltip content={tags.join(", ")}>
      <TagsWrapper style={{ maxWidth }}>
        <TagsContainer ref={containerRef}>
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagsContainer>
        {isOverflowing && <EllipsisIndicator>...</EllipsisIndicator>}
      </TagsWrapper>
    </Tooltip>
  );
}
