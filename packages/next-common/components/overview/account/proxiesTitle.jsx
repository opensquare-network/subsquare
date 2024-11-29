import { Title } from "./styled";
import useMyOnChainProxies from "next-common/hooks/account/useMyOnChainProxies";

function ProxiesCount() {
  const { proxies = [] } = useMyOnChainProxies();
  const total = proxies[0]?.length || 0;

  return <span className="text-textTertiary mx-1 text16Medium">{total}</span>;
}

export default function ProxiesTitle({ active }) {
  return (
    <Title className={active ? "text-textPrimary" : "text-textTertiary"}>
      Proxies
      <ProxiesCount />
    </Title>
  );
}
