import Pagination from "next-common/components/pagination/index.js";
import ListTitleBar from "../../../listTitleBar";
import MaybeEmpty from "next-common/components/emptyList";
import businessCategory from "next-common/utils/consts/business/category";
import { ListWrapper } from "../../styled";
import PostItem from "./postItem";
import useHasTips from "next-common/hooks/treasury/useHasTips";
import { useChainSettings } from "next-common/context/chain";
import NewTipButton from "next-common/components/treasury/tip/newTipButton";

function NewTipButtonExtra() {
  const { hideActionButtons } = useChainSettings();
  const hasTips = useHasTips();

  if (!hideActionButtons && hasTips) {
    return null;
  }

  return <NewTipButton />;
}

export default function PostList({ titleCount = null, items, pagination }) {
  return (
    <>
      <ListWrapper>
        <ListTitleBar
          title="List"
          titleCount={titleCount}
          titleExtra={<NewTipButtonExtra />}
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
