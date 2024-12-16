import { cn } from "next-common/utils";
import NewPreimageSVG from "./icons/new-preimage.svg";
import NewProposalSVG from "./icons/new-proposal.svg";
import { ArrowRight } from "@osn/icons/subsquare";

export function ChoiceButton({
  icon = null,
  name,
  description,
  onClick,
  buttonSuffix,
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        "rounded-[8px] border border-neutral400 cursor-pointer hover:border-neutral500",
      )}
      onClick={onClick}
    >
      <div className="flex items-center grow py-[10px] pr-[16px]">
        {icon ? (
          <div className="px-[12px]">{icon}</div>
        ) : (
          <div className="w-[16px]" />
        )}
        <div>
          <div className="text14Medium text-textPrimary inline-flex items-center">
            {name}
            {buttonSuffix}
          </div>
          <div className="text12Medium text-textTertiary">{description}</div>
        </div>
      </div>
      <div className="p-[10px] [&_svg_path]:stroke-textTertiary">
        <ArrowRight />
      </div>
    </div>
  );
}

export function NewPreimageButton({ onClick }) {
  return (
    <ChoiceButton
      icon={<NewPreimageSVG />}
      name="New preimage"
      description="Proposals can be submitted with preimage hash-only"
      onClick={onClick}
    />
  );
}

export function NewProposalFromPreimageButton({ onClick }) {
  return (
    <ChoiceButton
      icon={<NewProposalSVG />}
      name="I already have a preimage"
      description="Copy preimage hash to continue submitting a proposal"
      onClick={onClick}
    />
  );
}
