import dynamic from "next/dynamic";

const DynamicLoginPopup = dynamic(() => import("./popup"), {
  ssr: false,
});

export default DynamicLoginPopup;
