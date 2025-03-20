import {
  PostTitle,
  ReferendumTag,
  FellowshipVoteItem,
} from "next-common/components/profile/votingHistory/common";
import Loading from "next-common/components/loading";

function ItemHeader({ vote }) {
  return (
    <div>
      <div className="flex justify-between items-center pb-[12px]">
        <PostTitle
          referendumIndex={vote.referendumIndex}
          title={vote.proposal?.title}
        />
      </div>
      <div className="flex justify-end pt-[12px] items-center">
        <ReferendumTag proposal={vote.proposal} />
      </div>
    </div>
  );
}

function FellowshipVoteListItem({ vote, showVoteTag }) {
  return (
    <div className="py-[16px] border-b border-b-neutral300">
      <ItemHeader vote={vote} />
      <div className="mt-[12px]">
        <FellowshipVoteItem vote={vote} showVoteTag={showVoteTag} />
      </div>
    </div>
  );
}

export default function MobileFellowshipVotesList({ data }) {
  if (!data) {
    return (
      <div className="flex justify-center w-full my-[16px]">
        <Loading size={20} />
      </div>
    );
  }

  if (data.items?.length === 0) {
    return (
      <div className="w-full text-center text-textTertiary">
        No current data
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[16px] text14Medium">
      {(data?.items || []).map((item) => (
        <FellowshipVoteListItem
          key={item.referendumIndex}
          vote={item}
          showVoteTag
        />
      ))}
    </div>
  );
}
