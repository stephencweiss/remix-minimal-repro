import { twMerge } from "tailwind-merge";

/** Styled text for use in the App. Particularly useful for text that contains links*/
export const Text = ({
  children,
  className,
  dangerouslySetInnerHTML,
  TagName = "p",
}: React.PropsWithChildren<{
  className?: string;
  id?: string;
  dangerouslySetInnerHTML?: { __html: string };
  TagName?: keyof JSX.IntrinsicElements;
}>) => {
  const defaultClasses =
    "font-light leading-normal pb-2";
  const mergedClasses = twMerge(defaultClasses, className);

  if (dangerouslySetInnerHTML) {
    return (
      <TagName
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        className={`text ${mergedClasses}`}
      />
    );
  }

  return (
    <TagName className={`text ${mergedClasses}`}>
      {children}
    </TagName>
  );
};
