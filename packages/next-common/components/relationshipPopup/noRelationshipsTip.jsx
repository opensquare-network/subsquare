import { GreyPanel } from "next-common/components/styled/containers/greyPanel";

export default function NoRelationshipsTip() {
  return (
    <GreyPanel className="justify-start gap-x-2 text14Medium text-textSecondary py-2.5 px-4 max-w-full">
      This account has no relationships with proxy, multisig and identity.
    </GreyPanel>
  );
}
