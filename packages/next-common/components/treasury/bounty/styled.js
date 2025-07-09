import tw from "tailwind-styled-components";

export const CuratorTag = tw.span`
  py-[2px] px-[8px] rounded-[10px]
  text12Medium
  bg-neutral200
  text-textSecondary
`;

export function CuratorProxyTag() {
  return <CuratorTag>Proxy</CuratorTag>;
}

export function CuratorBadge({ badge }) {
  return <CuratorTag className="bg-theme100 text-theme500">{badge}</CuratorTag>;
}
