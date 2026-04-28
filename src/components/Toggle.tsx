type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
};

export default function Toggle({ checked, onChange, label, hint }: Props) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-3 border-line bg-paper p-4 shadow-nbSm">
      <span>
        <span className="block font-display text-base font-black uppercase tracking-wide">
          {label}
        </span>
        {hint ? <span className="text-xs text-muted">{hint}</span> : null}
      </span>
      <span
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-14 flex-none items-center rounded-full border-3 border-line transition ${
          checked ? 'bg-sky' : 'bg-wash'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full border-[2px] border-line bg-paper transition ${
            checked ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
