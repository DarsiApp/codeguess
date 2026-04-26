type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
};

export default function Toggle({ checked, onChange, label, hint }: Props) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-2 border-bark/20 bg-parchment/70 p-4 dark:border-parchment/15 dark:bg-nightbeige/70">
      <span>
        <span className="block font-display text-base font-black uppercase tracking-wide">{label}</span>
        {hint ? <span className="text-xs text-bark/70 dark:text-parchment/60">{hint}</span> : null}
      </span>
      <span
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 flex-none items-center rounded-full border-2 border-bark/30 transition ${
          checked ? 'bg-terracotta' : 'bg-beige dark:bg-nightsand'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-parchment shadow transition ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
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
