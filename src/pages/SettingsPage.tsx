import { useState } from 'react';
import PageShell from '@/components/PageShell';
import Toggle from '@/components/Toggle';
import { useTheme } from '@/state/ThemeContext';
import { load, save } from '@/lib/storage';

type Prefs = { music: boolean; sfx: boolean; haptics: boolean; colorblind: boolean };
const DEF: Prefs = { music: true, sfx: true, haptics: true, colorblind: false };

export default function SettingsPage() {
  const { theme, set } = useTheme();
  const [prefs, setPrefs] = useState<Prefs>(() => load<Prefs>('cg.prefs', DEF));

  function patch(p: Partial<Prefs>) {
    setPrefs((cur) => {
      const next = { ...cur, ...p };
      save('cg.prefs', next);
      return next;
    });
  }

  return (
    <PageShell title="Settings" back="/">
      <div className="space-y-3">
        <section className="card p-4">
          <p className="label">Theme</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => set('light')}
              className={`pick ${theme === 'light' ? 'pick-active' : ''}`}
            >
              <span className="text-xl">☀️</span>
              <span className="font-display text-base font-black">Light</span>
            </button>
            <button
              onClick={() => set('dark')}
              className={`pick ${theme === 'dark' ? 'pick-active' : ''}`}
            >
              <span className="text-xl">🌙</span>
              <span className="font-display text-base font-black">Dark</span>
            </button>
          </div>
        </section>

        <Toggle
          checked={prefs.music}
          onChange={(v) => patch({ music: v })}
          label="Background music"
        />
        <Toggle
          checked={prefs.sfx}
          onChange={(v) => patch({ sfx: v })}
          label="Sound effects"
        />
        <Toggle
          checked={prefs.haptics}
          onChange={(v) => patch({ haptics: v })}
          label="Haptic feedback"
          hint="Vibration on mobile devices."
        />
        <Toggle
          checked={prefs.colorblind}
          onChange={(v) => patch({ colorblind: v })}
          label="Colorblind mode"
          hint="Use shapes alongside colors for tiles."
        />
      </div>
    </PageShell>
  );
}
