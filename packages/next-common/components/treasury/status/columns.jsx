import { isEmpty, pick } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import { AddressUser } from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import { cn } from "next-common/utils";

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

function AwardedValueTitle({ tooltip }) {
  return (
    <div className="inline-flex items-center gap-x-1">
      <span className="text-textTertiary">Value</span>
      <Tooltip content={tooltip} />
    </div>
  );
}

export function getBeneficiariesValueAtAwardedTimeColumn() {
  return {
    name: <AwardedValueTitle tooltip="Value at awarded time" />,
    style: {
      textAlign: "right",
      width: "180px",
    },
    cellRender(data) {
      return (
        <ValueDisplay
          value={data.totalBenefitFiatValueAtFinal || 0}
          symbol=""
          prefix="$"
        />
      );
    },
  };
}

export function getBeneficiariesValueAtProposedTimeColumn() {
  return {
    name: <AwardedValueTitle tooltip="Value at proposed time" />,
    style: {
      textAlign: "right",
      width: "180px",
    },
    cellRender(data) {
      return (
        <ValueDisplay
          value={data.totalBenefitFiatValue || 0}
          symbol=""
          prefix="$"
        />
      );
    },
  };
}

export function getBeneficiariesTagsColumn() {
  return {
    name: "Tags",
    style: {
      width: "180px",
    },
    cellRender(data) {
      return <BeneficiariesTags tags={data.tags} />;
    },
  };
}

function BeneficiariesTags({ tags = [] }) {
  if (isEmpty(tags)) {
    return <span className="text14Medium text-textTertiary">-</span>;
  }

  return (
    <Tooltip content={tags.join(", ")}>
      <div className="max-w-[160px] truncate">
        {tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "text14Medium text-textTertiary capitalize",
              "after:content-[','] after:inline-block",
              "last:after:content-['']",
            )}
          >
            {tag}
          </span>
        ))}
      </div>
    </Tooltip>
  );
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
