import Link from "next/link";
import { isNil } from "lodash-es";
import {
  useAssetLink,
  useForeignAssetLink,
} from "next-common/hooks/useAssetLink";

function CommonAssetLink({ children, className, link, ...props }) {
  if (isNil(link)) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <Link href={link} target="_blank" className={className} {...props}>
      {children}
    </Link>
  );
}

export function ForeignAssetLink({ assetId, children, className, ...props }) {
  const link = useForeignAssetLink(assetId);

  return (
    <CommonAssetLink link={link} className={className} {...props}>
      {children}
    </CommonAssetLink>
  );
}

export function AssetLink({ assetId, children, className, ...props }) {
  const link = useAssetLink(assetId);

  return (
    <CommonAssetLink link={link} className={className} {...props}>
      {children}
    </CommonAssetLink>
  );
}
