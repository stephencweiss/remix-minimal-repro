type ToggleProps = Readonly<{
  trueText: string;
  falseText: string;
  isTrue: boolean;
  setIsTrue: (value: boolean) => void;
}>;

export function Toggle(props: ToggleProps) {
  const { falseText, isTrue, setIsTrue, trueText } = props;
  return (
    <div className="flex flex-col sm:flex-row">
      <button
        type="button"
        className={`px-4 py-1 rounded-t sm:rounded-none sm:rounded-l ${
          isTrue ? "bg-slate-600 text-blue-100" : "bg-blue-500 text-white"
        }`}
        onClick={() => setIsTrue(false)}
      >
        {falseText}
      </button>
      <button
        type="button"
        className={`px-4 py-1 rounded-b sm:rounded-none sm:rounded-r ${
          !isTrue ? "bg-slate-600 text-blue-100" : "bg-blue-500 text-white"
        }`}
        onClick={() => setIsTrue(true)}
      >
        {trueText}
      </button>
    </div>
  );
}
