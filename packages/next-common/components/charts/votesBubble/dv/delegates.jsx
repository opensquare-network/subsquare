import DVDetailSection from "./section";

export default function DVDetailDelegates({ votes = [], allVotesValue }) {
  return (
    <DVDetailSection
      title="Delegates"
      votes={votes}
      allVotesValue={allVotesValue}
    />
  );
}
