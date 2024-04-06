import { twMerge } from "tailwind-merge";

import { CollapsibleSection } from "./collapsible";
import { Text } from "./text";

interface ListProps {
  title: string;
  items: (React.ReactNode | string)[];
  ListType?: "ol" | "ul";
  listClasses?: string;
  HeaderLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  emptyMessage?: string;
}

const List = (props: ListProps) => {
  const {
    emptyMessage = "Nothing to see here!",
    HeaderLevel,
    items,
    ListType = "ul",
    title,
  } = props;
  const listClassMerge = twMerge(`flex flex-col gap-2`, props.listClasses);
  return (
    <CollapsibleSection title={title} HeaderLevel={HeaderLevel}>
      {items.length === 0 ? (
        <Text>{emptyMessage}</Text>
      ) : (
        <ListType className={listClassMerge}>
          {items.map((item) => {
            if (typeof item == "string") {
              return (
                <li key={item}>
                  <Text>{item}</Text>
                </li>
              );
            }
            return item;
          })}
        </ListType>
      )}
    </CollapsibleSection>
  );
};

export { List };
