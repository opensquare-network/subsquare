import React from "react";
import { ListWrapper } from "next-common/components/postList/styled";
import MaybeEmpty from "next-common/components/emptyList";
import ListTitleBar from "next-common/components/listTitleBar";
import Pagination from "next-common/components/pagination/index.js";
import businessCategory from "next-common/utils/consts/business/category";
import PostItem from "./postItem";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import UnVotedOnlyOption from "next-common/components/referenda/unVotedOnlyOption";
import NewFellowshipProposalButton from "next-common/components/summary/newFellowshipProposalButton";
import { useUnVotedOnlyContext } from "next-common/components/referenda/list/unVotedContext";

function ListTitleWithUnVoteOption({
  isUnVotedOnlyLoading,
  total,
  hasNewButton,
}) {
  const address = useRealAddress();
  const { unVotedOnly, setUnVotedOnly } = useUnVotedOnlyContext();

  return (
    <ListTitleBar
      title="List"
      titleCount={isUnVotedOnlyLoading ? "Filtering un-voted..." : total}
      titleExtra={
        <div className="flex gap-[12px] items-center">
          {address && (
            <UnVotedOnlyOption
              tooltip="Only referenda I can but haven't voted"
              isLoading={isUnVotedOnlyLoading}
              isOn={unVotedOnly}
              setIsOn={setUnVotedOnly}
            />
          )}
          {hasNewButton && <NewFellowshipProposalButton />}
        </div>
      }
    />
  );
}

function ListTitle({
  hasUnVotedOption,
  total,
  isUnVotedOnlyLoading,
  hasNewButton,
}) {
  if (hasUnVotedOption) {
    return (
      <ListTitleWithUnVoteOption
        isUnVotedOnlyLoading={isUnVotedOnlyLoading}
        total={total}
      />
    );
  }

  return (
    <ListTitleBar
      title="List"
      titleCount={total}
      titleExtra={hasNewButton && <NewFellowshipProposalButton />}
      link="/fellowship"
    />
  );
}

export default function FellowshipReferendaPostList({
  items,
  pagination,
  total,
  hasUnVotedOption,
  isUnVotedOnlyLoading,
  hasNewButton,
}) {
  return (
    <ListWrapper>
      <ListTitle
        isUnVotedOnlyLoading={isUnVotedOnlyLoading}
        total={total}
        hasUnVotedOption={hasUnVotedOption}
        hasNewButton={hasNewButton}
      />
      <MaybeEmpty items={items} type={businessCategory.fellowship}>
        {items.map((data, index) => (
          <PostItem key={index} data={data} />
        ))}
      </MaybeEmpty>
      <Pagination {...pagination} />
    </ListWrapper>
  );
}
