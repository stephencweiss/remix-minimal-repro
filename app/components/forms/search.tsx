import { twMerge } from "tailwind-merge";

import { Button, ButtonProps } from "../button";

import { FormTextProps } from "./types";

type SearchProps = FormTextProps &
  ButtonProps & {
    placeholder?: string;
    clearSearch?: () => void;
  };
export function Search(props: SearchProps) {
  const submitStyle = twMerge(
    "grow-0 rounded-b rounded-t-none md:rounded-r md:rounded-l-none border-l-2 ",
    props.className ??
      `md:rounded-r-none md:rounded-l-none rounded-b-none rounded-t-none`,
  );

  return (
    <div
      className="flex flex-nowrap w-full flex-col
      leading-loose
    rounded-md border-2 border-gray-200
    active:border-blue-600 focus:border-blue-500 hover:border-blue-500
    disabled:border-gray-400 disabled:text-white
    md:flex-row"
    >
      <input
        type="text"
        id="searchInput"
        className="grow min-w-[100px]
        border-gray-800
        ring-0 focus:ring-0 // removes the ring
        ring-offset-0 focus:ring-offset-0 // removes the ring offset
        outline-none focus:outline-none // removes the default outline
        px-3 py-2 text-lg"
        placeholder={props.placeholder ?? "Search everything..."}
        name={props.name}
        defaultValue={props.defaultValue}
      />
      <Button
        type="submit"
        buttonSize={props.buttonSize}
        className={submitStyle}
      >
        Submit
      </Button>
      {props.clearSearch ? (
        <Button
          type="button"
          buttonSize={props.buttonSize}
          buttonStyle="error"
          onClick={props.clearSearch}
          className="border-l-2 rounded-b rounded-t-none md:rounded-r md:rounded-l-none"
        >
          Clear
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
}
