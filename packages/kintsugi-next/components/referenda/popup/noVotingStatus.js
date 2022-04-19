import { StatusWrapper } from "next-common/components/popup/styled";

export default function NoVotingStatus() {
  return (
    <StatusWrapper>
      <div className="no-data">No voting record</div>
    </StatusWrapper>
  )
}
