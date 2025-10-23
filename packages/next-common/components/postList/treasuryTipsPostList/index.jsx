import Pagination from "next-common/components/pagination/index.js";
import ListTitleBar from "../../listTitleBar";
import MaybeEmpty from "next-common/components/emptyList";
import businessCategory from "next-common/utils/consts/business/category";
import { ListWrapper } from "../styled";
import PostItem from "./postItem";
import useHasTips from "next-common/hooks/treasury/useHasTips";
import { useChainSettings } from "next-common/context/chain";
import NewTipButton from "next-common/components/treasury/tip/newTipButton";

export function NewTipButtonExtra() {
  const { hideActionButtons } = useChainSettings();
  const hasTips = useHasTips();

  if (!hideActionButtons && hasTips) {
    return null;
  }

  return <NewTipButton />;
}

export default function TreasuryTipsPostList({
  titleCount = null,
  items,
  pagination,
  titleExtra,
}) {
  return (
    <>
      <ListWrapper>
        <ListTitleBar
          title="Proposed treasury tips"
          link="/treasury/tips"
          titleCount={titleCount}
          titleExtra={titleExtra}
        />
        <MaybeEmpty items={items} type={businessCategory.treasuryTips}>
          {items.map((data, index) => (
            <PostItem key={index} data={data} />
          ))}
        </MaybeEmpty>
        <Pagination {...pagination} />
      </ListWrapper>
    </>
  );
}
