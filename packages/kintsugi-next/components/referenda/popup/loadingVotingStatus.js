import { StatusWrapper } from "next-common/components/popup/styled";
import Loading from "next-common/components/loading";

export default function LoadingVotingStatus() {
  return (
    <StatusWrapper>
      <div style={{display: "flex"}}>
        <Loading size={14} />
      </div>
    </StatusWrapper>
  )
}
