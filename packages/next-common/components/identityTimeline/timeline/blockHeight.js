import tw from "tailwind-styled-components";
import InfoBlock from "@osn/icons/subsquare/InfoBlock";

const BlockIcon = tw(InfoBlock)`
  mr-[4px]
  w-[16px]
  h-[16px]
  [&_path]:stroke-textTertiary
`;

export default function BlockHeight({ number }) {
  return (
    <div className="flex items-center text12Medium">
      <BlockIcon />
      <div className="text-textTertiary">{number}</div>
    </div>
  );
}
