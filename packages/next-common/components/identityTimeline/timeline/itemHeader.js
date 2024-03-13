// import styled from "styled-components";
// import { Flex, FlexColumn } from "../styled/flex";
// import { Inter_14_500 } from "../../styles/text";
import BlockTime from "./blockTime";
import BlockHeight from "./blockHeight";
import Link from "./link";
import { isNil } from "lodash-es";
import { useChain } from "next-common/context/chain";
// import { MOBILE_SIZE } from "@osn/constants";

// const Wrapper = styled(FlexColumn)`
//   padding: 8px 48px 24px 0;
//   min-width: 280px;
//   @media screen and (max-width: ${MOBILE_SIZE}px) {
//     padding: 8px 0 24px 0;
//     min-width: auto;
//   }

//   > :nth-child(1) {
//     margin-bottom: 8px;
//   }
//   > :nth-child(2) {
//     margin-bottom: 8px;
//   }
//   > :nth-child(3) {
//     margin-bottom: 12px;
//   }
// `;

// const Title = styled.div`
//   ${Inter_14_500}
//   color: ${(p) => p.theme.fontPrimary};
// `;

// const Links = styled(Flex)`
//   > :nth-child(1) {
//     margin-right: 8px;
//   }
// `;

export default function TimelineItemInfoHeader({ item }) {
  const chain = useChain();
  return (
    <div className="flex flex-col py-[8px] gap-[8px] min-w-[280px] max-sm:min-w-fit">
      <div className="text14Bold text-textPrimary">{item.name}</div>
      <div className="flex flex-col gap-[4px]">
        <BlockTime ts={item.indexer.blockTime} />
        <BlockHeight number={item.indexer.blockHeight} />
      </div>
      <div className="flex gap-[8px]">
        <Link
          name="Extrinsic"
          href={`https://${chain}.statescan.io/#/extrinsics/${item.indexer.blockHeight}-${item.indexer.extrinsicIndex}`}
        />
        {!isNil(item.indexer.eventIndex) && (
          <Link
            name="Event"
            href={`https://${chain}.statescan.io/#/events/${item.indexer.blockHeight}-${item.indexer.eventIndex}`}
          />
        )}
      </div>
    </div>
  );
}
