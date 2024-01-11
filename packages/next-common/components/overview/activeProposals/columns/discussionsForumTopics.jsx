import {
  getLastActivityColumn,
  getReferendumPostTitleColumn,
  getVoteSummaryColumn,
} from ".";

// https://forum.polkadot.network/categories.json
const categories = {
  1: {
    name: "Miscellaneous",
    color: ["#0088cc"],
  },
  5: {
    name: "Polkadot Forum Meta",
    color: ["#B3B5B4"],
  },
  6: {
    name: "Tech Talk",
    color: ["#0088cc"],
  },
  9: {
    name: "Profiles",
    color: ["#b3b5b4"],
  },
  11: {
    name: "Governance",
    color: ["#0088cc"],
  },
  24: {
    name: "Ecosystem",
    color: ["#F1592A"],
  },
  25: {
    name: "Digest",
    color: ["#F25A2A", "#0088cc"],
  },
  27: {
    name: "Suggestions",
    color: ["#b3b5b4", "#0088cc"],
  },
  // fallback
  unknown: {
    name: "--",
    color: ["#b3b5b4"],
  },
};

const topicColumn = {
  ...getReferendumPostTitleColumn(),
  name: "Topic",
};

const categoryColumn = {
  name: "Category",
  className: "w-[120px]",
  cellRender(data) {
    const category = categories[data?.category_id] || categories.unknown;

    return (
      <div className="flex items-center">
        <div
          className="w-2 h-2 min-w-[8px] min-h-[8px] mr-2"
          style={{
            backgroundImage: `linear-gradient(to right, ${
              category.color[0]
            } 50%, ${category.color[1] || category.color[0]} 50%)`,
          }}
        />
        <div className="line-clamp-1">{category.name}</div>
      </div>
    );
  },
};

export const discussionsForumTopicsColumns = [
  topicColumn,
  getLastActivityColumn(),
  getVoteSummaryColumn(),
  categoryColumn,
];
