import ListLayout from "next-common/components/layout/ListLayout";
import PreImagesList from "next-common/components/preImages/preImagesList";
import {
  useOldPreimageHashes,
  usePreimageHashes,
} from "next-common/hooks/usePreimageHashes";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import PreImagesFooter from "next-common/components/preImages/footer";
import { useMemo } from "react";
import { useChainSettings } from "next-common/context/chain";

function PreimagesPageBase({ hashes }) {
  const title = "Preimages";
  const seoInfo = { title, desc: title };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description="Preimage can be submitted and stored on-chain against the hash later, upon the proposal's dispatch."
      summaryFooter={<PreImagesFooter />}
    >
      <PreImagesList data={hashes} />
    </ListLayout>
  );
}

function OldPreimagePage() {
  const oldHashes = useOldPreimageHashes();
  const hashes = useMemo(
    () => oldHashes.map((data) => ({ data, method: "statusFor" })),
    [oldHashes],
  );

  return <PreimagesPageBase hashes={hashes} />;
}

function NewPreimagePage() {
  const oldHashes = useOldPreimageHashes();
  const newHashes = usePreimageHashes();

  const hashes = useMemo(() => {
    const hashes = newHashes.map((data) => ({
      data,
      method: "requestStatusFor",
    }));
    for (const item of oldHashes) {
      const [oldHash] = item;
      if (!newHashes.some(([newHash]) => newHash === oldHash)) {
        hashes.push({ data: item, method: "statusFor" });
      }
    }
    return hashes;
  }, [oldHashes, newHashes]);

  return <PreimagesPageBase hashes={hashes} />;
}

export default function PreimagesPage() {
  const { useNewPreimagePallet } = useChainSettings();

  if (!useNewPreimagePallet) {
    return <OldPreimagePage />;
  }

  return <NewPreimagePage />;
}

export const getServerSideProps = getServerSidePropsWithTracks;
