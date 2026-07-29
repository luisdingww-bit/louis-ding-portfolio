import { useI18n } from '../i18n';

const BASE = import.meta.env.BASE_URL;

const FACTS: { labelKey: string; value: string }[] = [
  { labelKey: 'about.f_name', value: '丁俊晖 (Louis Ding)' },
  { labelKey: 'about.f_school', value: '华侨大学' },
  { labelKey: 'about.f_major', value: '建筑学' },
  { labelKey: 'about.f_focus', value: '人工智能 × 计算设计 × 数字制造' },
  { labelKey: 'about.f_location', value: '中国香港 / 厦门' },
];

export default function AboutView({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <button
        onClick={onBack}
        className="font-mono text-xs text-mist transition hover:opacity-60"
      >
        {t('about.back')}
      </button>

      <div className="mt-6 flex flex-col gap-10 md:flex-row md:items-start">
        <div className="shrink-0">
          <img
            src={BASE + 'louis-ding.jpg'}
            alt="丁俊晖"
            className="h-44 w-44 rounded-3xl object-cover shadow-secondary md:h-56 md:w-56"
          />
        </div>

        <div className="flex-1">
          <h1 className="font-mondwest text-4xl font-semibold tracking-tight text-[#051A24] md:text-5xl">
            {t('about.title')}
          </h1>
          <p className="mt-4 text-[15px] leading-8 text-[#051A24]">
            {t('about.bio')}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {FACTS.map((f) => (
          <div
            key={f.labelKey}
            className="rounded-2xl bg-[#F6FCFF] px-5 py-4 shadow-secondary"
          >
            <p className="font-mono text-xs text-mist">{t(f.labelKey)}</p>
            <p className="mt-1 text-[15px] font-medium text-[#051A24]">{f.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
