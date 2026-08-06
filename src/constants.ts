const BASE = import.meta.env.BASE_URL;

export const marqueeImages = [
  BASE + 'pdf_01.jpeg',
  BASE + 'pdf_02.jpeg',
  BASE + 'pdf_03.jpeg',
  BASE + 'pdf_04.jpeg',
  BASE + 'pdf_05.jpeg',
  BASE + 'pdf_06.jpeg',
  BASE + 'pdf_07.jpeg',
  BASE + 'pdf_08.jpeg',
  BASE + 'pdf_09.jpeg',
];

// Curated slides for the home marquee: title + tag revealed on hover.
// Replace `title`/`tag` once the real project names are confirmed.
const MARQUEE_TAGS = ['Architecture', '3D Print', 'Computational', 'Rendering'];
export const marqueeSlides: { src: string; title: string; tag: string }[] =
  marqueeImages.map((src, i) => ({
    src,
    title: `Work ${String(i + 1).padStart(2, '0')}`,
    tag: MARQUEE_TAGS[i % MARQUEE_TAGS.length],
  }));

// WhatsApp click-to-chat link (+86 18050020614). Edit here to change number.
export const whatsappUrl = 'https://wa.me/8618050020614';
