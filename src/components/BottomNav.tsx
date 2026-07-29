import Button from './Button';
import { useI18n } from '../i18n';

export default function BottomNav() {
  const { t } = useI18n();
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-4 rounded-full bg-white px-8 py-2 shadow-primary">
        <span className="font-mondwest text-2xl font-semibold text-[#051A24]">L</span>
        <Button variant="primary" href="#partner">
          {t('footer.startChat')}
        </Button>
      </div>
    </div>
  );
}
