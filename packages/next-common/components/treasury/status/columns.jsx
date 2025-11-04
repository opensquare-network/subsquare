import { pick } from "lodash-es";
import { useCommittedFilterState } from "next-common/components/dropdownFilter/context";
import Tooltip from "next-common/components/tooltip";
import { AddressUser } from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";

export function getBeneficiariesIdColumn() {
  return {
    name: "ID",
    cellRender(data) {
      return <AddressUser add={data.address} link="/treasury" />;
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

function AwardedValue({ data }) {
  const [{ sort_by }] = useCommittedFilterState();

  if (sort_by === "awarded_value") {
    return (
      <ValueDisplay
        value={data.totalBenefitFiatValueAtFinal || 0}
        symbol=""
        prefix="$"
      />
    );
  }

  return (
    <ValueDisplay
      value={data.totalBenefitFiatValue || 0}
      symbol=""
      prefix="$"
    />
  );
}

export function getBeneficiariesAwardedColumn(name = "Awarded") {
  return {
    name,
    style: {
      textAlign: "right",
      width: "180px",
    },
    cellRender(data) {
      return <AwardedValue data={data} />;
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
