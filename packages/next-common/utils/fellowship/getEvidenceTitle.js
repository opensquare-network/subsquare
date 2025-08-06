export default function getEvidenceTitle({ wish, rank, title }) {
  if (title) {
    return title;
  }

  if (wish && rank) {
    const adposition = wish === "Retention" ? "at" : "to";
    const realRankValue = wish === "Promotion" ? rank + 1 : rank;
    return `${wish} ${adposition} Rank ${realRankValue}`;
  }

  return "-";
}
