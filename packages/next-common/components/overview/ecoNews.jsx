import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Link from "next/link";

const items = [
  {
    title: "Kusama Parachain Auction #111",
    link: "https://polkadot.subsquare.io/referenda/1751?tab=votes_bubble",
    proposer: "",
  },
  {
    title: "DOT tokens were unlocked from Polkadot Crowdloans on October 24",
    link: "https://polkadot.subsquare.io/referenda/1751?tab=votes_bubble",
    proposer: "",
  },
  {
    title:
      "Five New Parachains, Staking Growth & Technical Upgrades as Expansion Continues",
    link: "https://polkadot.subsquare.io/referenda/1751?tab=votes_bubble",
    proposer: "",
  },
  {
    title: "This is an event title",
    link: "https://polkadot.subsquare.io/referenda/1751?tab=votes_bubble",
    proposer: "",
  },
];

export default function EcoNews() {
  return (
    <div className="md:w-[320px] flex-shrink-0">
      <TitleContainer className="mb-4">Eco News</TitleContainer>
      <div className="p-6 bg-neutral100 shadow-100 border border-neutral300 rounded-xl">
        <ul className="list-disc text14Medium text-textPrimary space-y-4">
          {items.map((item, index) => (
            <li key={index}>
              <Link
                href={item.link}
                target="_block"
                className="hover:underline"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
