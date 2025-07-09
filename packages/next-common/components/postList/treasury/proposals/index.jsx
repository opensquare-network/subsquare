import PostItem from "./postItem";
import MaybeEmpty from "next-common/components/emptyList";
import { useChainSettings } from "next-common/context/chain";
import ListTitleBar from "next-common/components/listTitleBar";
import Pagination from "next-common/components/pagination/index.js";
import { ListWrapper } from "next-common/components/postList/styled";
import businessCategory from "next-common/utils/consts/business/category";
import NewTreasuryProposal from "next-common/components/treasury/proposal/newTreasuryProposal";

export default function TreasuryProposalsPostList({
  titleCount,
  items,
  pagination,
}) {
  const { showNewTreasuryProposalButton } = useChainSettings();
  return (
    <>
      <ListWrapper>
        <ListTitleBar
          title="List"
          titleCount={titleCount}
          titleExtra={
            showNewTreasuryProposalButton && (
              <div className="flex justify-end">
                <NewTreasuryProposal />
              </div>
            )
          }
        />
        <MaybeEmpty items={items} type={businessCategory.treasuryProposals}>
          {items.map((data, index) => (
            <PostItem key={index} data={data} />
          ))}
        </MaybeEmpty>
        <Pagination {...pagination} />
      </ListWrapper>
    </>
  );
}
