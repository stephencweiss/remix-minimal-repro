import { Text } from "../text";
import { Tooltip } from "../tooltip";

import { FormTextProps } from "./types";

export const FormTextInput = ({
  autofocus,
  defaultValue,
  error,
  label,
  name,
  placeholder,
  forwardRef,
  step,
  type,
  tooltipMessage,
  required = false,
}: FormTextProps) => (
  <div className="my-2">
    {error ? (
      <Text className="pt-1 text-red-700" id={`${name}-error`}>
        {error}
      </Text>
    ) : null}
    <label className="flex w-full flex-col gap-2 sm:items-baseline sm:flex-row">
      <div className="flex flex-row items-baseline ">
      <Text className="pb-0">{(label != null ? label : name).toUpperCase()}{required?<span className="text-red-700"><sup>*</sup></span> :"" }</Text>
      {tooltipMessage ? <Tooltip message={tooltipMessage} /> : null}
      </div>
      <input
        name={name}
        // Want to autofocus **if** specified **and** the purpose of the page is the form
        // https://html.spec.whatwg.org/multipage/interaction.html#attr-fe-autofocus
        // https://brucelawson.co.uk/2009/the-accessibility-of-html-5-autofocus/
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autofocus}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
        ref={forwardRef}
        step={step}
        aria-invalid={error ? true : undefined}
        aria-errormessage={error ? `${name}-error` : undefined}
      />
    </label>
  </div>
);
