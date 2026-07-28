const BASE = import.meta.env.BASE_URL;

const FACTS: { label: string; value: string }[] = [
  { label: '姓名', value: '丁俊晖 (Louis Ding)' },
  { label: '学校', value: '华侨大学' },
  { label: '专业', value: '建筑学' },
  { label: '方向', value: '人工智能 × 计算设计 × 数字制造' },
  { label: '所在地', value: '中国香港 / 厦门' },
];

export default function AboutView({ onBack }: { onBack: () => void }) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <button
        onClick={onBack}
        className="font-mono text-xs text-mist transition hover:opacity-60"
      >
        ← 返回首页
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
            关于我
          </h1>
          <p className="mt-4 text-[15px] leading-8 text-[#051A24]">
            我是丁俊晖，华侨大学建筑学专业的学生，热衷于人工智能、计算设计与数字制造的交叉领域。
            我正在申请研究生，专注于人工智能辅助建筑设计，探索算法如何重新定义空间的想象与实践。
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {FACTS.map((f) => (
          <div
            key={f.label}
            className="rounded-2xl bg-[#F6FCFF] px-5 py-4 shadow-secondary"
          >
            <p className="font-mono text-xs text-mist">{f.label}</p>
            <p className="mt-1 text-[15px] font-medium text-[#051A24]">{f.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
