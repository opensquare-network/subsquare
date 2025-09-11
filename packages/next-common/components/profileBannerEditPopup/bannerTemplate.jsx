import { cn } from "next-common/utils";
import { SystemSuccess } from "@osn/icons/subsquare";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";

const templateCids = [
  "QmQG5pui8T7bMTZQe9x2Xp44gtr3SXK6mGbzuCcV9Q2k6y",
  "QmQ1PpNCyhJUgczM6ETw1b7ScVboZaJXVHsomqxaJo3AzY",
  "QmecrB96E64YDouYXdhBnxrWYAZNKA6ZNFNRTQjbgDXodv",
  "QmWQprBxUsY7TH43dGFcvJkXgamw76U7X1DRB6ENXy2jv4",
  "QmSXbmiKxAodUwAecK4Ko35bZf15xdAmwwuLWTtTSh1755",
  "QmPHaqBDzmm3Zh1xndMjYZMJD4QeVnV18L1km5bD5B2Hqe",
];

export default function BannerTemplate({ templateCid, onSelect }) {
  return (
    <div className="flex flex-col items-center gap-y-4">
      <h5 className="text14Bold text-textPrimary self-start">
        Banner Template
      </h5>
      <div className="flex gap-1 flex-wrap w-full">
        {templateCids.map((cid) => {
          const url = getIpfsLink(cid);
          return (
            <div
              key={cid}
              className={cn(
                "w-[49%] rounded  h-[50px] border border-transparent cursor-pointer bg-no-repeat bg-cover bg-center relative bg-neutral200",
                // templateCid === cid && " border-neutral400",
              )}
              style={{
                backgroundImage: `url(${url})`,
              }}
              onClick={() => {
                onSelect(url, cid);
              }}
            >
              {templateCid === cid && (
                <SystemSuccess className="w-4 h-4 right-0.5 top-0.5 absolute" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
