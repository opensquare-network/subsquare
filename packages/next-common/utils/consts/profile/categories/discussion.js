import Chains from "../../chains";
import normalizeDiscussionListItem from "../../../viewfuncs/discussion/normalizeDiscussionListItem";
import normalizePolkassemblyDiscussionListItem from "../../../viewfuncs/discussion/normalizePaListItem";
import businessCategory from "../../business/category";

export const discussionCategory = {
  id: "discussions",
  name: "Discussions",
  children: [
    {
      id: "posts",
      name: "Posts",
      categoryId: businessCategory.discussions,
      routePath: "discussions",
      apiPath: "posts",
      formatter: normalizeDiscussionListItem,
    },
    {
      id: "comments",
      name: "Comments",
      categoryId: "Comments",
      routePath: "comments",
      apiPath: "comments",
      formatter: (chain, comment) => comment,
    },
    {
      id: "polkassemblyDiscussions",
      name: "Polkassembly posts",
      categoryId: businessCategory.polkassemblyDiscussions,
      routePath: "polkassembly/discussions",
      apiPath: "polkassembly-discussions",
      formatter: normalizePolkassemblyDiscussionListItem,
      excludeChains: (() => {
        return Object.values(Chains).filter(
          (v) => ![Chains.kusama, Chains.polkadot].includes(v),
        );
      })(),
    },
  ],
};
