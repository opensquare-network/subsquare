import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { MapDataList } from "next-common/components/dataList";
import { useValueFromBatchResult } from "next-common/context/batch";
import FieldLoading from "next-common/components/icons/fieldLoading";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";
import Tag from "next-common/components/tags/state/tag";
import businessCategory from "next-common/utils/consts/business/category";
import { ReferendaPostProvider } from "./context";
import { VoteButtons } from "./iconButton";
import MyVote from "./myVote";
import Flex from "next-common/components/styled/flex";
import PostListCardVotesSummaryBar from "next-common/components/postList/votesSummaryBar";

function ReferendumTitle({ referendumIndex }) {
  const { value: referendumInfo } = useValueFromBatchResult(referendumIndex);
  if (!referendumInfo) {
    return <FieldLoading size={16} />;
  }

  const hasTally =
    referendumInfo.onchainData?.tally ||
    referendumInfo.onchainData?.info?.tally;

  return (
    <div>
      <a
        className="max-w-[360px] group"
        href={`/fellowship/${referendumIndex}`}
        target="_blank"
        rel="noreferrer"
      >
        #{referendumIndex} ·{" "}
        <span className="group-hover:underline">
          {referendumInfo.title || `Referendum #${referendumIndex}`}
        </span>
      </a>
      {hasTally && (
        <Flex>
          <PostListCardVotesSummaryBar
            data={referendumInfo}
            type={businessCategory.fellowship}
          />
        </Flex>
      )}
    </div>
  );
}

function ReferendumStatus({ referendumIndex }) {
  const { value: referendumInfo } = useValueFromBatchResult(referendumIndex);

  if (!referendumInfo) {
    return <FieldLoading size={16} />;
  }

  const args = getGov2ReferendumStateArgs(referendumInfo.state);
  return (
    <Tag
      state={referendumInfo.state.name}
      args={args}
      category={businessCategory.fellowship}
    />
  );
}

function Title({ count }) {
  return (
    <span>
      To Vote Referenda <span className="text-textTertiary">{count}</span>
    </span>
  );
}

const colReferendum = {
  name: "Referendum",
  style: {
    textAlign: "left",
  },
  render: ({ referendumIndex }) => {
    return <ReferendumTitle referendumIndex={referendumIndex} />;
  },
};

const colStatus = {
  name: "Status",
  style: {
    textAlign: "right",
    width: "120px",
  },
  render: ({ referendumIndex }) => (
    <ReferendumStatus referendumIndex={referendumIndex} />
  ),
};

function UnVotedReferendaList() {
  const { referendaToVote } = usePopupParams();
  const columnsDef = [
    colReferendum,
    colStatus,
    {
      name: "Vote",
      style: {
        textAlign: "right",
        width: "120px",
      },
      render: ({ referendumIndex }) => {
        return (
          <div className="flex justify-end gap-[8px]">
            <VoteButtons referendumIndex={referendumIndex} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-[16px]">
      <span className="text14Bold">
        Un-voted{" "}
        <span className="text-textTertiary">{referendaToVote?.length}</span>
      </span>
      <MapDataList
        columnsDef={columnsDef}
        data={referendaToVote}
        noDataText="All the referenda have voted"
      />
    </div>
  );
}

function VotedReferendaList() {
  const { referendaVotes } = usePopupParams();

  const columnsDef = [
    colReferendum,
    colStatus,
    {
      name: "Vote",
      style: {
        textAlign: "right",
        width: "120px",
      },
      render: (vote) => {
        return (
          <div className="flex justify-end gap-[8px]">
            <MyVote vote={vote} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-[16px]">
      <span className="text14Bold">
        Voted{" "}
        <span className="text-textTertiary">{referendaVotes?.length}</span>
      </span>
      <MapDataList
        columnsDef={columnsDef}
        data={referendaVotes}
        noDataText="No vote yet"
      />
    </div>
  );
}

function PopupContent() {
  return (
    <div className="flex flex-col gap-[16px]">
      <UnVotedReferendaList />
      <VotedReferendaList />
    </div>
  );
}

export default function ReferendaToVotePopup(props) {
  const { referendaToVote } = props;
  return (
    <PopupWithSigner
      title={<Title count={referendaToVote?.length} />}
      {...props}
    >
      <ReferendaPostProvider>
        <PopupContent />
      </ReferendaPostProvider>
    </PopupWithSigner>
  );
}
