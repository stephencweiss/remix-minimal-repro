import { PropsWithChildren } from "react";

export default function Button({children}: PropsWithChildren<unknown>){
  return (<button
    className="w-fit rounded-md bg-white p-2 text-black"
  >{children}</button>)
}