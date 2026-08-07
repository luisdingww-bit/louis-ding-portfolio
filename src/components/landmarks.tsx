/* Images served from public/images/landmarks/ — referenced as absolute paths at runtime */
const IMG_BASE = '/images/landmarks';

export interface Landmark {
  id: string;
  name: string;
  nameCn: string;
  location: string;
  lat: number;
  lon: number;
  year: string | number;
  /** Image URL (absolute path from public/) */
  img: string;
  /** Large watermark text displayed behind the building */
  watermark: string;
  /** Bottom title text */
  title: string;
  /** Architectural annotation labels positioned around the image */
  annotations: Annotation[];
}

export interface Annotation {
  text: string;
  sub?: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'mid-left' | 'mid-right';
}

export const landmarks: Landmark[] = [
  {
    id: 'forbidden-city',
    name: 'The Palace Museum',
    nameCn: '故宫',
    location: 'Beijing, China',
    lat: 39.9163,
    lon: 116.3972,
    year: '1420',
    img: `${IMG_BASE}/forbidden-city.png`,
    watermark: 'PALACE',
    title: 'THE PALACE MUSEUM',
    annotations: [
      { text: 'AXIAL SYMMETRY', sub: 'The central axis embodies order\nand cosmic harmony.', position: 'top-left' },
      { text: 'TIERED HIERARCHY', sub: 'Successive courtyards\ncreate depth, rhythm,\nand ceremonial flow.', position: 'top-right' },
      { text: 'IMPERIAL SCALE', sub: 'Monumental proportions\nexpress authority,\neternity, and virtue.', position: 'mid-left' },
      { text: 'STRUCTURAL WISDOM', sub: 'Timber architecture in perfect balance\nwith craft and climate.', position: 'mid-right' },
      { text: 'MATERIAL POETRY', sub: 'Glazed tiles, red walls,\nand stone terraces—\nenduring and timeless.', position: 'bottom-left' },
      { text: 'RITUAL & ORDER', sub: 'Space as ceremony.\nArchitecture as the\nlanguage of rule.', position: 'bottom-right' },
    ],
  },
  {
    id: 'temple-of-heaven',
    name: 'Temple of Heaven',
    nameCn: '天坛',
    location: 'Beijing, China',
    lat: 39.8822,
    lon: 116.4066,
    year: '1420',
    img: `${IMG_BASE}/temple-of-heaven.png`,
    watermark: 'TEMPLE OF HEAVEN',
    title: 'TEMPLE OF HEAVEN',
    annotations: [
      { text: 'SYMMETRY', sub: 'Harmony\nOrder', position: 'top-left' },
      { text: 'BETWEEN HEAVEN AND EARTH', sub: 'We build\nwith reverence', position: 'top-right' },
      { text: 'CIRCULAR FORM FOR HEAVEN', sub: 'Square base\nfor Earth', position: 'mid-left' },
      { text: 'TRADITION', sub: 'Precision\nTimeless', position: 'mid-right' },
    ],
  },
  {
    id: 'bank-of-china-tower',
    name: 'Bank of China Tower',
    nameCn: '中银大厦',
    location: 'Hong Kong, China',
    lat: 22.2778,
    lon: 114.1769,
    year: 1990,
    img: `${IMG_BASE}/bank-of-china-tower.png`,
    watermark: 'BANK OF CHINA',
    title: 'BANK OF CHINA TOWER',
    annotations: [
      { text: 'GEOMETRIC PURITY', sub: 'Triangular modules\ncascading upward', position: 'top-left' },
      { text: 'BAMBOO METAPHOR', sub: 'Segmented growth\nreflecting Chinese\nsymbolism', position: 'top-right' },
      { text: 'STRUCTURAL EXPRESSION', sub: 'Form follows force—\nI.M. Pei\'s masterpiece', position: 'bottom-left' },
      { text: 'VERTICAL ASPIRATION', sub: 'Rising from the dense\nurban fabric of Central', position: 'bottom-right' },
    ],
  },
  {
    id: 'taipei-101',
    name: 'Taipei 101',
    nameCn: '台北101',
    location: 'Taipei, Taiwan, China',
    lat: 25.0340,
    lon: 121.5645,
    year: 2004,
    img: `${IMG_BASE}/taipei-101.png`,
    watermark: 'TAIPEI 101',
    title: 'TAIPEI 101',
    annotations: [
      { text: 'PAGODA INSPIRED', sub: 'Eight segments of\ntraditional Chinese\narchitecture reimagined', position: 'top-left' },
      { text: 'TUNED MASS DAMPER', sub: 'A 728-ton golden sphere\nthat stabilizes against\ntyphoons and quakes', position: 'top-right' },
      { text: 'SUSTAINABLE HEIGHT', sub: 'LEED Platinum certified—\ngreen supertall pioneer', position: 'bottom-left' },
      { text: 'ASIAN IDENTITY', sub: 'Modern engineering\nwith cultural DNA', position: 'bottom-right' },
    ],
  },
  {
    id: 'empire-state-building',
    name: 'Empire State Building',
    nameCn: '帝国大厦',
    location: 'New York, USA',
    lat: 40.7484,
    lon: -73.9857,
    year: 1931,
    img: `${IMG_BASE}/empire-state-building.png`,
    watermark: 'EMPIRE STATE',
    title: 'EMPIRE STATE BUILDING',
    annotations: [
      { text: 'ART DECO ICON', sub: 'Limestone facade with\naluminum detailing', position: 'top-left' },
      { text: 'STEPPED SILHOUETTE', sub: 'Setback zoning law\nshaped its profile', position: 'top-right' },
      { text: '102 FLOORS', sub: 'Once the world\'s tallest—\na symbol of American\nambition', position: 'bottom-left' },
      { text: 'STEEL FRAME', sub: 'Revolutionary rapid-rise\nconstruction method', position: 'bottom-right' },
    ],
  },
  {
    id: 'colosseum',
    name: 'Roman Colosseum',
    nameCn: '罗马斗兽场',
    location: 'Rome, Italy',
    lat: 41.8902,
    lon: 12.4922,
    year: '80 AD',
    img: `${IMG_BASE}/colosseum.png`,
    watermark: 'COLOSSEUM',
    title: 'THE COLOSSEUM',
    annotations: [
      { text: 'ELLIPSE ENGINEERING', sub: 'Major/minor axes:\n187m × 155m', position: 'top-left' },
      { text: '80,000 SPECTATORS', sub: 'The largest ancient\namphitheater ever built', position: 'top-right' },
      { text: 'TRAVERTINE STONE', sub: 'Weathered by two\nmillennia of history', position: 'bottom-left' },
      { text: 'VAULT & ARCH', sub: 'Roman concrete genius—\nstill standing strong', position: 'bottom-right' },
    ],
  },
  {
    id: 'eiffel-tower',
    name: 'Eiffel Tower',
    nameCn: '埃菲尔铁塔',
    location: 'Paris, France',
    lat: 48.8584,
    lon: 2.2945,
    year: 1889,
    img: `${IMG_BASE}/eiffel-tower.png`,
    watermark: 'EIFFEL',
    title: 'TOUR EIFFEL',
    annotations: [
      { text: 'WROUGHT IRON', sub: '18,038 pieces of\npuddle iron joined\nby 2.5M rivets', position: 'top-left' },
      { text: 'LATTICE LOGIC', sub: 'Wind resistance through\ngeometric bracing', position: 'top-right' },
      { text: '330 METERS', sub: 'Once the world\'s tallest—\nbuilt for the World\'s Fair', position: 'bottom-left' },
      { text: 'INDUSTRIAL POETY', sub: 'Engineering elevated\nto art', position: 'bottom-right' },
    ],
  },
  {
    id: 'great-pyramid',
    name: 'Great Pyramid of Giza',
    nameCn: '吉萨金字塔',
    location: 'Giza, Egypt',
    lat: 29.9792,
    lon: 31.1342,
    year: '2560 BC',
    img: `${IMG_BASE}/great-pyramid.png`,
    watermark: 'PYRAMID',
    title: 'GREAT PYRAMID OF GIZA',
    annotations: [
      { text: 'PRECISION', sub: 'Base aligned to true north\nwithin 0.05 degrees', position: 'top-left' },
      { text: '2.3M BLOCKS', sub: 'Each weighing 2–30 tons—\nquarried, transported,\nand placed by hand', position: 'top-right' },
      { text: '146M ORIGINAL HEIGHT', sub: 'The tallest man-made\nstructure for 3,800 years', position: 'bottom-left' },
      { text: 'ETERNAL GEOMETRY', sub: 'The pyramid form as\narchetype of stability', position: 'bottom-right' },
    ],
  },
  {
    id: 'sydney-opera-house',
    name: 'Sydney Opera House',
    nameCn: '悉尼歌剧院',
    location: 'Sydney, Australia',
    lat: -33.8568,
    lon: 151.2153,
    year: 1973,
    img: `${IMG_BASE}/sydney-opera-house.png`,
    watermark: 'OPERA HOUSE',
    title: 'SYDNEY OPERA HOUSE',
    annotations: [
      { text: 'SHELL FORMS', sub: 'Pre-cast concrete panels—\neach one unique', position: 'top-left' },
      { text: 'EXPRESSIONIST VISION', sub: 'Jørn Utzon\'s\nunrealized dream\nmade real', position: 'top-right' },
      { text: 'HARBOR STAGE', sub: 'Architecture as\nperformance itself', position: 'bottom-left' },
      { text: 'UNESCO WORLD HERITAGE', sub: 'A 20th-century icon\nrecognized globally', position: 'bottom-right' },
    ],
  },
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    nameCn: '泰姬陵',
    location: 'Agra, India',
    lat: 27.1751,
    lon: 78.0421,
    year: 1653,
    img: `${IMG_BASE}/taj-mahal.png`,
    watermark: 'TAJ MAHAL',
    title: 'TAJ MAHAL',
    annotations: [
      { text: 'PERFECT SYMMETRY', sub: 'Every element mirrored\nacross the central axis', position: 'top-left' },
      { text: 'WHITE MARBLE', sub: 'Inlaid with semi-\nprecious stones (Pietra Dura)', position: 'top-right' },
      { text: 'ONION DOME', sub: '73 meters high—\na Persian architectural\ncrown jewel', position: 'bottom-left' },
      { text: 'MONUMENT TO LOVE', sub: 'Built by Shah Jahan\nfor his beloved Mumtaz', position: 'bottom-right' },
    ],
  },
  {
    id: 'great-wall',
    name: 'Great Wall',
    nameCn: '长城',
    location: 'Beijing, China',
    lat: 40.4319,
    lon: 116.5704,
    year: '221 BC',
    img: `${IMG_BASE}/great-wall.png`,
    watermark: 'GREAT WALL',
    title: 'THE GREAT WALL',
    annotations: [
      { text: 'DEFENSIVE LINEAR CITY', sub: 'Over 21,000 km of\\nfortified frontier', position: 'top-left' },
      { text: 'RIDGE TOPOGRAPHY', sub: 'Walls follow mountain\\ncrests for command', position: 'top-right' },
      { text: 'WATCHTOWERS', sub: 'Signal beacons across\\nthe landscape', position: 'bottom-left' },
      { text: 'STONE & EARTH', sub: 'Built to endure\\ncenturies of weather', position: 'bottom-right' },
    ],
  },
  {
    id: 'leaning-tower-of-pisa',
    name: 'Leaning Tower of Pisa',
    nameCn: '比萨斜塔',
    location: 'Pisa, Italy',
    lat: 43.723,
    lon: 10.3966,
    year: 1372,
    img: `${IMG_BASE}/leaning-tower-of-pisa.png`,
    watermark: 'PISA',
    title: 'LEANING TOWER OF PISA',
    annotations: [
      { text: 'UNINTENDED TILT', sub: 'Soft ground caused\\na 3.97 degree lean', position: 'top-left' },
      { text: 'ROMANESQUE', sub: 'White marble campanile\\nof the cathedral', position: 'top-right' },
      { text: 'CORRECTIVE WORK', sub: 'Stabilized after\\ncenturies of effort', position: 'bottom-left' },
      { text: '56 METERS', sub: 'Eight stories of\\nperfect proportion', position: 'bottom-right' },
    ],
  },
  {
    id: 'burj-khalifa',
    name: 'Burj Khalifa',
    nameCn: '哈利法塔',
    location: 'Dubai, UAE',
    lat: 25.1972,
    lon: 55.2744,
    year: 2010,
    img: `${IMG_BASE}/burj-khalifa.png`,
    watermark: 'BURJ KHALIFA',
    title: 'BURJ KHALIFA',
    annotations: [
      { text: 'Y-SHAPED PLAN', sub: 'Buttressed core for\\nlater stability', position: 'top-left' },
      { text: '828 METERS', sub: 'Held the world record\\nsince 2010', position: 'top-right' },
      { text: 'SETBACK SPIRAL', sub: 'Form derived from\\na desert flower', position: 'bottom-left' },
      { text: 'HIGH-PERF SKIN', sub: 'Reflective glazing\\ntames the desert sun', position: 'bottom-right' },
    ],
  },
  {
    id: 'kinkaku-ji',
    name: 'Kinkaku-ji',
    nameCn: '金阁寺',
    location: 'Kyoto, Japan',
    lat: 35.0394,
    lon: 135.7292,
    year: 1397,
    img: `${IMG_BASE}/kinkaku-ji.png`,
    watermark: 'KINKAKU-JI',
    title: 'KINKAKU-JI',
    annotations: [
      { text: 'GOLD LEAF', sub: 'Three stories sheathed\\nin pure gold leaf', position: 'top-left' },
      { text: 'POND MIRROR', sub: 'The pavilion doubled\\nby still water', position: 'top-right' },
      { text: 'ZEN STAGING', sub: 'Architecture as\\nborrowed landscape', position: 'bottom-left' },
      { text: '1397', sub: 'A shogun retreat\\nfor contemplation', position: 'bottom-right' },
    ],
  },
];
