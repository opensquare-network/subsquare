import PostItem from "./postItem";
import MaybeEmpty from "next-common/components/emptyList";
import { useChainSettings } from "next-common/context/chain";
import ListTitleBar from "next-common/components/listTitleBar";
import Pagination from "next-common/components/pagination/index.js";
import { ListWrapper } from "next-common/components/postList/styled";
import businessCategory from "next-common/utils/consts/business/category";
import NewTreasuryProposal from "next-common/components/treasury/proposal/newTreasuryProposal";
import { PapiProvider } from "next-common/context/papi";
import { TreasuryApprovalsProvider } from "next-common/context/treasury/approvals";
import { TreasuryProvider } from "next-common/context/treasury";

export function NewTreasuryProposalButton() {
  const { showNewTreasuryProposalButton } = useChainSettings();
  if (!showNewTreasuryProposalButton) {
    return null;
  }

  return <NewTreasuryProposal />;
}

export default function TreasuryProposalsPostList({
  title = "List",
  titleCount,
  items,
  pagination,
  titleExtra,
}) {
  return (
    <>
      <ListWrapper>
        <ListTitleBar
          title={title}
          link="/treasury/proposals"
          titleCount={titleCount}
          titleExtra={titleExtra}
        />
        <MaybeEmpty items={items} type={businessCategory.treasuryProposals}>
          <TreasuryProvider>
            <PapiProvider>
              <TreasuryApprovalsProvider>
                {items.map((data, index) => (
                  <PostItem key={index} data={data} />
                ))}
              </TreasuryApprovalsProvider>
            </PapiProvider>
          </TreasuryProvider>
        </MaybeEmpty>
        <Pagination {...pagination} />
      </ListWrapper>
    </>
  );
}
