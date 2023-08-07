import { NeutralPanel } from "../styled/containers/neutralPanel";
import tw from "tailwind-styled-components";

export const OptionWrapper = tw(NeutralPanel)`
absolute
right-0
bottom-[calc(100%+10px)]
w-[160px]
p-2
!rounded-lg
border
border-neutral300
shadow-100
`;

export const OptionItem = tw.div`
flex
items-center
text14Medium
text-textPrimary
cursor-pointer
rounded-md
p-2
hover:bg-neutral200
[&_path]:fill-textSecondary
`;
