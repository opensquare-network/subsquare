import {
  ArrowRight,
  SystemNewPreimage,
  SystemNewProposal,
} from "@osn/icons/subsquare";
import SecondaryButton from "next-common/lib/button/secondary";

export function ChoiceButton({
  icon = null,
  name,
  description,
  onClick,
  buttonSuffix,
}) {
  return (
    <SecondaryButton
      onClick={onClick}
      iconLeft={icon}
      iconRight={<ArrowRight className="text-textTertiary" />}
      className="flex h-auto w-full whitespace-normal"
    >
      <div className="flex flex-col grow text-left">
        <div className="inline-flex items-center">
          {name}
          {buttonSuffix}
        </div>

        <div className="text12Medium text-textTertiary">{description}</div>
      </div>
    </SecondaryButton>
  );
}

export function NewPreimageButton({ onClick }) {
  return (
    <ChoiceButton
      icon={<SystemNewPreimage className="[&_path]:stroke-textTertiary mr-1"/>}
      name="New preimage"
      description="Proposals can be submitted with preimage hash-only"
      onClick={onClick}
    />
  );
}

export function NewProposalFromPreimageButton({ onClick }) {
  return (
    <ChoiceButton
      icon={<SystemNewProposal className="[&_path]:stroke-textTertiary mr-1"/>}
      name="I already have a preimage"
      description="Copy preimage hash to continue submitting a proposal"
      onClick={onClick}
    />
  );
}
