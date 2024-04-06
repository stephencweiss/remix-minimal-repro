import { parseISO8601Duration, prettyPrintDuration } from "~/utils/time";

import { Text } from "./text";
export const Duration = ({
  label,
  time,
}: {
  label: string;
  time: string | null;
}) => {
  const parsedTime = parseISO8601Duration(time);
  const parts = prettyPrintDuration(parsedTime);

  if (parts.length === 0) {
    return <></>;
  }
  return (
    <div className="flex flex-col">
      <Text TagName="span" className="text-sm text-gray-500">
        {label}
      </Text>
      <Text TagName="span" className="text-lg">
        {parts}
      </Text>
    </div>
  );
};

export const ISO8601DurationHelper = ({ context }: { context?: string }) => {
  return (
    <div className="space-y-4 max-w-[300px]">
      {context ? <p className="font-bold">{context}</p> : <> </>}

      <p className="font-semibold">Here are some tips for writing times in ISO8601Duration</p>
      <ul className="space-y-4 list-disc list-inside">
        <li>Always start with PT - P is for period, T is for time.</li>
        <li>Use H for hours, M for minutes, and S for seconds.</li>
      </ul>
      <p className="font-semibold">Examples:</p>
      <ul className="space-y-4 list-disc list-inside">
        <li>1 hour: PT1H</li>
        <li>1 hour, 45 minutes: PT1H45M</li>
      </ul>
    </div>
  );
};
