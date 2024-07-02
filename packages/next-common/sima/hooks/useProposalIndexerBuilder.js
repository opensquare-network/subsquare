import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import getReferendaProposalIndexer from "../utils/getProposalIndexer";

export default function useProposalIndexerBuilder() {
  const type = useDetailType();
  if (type === detailPageCategory.GOV2_REFERENDUM) {
    return getReferendaProposalIndexer;
  }
  throw new Error("Invalid detail type for useProposalIndexerBuilder");
}
