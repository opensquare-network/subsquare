import { pick } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import { AddressUser } from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";

export function getBeneficiariesIdColumn() {
  return {
    name: "ID",
    cellRender(data) {
      return <AddressUser add={data.address} />;
    },
  };
}

export function getBeneficiariesProposalColumn() {
  return {
    name: "Proposals",
    style: {
      textAlign: "right",
    },
    cellRender(data) {
      return <BeneficiariesProposal proposal={data} />;
    },
  };
}

export function getBeneficiariesAwardedColumn() {
  return {
    name: "Awarded",
    style: {
      textAlign: "right",
      width: "160px",
    },
    cellRender(data) {
      return (
        <ValueDisplay value={data.totalBenefitFiatValue} symbol="" prefix="$" />
      );
    },
  };
}

const proposalKeys = {
  bounties: {
    key: "B",
    fullName: "Bounties",
  },
  childBounties: {
    key: "b",
    fullName: "Child Bounties",
  },
  proposals: {
    key: "P",
    fullName: "Proposals",
  },
  spends: {
    key: "S",
    fullName: "Spends",
  },
  tips: {
    key: "T",
    fullName: "Tips",
  },
};

function BeneficiariesProposal({ proposal }) {
  const pickProps = pick(proposal, Object.keys(proposalKeys));

  const entries = Object.entries(pickProps).filter(
    ([, value]) => value.benefitCount > 0,
  );

  return (
    <div className="flex justify-end gap-x-1">
      {entries.map(([key, value], index) => (
        <span key={key} className="inline-flex items-center gap-x-1">
          {value.benefitCount}{" "}
          <Tooltip
            content={
              <>
                {proposalKeys[key].fullName}{" "}
                <ValueDisplay
                  value={value.benefitFiatValue}
                  symbol=""
                  prefix="$"
                />
              </>
            }
          >
            <span className="bg-theme100 rounded-full inline-flex items-center justify-center w-4 h-4 text-theme500 text12Bold">
              {proposalKeys[key].key}
            </span>
          </Tooltip>
          {index < entries.length - 1 && (
            <span className="text14Medium text-textTertiary">+</span>
          )}
        </span>
      ))}
    </div>
  );
}
