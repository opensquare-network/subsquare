import Divider from "../styled/layout/divider";

export default function ListLayoutHeader({
  title,
  titleExtra,
  description,
  headContent,
  summary,
  summaryFooter,
}) {
  return (
    <div>
      <div className="flex justify-between">
        <h3 className="text20Bold text-textPrimary">{title}</h3>
        {titleExtra}
      </div>

      <p className="text14Medium text-textTertiary">{description}</p>

      {headContent && <div className="mt-2">{headContent}</div>}

      {summary && (
        <>
          <Divider className="my-4" />
          {summary}
        </>
      )}

      {summaryFooter && (
        <>
          <Divider className="my-4" />
          {summaryFooter}
        </>
      )}
    </div>
  );
}
