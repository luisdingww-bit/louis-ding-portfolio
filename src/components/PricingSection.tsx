import Button from './Button';
import Reveal from './Reveal';

const BOOK_URL = 'https://halaskastudio.com/./book';

export default function PricingSection() {
  return (
    <section className="px-6 py-12">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2 md:justify-end">
        {/* Dark card */}
        <Reveal delay={0.1}>
          <div className="rounded-[40px] bg-[#051A24] pb-10 pl-10 pr-10 pt-3 text-[#F6FCFF] shadow-[inset_0_2px_8px_0_rgba(255,255,255,0.08)] md:pr-24">
            <h3 className="text-[22px] font-medium text-[#F6FCFF]">Monthly Partnership</h3>
            <p className="mt-2 text-sm text-[#E0EBF0]">
              A dedicated creative design team.
              <br />
              You work directly with Louis.
            </p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-2xl text-[#F6FCFF]">$5,000</span>
              <span className="text-sm text-[#E0EBF0]">Monthly</span>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button variant="primary" href={BOOK_URL}>
                Start a chat
              </Button>
              <Button variant="secondary" href={BOOK_URL}>
                How it works
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Light card */}
        <Reveal delay={0.2}>
          <div className="rounded-[40px] bg-white pb-10 pl-10 pr-10 pt-3 text-[#0D212C] shadow-[0_4px_16px_rgba(0,0,0,0.08)] md:pr-24">
            <h3 className="text-[22px] font-medium text-[#0D212C]">Custom Project</h3>
            <p className="mt-2 text-sm text-[#051A24]/70">
              Fixed scope, fixed timeline.
              <br />
              Same team, same standards.
            </p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-2xl text-[#0D212C]">$5,000</span>
              <span className="text-sm text-[#051A24]/70">Minimum</span>
            </div>
            <div className="mt-6">
              <Button variant="tertiary" href={BOOK_URL}>
                Start a chat
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
