import { Title } from "./styled";
import {
  useMyProxiesContext,
  MyProxiesProvider,
} from "next-common/components/myProxies/context/myProxies";

function ProxiesCount() {
  const { total = 0, loading } = useMyProxiesContext();

  if (loading) {
    return null;
  }

  return <span className="text-textTertiary mx-1 text16Medium">{total}</span>;
}

export default function ProxiesTitle({ active }) {
  return (
    <MyProxiesProvider>
      <Title className={active ? "text-textPrimary" : "text-textTertiary"}>
        Proxies
        <ProxiesCount />
      </Title>
    </MyProxiesProvider>
  );
}
