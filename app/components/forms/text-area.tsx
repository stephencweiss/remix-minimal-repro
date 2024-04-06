import { Text } from "../text";

import { FormTextAreaProps } from "./types";

export const FormTextAreaInput = ({
  defaultValue,
  name,
  forwardRef,
  rows = 4,
}: FormTextAreaProps) => (
  <label className="flex w-full flex-col gap-2">
    <Text>{name.toUpperCase()}</Text>
    <textarea
      className="grow rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-loose"
      defaultValue={defaultValue}
      name={name}
      rows={rows}
      ref={forwardRef}
    />
  </label>
);
