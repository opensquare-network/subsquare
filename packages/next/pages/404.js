import { Img404Dark, Img404Light } from "@osn/icons/subsquare";
import ErrorLayout from "next-common/components/layout/errorLayout";

export default function Page404() {
  return (
    <ErrorLayout
      icon={
        <>
          <Img404Light className="dark:hidden" />
          <Img404Dark className="hidden dark:block" />
        </>
      }
      title="404 Page Not Found"
      description="You may mistyped the url or the page has been moved"
    />
  );
}
