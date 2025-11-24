import { pick } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import { AddressUser } from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import tw from "tailwind-styled-components";

const Tag = tw.span`
  inline-flex items-center
  py-0.5 px-2
  text12Medium
  rounded-full
  capitalize
  cursor-default
  text-textSecondary
  bg-neutral200
`;

export function getBeneficiariesIdColumn() {
  return {
    name: "ID",
    cellRender(data) {
      return <AddressUser add={data.address} link="/treasury" />;
    },
  };
}

export function getBeneficiariesTagsColumn() {
  return {
    name: "",
    width: "120px",
    cellRender(data) {
      return data.tags?.map((tag) => <Tag key={tag}>{tag}</Tag>);
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
      width: "120px",
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
      width: "120px",
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
