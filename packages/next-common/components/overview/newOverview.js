import AccountInfo from "./accountInfo";
import ActiveProposals from "./activeProposals";
import tw from "tailwind-styled-components";

const Wrapper = tw.div`
  flex
  flex-col
`;

export default function NewOverview() {
  return (
    <Wrapper className="gap-y-6">
      <AccountInfo />

      <div>
        <ActiveProposals />
        {/* news */}
      </div>
    </Wrapper>
  );
}
