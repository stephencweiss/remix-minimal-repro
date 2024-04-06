import { Link } from "@remix-run/react";
import { twMerge } from "tailwind-merge";

// TODO: Replace all <Link> with <StyledLink>

// Then rename as <Link> so that it's a drop-in replacement for Remix's <Link>.

const defaultLinkClasses = `
inline-block
rounded
p-2
text-blue-500 active:bg-blue-400 focus:bg-blue-700
hover:bg-blue-600 hover:text-white
`;

type StyledLinkProps = React.PropsWithChildren<{
  className?: string;
  to: string;
}>;

/**
 * A link that can be easily added to any page with consistent default styling.
 */
export function StyledLink({
  children,
  className,
  to,
}: Readonly<StyledLinkProps>): JSX.Element {
  const combinedClasses = twMerge(defaultLinkClasses, className);
  return (
    <Link to={to} className={combinedClasses}>
      {children}
    </Link>
  );
}
