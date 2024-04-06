import { LinksFunction } from "@remix-run/node";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import styles from "./styles.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const CollapsibleSection = ({
  title,
  HeaderLevel = "h2",
  headerSize = "text-xl",
  children,
  wrapClasses,
  defaultOpen = true, // Open by default
}: React.PropsWithChildren<{
  title: React.ReactNode;
  wrapClasses?: string;
  HeaderLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  headerSize?: string;
  defaultOpen?: boolean;
}>) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const wrapClassMerge = twMerge(`collapsible my-2`, wrapClasses);
  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    setIsOpen(e.currentTarget.open);
  };

  return (
    <details open={isOpen} onToggle={handleToggle} className={wrapClassMerge}>
      <summary
        className="flex justify-between cursor-pointer list-none items-center gap-4"
      >
        <div className="flex gap-2 items-center">
          {/* <!-- notice here, we added our own triangle/arrow svg --> */}
          <svg
            className={`
              ${isOpen ? "-rotate-180" : "rotate-0"}
              transform text-blue-700 transition-all duration-300`}
            fill="none"
            height="20"
            width="20"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <HeaderLevel className={`${headerSize} font-bold py-4`}>{title}</HeaderLevel>
        </div>
      </summary>
      {children}
    </details>
  );
};
