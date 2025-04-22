import {
  ArrowRight,
  SystemNewPreimage,
  SystemCopyPreimage,
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
      className="flex h-auto w-full whitespace-normal p-[11px]"
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
      icon={<SystemNewPreimage className="text-textTertiary mr-1" />}
      name="New Preimage"
      description="Create a new preimage"
      onClick={onClick}
    />
  );
}

export function NewProposalFromPreimageButton({ onClick }) {
  return (
    <ChoiceButton
      icon={<SystemCopyPreimage className="text-textTertiary mr-1" />}
      name="I Already Have a Preimage"
      description="Copy preimage hash to continue submitting a proposal"
      onClick={onClick}
    />
  );
}
