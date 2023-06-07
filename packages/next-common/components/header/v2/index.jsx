import { useChainSettings } from "next-common/context/chain";
import tw from "tailwind-styled-components";
import HeaderAccount from "../headerAccount";
import NetworkSwitch from "../networkSwitch";
import NodeSwitch from "../nodeSwitch";
import SearchInput from "../searchInput";

const Wrapper = tw.div`
py-4
px-6
h-[72px]
flex
gap-x-6
border-b
border-neutral300
bg-neutral100
`;

const SearchWrapper = tw.div`
w-full
`;

const ExtrasWrapper = tw.div`
flex
gap-x-2
`;

export default function Header() {
  const chainSettings = useChainSettings();

  return (
    <Wrapper>
      <SearchWrapper>
        <SearchInput />
      </SearchWrapper>

      <ExtrasWrapper>
        <NetworkSwitch activeNode={chainSettings} />
        <NodeSwitch small />
        <HeaderAccount />
      </ExtrasWrapper>
    </Wrapper>
  );
}
