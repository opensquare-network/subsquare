import { useMemo } from "react";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import { useFellowshipMemberRank } from "next-common/hooks/fellowship/useFellowshipMemberRank";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";

const BaseTemplate = `

## Member details

- Matrix username: 
- Polkadot address: 
- Current rank: 
- Date of initial induction:
- Date of last report: 
- Area(s) of Expertise/Interest: 


## Reporting period

- Start date: YYYY/MM/DD
- End date: YYYY/MM/DD


## Argument
*Explain why your contributions in relation to Polkadot are worthy of retention/promotion. Refer to the terms in Section 6 of the [Manifesto](https://github.com/polkadot-fellows/manifesto/blob/main/manifesto.pdf) and provide links to relevant content (e.g. code, articles, media, etc.) to show that you are meeting all the requirements.*

Below are some examples on how to write an argument for:
- Retention: [Rank 1](https://collectives.subsquare.io/fellowship/referenda/289), [Rank 2](https://collectives.subsquare.io/fellowship/referenda/282), [Rank 3](https://collectives.subsquare.io/fellowship/referenda/244)
- Promotion [Rank 1](https://collectives.subsquare.io/fellowship/referenda/272), [Rank 2](https://collectives.subsquare.io/fellowship/referenda/306), [Rank 3](https://collectives.subsquare.io/fellowship/referenda/255).


## Voting record
*Provide your voting record in relation to required thresholds for your rank.* 

|  Ranks | Activity thresholds | Agreement thresholds | Member's voting activities | Comments |
|---|---|---|---|---|
|III|70%   |100%  |I have voted on x out of xx referenda in which I was eligible to vote (i.e xx % voting activity). Out of xx referenda in which members of higher ranks were in complete agreement, I have voted in line with the consensus x times (i.e xx % voting agreement).  |*This is an example.* |
|I  |90%   |N/A   |   |  |
|II |80%   |N/A   |   |  |
|III|70%   |100%  |   |  |
|IV |60%   |90%   |   |  |
|V  |50%   |80%   |   |  |
|VI |40%   |70%   |   |  |


## Misc

- [ ] Question(s): 

- [ ] Concern(s): 

- [ ] Comment(s): 
`;

export default function useFellowshipEvidenceTemplate(wish) {
  const signerAccount = useSignerAccount();
  const collectivePallet = useRankedCollectivePallet();
  const address = signerAccount?.realAddress;
  const name = signerAccount?.meta?.name || address || "Name of the proposer";
  const rank = useFellowshipMemberRank(address, collectivePallet);

  return useMemo(() => {
    if (!rank || !wish || !address) {
      return null;
    }

    const timestamp = new Date().getTime();
    const formattedDate = formatTime(timestamp, "YYYY/MM/DD");

    const titleText =
      wish === "retention"
        ? `# Argument-0000: Retention at Rank ${rank || "____"}`
        : `# Argument-0000: Promotion to Rank ${rank + 1 || "____"}`;

    const tableSection = `
|                 |                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------- |
| **Report Date** | Date of submission (${formattedDate})                                             |
| **Submitted by**| ${name}                                                                    |`;

    return `${titleText} ${tableSection} ${BaseTemplate}`;
  }, [rank, wish, address, name]);
}
