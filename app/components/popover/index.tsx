import { Cross2Icon } from "@radix-ui/react-icons";
import * as RadixPopover from "@radix-ui/react-popover";
import { LinksFunction } from "@remix-run/node";
import { ReactNode } from "react";

import styles from "./styles.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

interface PopoverProps {
  /** The UI that will trigger the popover, should be a Button */
  trigger: ReactNode;
  /** The UI that will be rendered after the trigger is selected */
  content: ReactNode;
}

export const Popover = ({
  trigger,
  content,
}: PopoverProps) => (
  <RadixPopover.Root>
    <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
    <RadixPopover.Portal>
      <RadixPopover.Content
        className="PopoverContent rounded p-5 w-[260px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
        sideOffset={5}
      >
        {content}
        <RadixPopover.Close
          className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-violet11 absolute top-[5px] right-[5px] hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 outline-none cursor-default"
          aria-label="Close"
        >
          <Cross2Icon />
        </RadixPopover.Close>

        <RadixPopover.Arrow className="fill-white" />
      </RadixPopover.Content>
    </RadixPopover.Portal>
  </RadixPopover.Root>
);
