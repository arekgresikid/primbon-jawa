export const DINA = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
export const WUKU = [
  'Sinta', 'Landep', 'Wukir', 'Kurantil', 'Tolu', 
  'Gumbreg', 'Warigalit', 'Warigagung', 'Julungwangi', 'Sungsang',
  'Galungan', 'Kuningan', 'Langkir', 'Mandasiya', 'Julungpujut',
  'Pahang', 'Kuruwelut', 'Marakeh', 'Tambir', 'Medangkungan',
  'Maktal', 'Wuye', 'Manahil', 'Prangbakat', 'Bala',
  'Wugu', 'Wayang', 'Kulawu', 'Dukut', 'Watugunung'
];
export const BULAN_JAWA = [
  'Sura', 'Sapar', 'Mulud', 'Bakda Mulud', 'Jumadil Awal', 'Jumadil Akhir',
  'Rejeb', 'Ruwah', 'Pasa', 'Sawal', 'Sela', 'Besar'
];
export const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi\'ul Awwal', 'Rabi\'ul Akhir', 'Jumadil Awwal', 'Jumadil Akhir',
  'Rajab', 'Syaban', 'Ramadhan', 'Syawal', 'Dzulqa\'dah', 'Dzulhijjah'
];

export const DINA_NEPTU = [5, 4, 3, 7, 8, 6, 9];
export const PASARAN_NEPTU = [5, 9, 7, 4, 8];

const ANCHOR_DATE = Date.UTC(2023, 11, 31); // Sunday Legi, 31 Dec 2023
const ANCHOR_PASARAN = 0; // Legi
const ANCHOR_WUKU = 20; // Maktal

export function getWeton(date: Date) {
  // Normalize to UTC noon to avoid timezone and DST (Daylight Saving Time) jumps.
  // Using Date.UTC calculates the exact number of milliseconds since UNIX epoch.
  // This natively and perfectly handles all Gregorian leap years, long-month/short-month
  // mechanics, and prevents edge cases where a user's local timezone might slip into
  // a previous or future day.
  const d = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  
  // diffDays represents the exact physical days between the target date and our Anchor Date
  const diffDays = Math.floor((d - ANCHOR_DATE) / 86400000);
  
  // JavaScript's modulo can return negative numbers for past dates.
  // The formula ((val % modulus) + modulus) % modulus ensures a precise positive wrap-around.
  // Javanese calendar relies on an unbroken continuous 5-day cycle (Pasaran) and 7-day cycle (Dina).
  const pasaranIndex = ((ANCHOR_PASARAN + diffDays) % 5 + 5) % 5;
  const dinaIndex = date.getDay(); // getDay() is natively 0-6 (Sun-Sat), already robust.
  
  // Wuku is a continuous 30-week cycle. We find the start of the current week (Sunday)
  // to evaluate which block of 7 days we are currently in.
  const startOfWukuDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
  const diffWeeks = Math.floor((startOfWukuDate - ANCHOR_DATE) / (86400000 * 7));
  const wukuIndex = ((ANCHOR_WUKU + diffWeeks) % 30 + 30) % 30;
  
  // Neptu is the core numeric value used in divinations, simply Dina value + Pasaran value
  const neptu = DINA_NEPTU[dinaIndex] + PASARAN_NEPTU[pasaranIndex];

  return {
    dina: DINA[dinaIndex],
    pasaran: PASARAN[pasaranIndex],
    wuku: WUKU[wukuIndex],
    neptu,
    dinaNeptu: DINA_NEPTU[dinaIndex],
    pasaranNeptu: PASARAN_NEPTU[pasaranIndex],
    isJumatKliwon: dinaIndex === 5 && pasaranIndex === 4,
    isSelasaKliwon: dinaIndex === 2 && pasaranIndex === 4
  };
}

export function getJavaneseDateLocal(date: Date) {
  try {
    const formatter = new Intl.DateTimeFormat('id-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(date);
    const dayStr = parts.find(p => p.type === 'day')?.value || '1';
    const monthStr = parts.find(p => p.type === 'month')?.value || '1';
    const yearStr = parts.find(p => p.type === 'year')?.value || '';
    
    // Some browsers return month as numbers
    let mIndex = parseInt(monthStr.replace(/\D/g, '')) - 1;
    if (isNaN(mIndex)) {
      mIndex = date.getMonth(); 
    }
    
    const day = parseInt(dayStr.replace(/\D/g, '')) || date.getDate();
    const yearParsed = parseInt(yearStr.replace(/\D/g, '')) || (date.getFullYear() - 579);

    return {
      date: day,
      month: BULAN_JAWA[mIndex % 12],
      year: yearParsed + 512,
      hijriStr: `${day} ${HIJRI_MONTHS[mIndex % 12]} ${yearStr}`
    };
  } catch (e) {
    return { date: date.getDate(), month: BULAN_JAWA[date.getMonth()], year: date.getFullYear(), hijriStr: '' };
  }
}

export function getPranataMangsa(date: Date) {
  const m = date.getMonth();
  const d = date.getDate();
  const ds = m * 100 + d;
  if (ds >= 522 && ds <= 701) return { name: 'Kasa (Kartika)', desc: 'Musim membakar jerami. Daun-daunan berguguran, kayu-kayu mengering. Saat yang baik menanam palawija.' };
  if (ds >= 702 && ds <= 724) return { name: 'Karo (Pusa)', desc: 'Pohon randu dan mangga mulai berbunga. Musim kemarau, tanah mulai gersang dan pecah-pecah.' };
  if (ds >= 725 && ds <= 817) return { name: 'Katiga (Manggasri)', desc: 'Musim kemarau puncak. Panen palawija, sumur mulai kering, angin berhembus kencang.' };
  if (ds >= 818 && ds <= 912) return { name: 'Kapat (Sitramasa)', desc: 'Musim semi mulai. Sumur mulai terisi air, pohon-pohon bertunas, burung membuat sarang.' };
  if (ds >= 913 && ds <= 1008) return { name: 'Kalima (Manggala)', desc: 'Mulai ada hujan. Pohon asem mulai berbunga, petani mulai menyiapkan sawah.' };
  if (ds >= 1009 && ds <= 1121) return { name: 'Kanem (Naya)', desc: 'Musim hujan turun. Buah-buahan rontok, banyak serangga, masa menanam padi dimulai.' };
  if (ds >= 1122 || ds <= 102) return { name: 'Kapitu (Palguna)', desc: 'Hujan deras, angin kencang, sungai sering banjir. Berhati-hati penyakit sering menimpa.' };
  if (ds >= 103 && ds <= 129 && m === 1) return { name: 'Kawolu (Wisaka)', desc: 'Musim ulat merambat. Kucing mulai kawin. Padi mulai menghijau di sawah.' };
  if (ds >= 201 && ds <= 225) return { name: 'Kasanga (Jita)', desc: 'Musim turaes (serangga berbunyi). Padi mulai berbunga, air di sawah melimpah.' };
  if (ds >= 226 && ds <= 318) return { name: 'Kadasa (Srawana)', desc: 'Hewan bunting. Angin bertiup lembut, padi mulai menguning menuju masa panen.' };
  if (ds >= 319 && ds <= 411) return { name: 'Desta (Padrawana)', desc: 'Burung memberi makan anaknya. Panen raya agung.' };
  if (ds >= 412 && ds <= 521) return { name: 'Sada (Asuji)', desc: 'Suhu mulai dingin (Musim bediding). Para petani mulai merapikan hasil panen dan sisa jerami.' };
  return { name: 'Kasa (Kartika)', desc: 'Musim awal penanggalan tanam.' };
}

export function getWatak(neptu: number) {
  const watakMap: Record<number, string> = {
    7: 'Pendito Kang Lakung (Senang bepergian, lincah)',
    8: 'Lakuning Geni (Mudah marah, emosional)',
    9: 'Lakuning Angin (Gampang terpengaruh, dinamis)',
    10: 'Pendito Mbangun Teki (Suka menasihati, bijak)',
    11: 'Lakuning Setan (Pemberani, keras kepala)',
    12: 'Lakuning Kembang (Penyebar kedamaian, disenangi)',
    13: 'Lakuning Lintang (Suka menyendiri, pesona kuat)',
    14: 'Lakuning Rembulan (Penenang, pembimbing)',
    15: 'Lakuning Srengenge (Penerang, berwibawa)',
    16: 'Lakuning Banyu (Penyejuk, tenang)',
    17: 'Lakuning Bumi (Penyabar, pengayom)',
    18: 'Lakuning Paripurna (Berkuasa, disegani)'
  };
  return watakMap[neptu] || 'Tidak diketahui';
}

export function getRamalanNasib(neptu: number) {
  // Pancasuda calculation
  const nasibMap = [
    'Pati (Banyak cobaan, rintangan hidup, butuh kesabaran ekstra)',
    'Sri (Rezeki mudah datang, penuh keberuntungan dan welas asih)',
    'Lungguh (Berpotensi mendapat kedudukan, pangkat, atau dihormati)',
    'Gedhong (Ditakdirkan kaya raya, mudah mengumpulkan harta)',
    'Loro (Sering mengalami kemerosotan atau gangguan kesehatan, mawas diri)'
  ];
  return nasibMap[neptu % 5];
}

export function getArahRezeki(neptu: number) {
  const arahMap = [
    'Selatan (Arah keberuntungan, cocok untuk merantau/berbisnis)',
    'Timur (Arah awal mula kehidupan, penuh harapan baru)',
    'Barat (Arah kedamaian, cocok untuk tempat tinggal yang sejahtera)',
    'Utara (Arah perlindungan dan kemapanan karir)'
  ];
  return arahMap[neptu % 4];
}

export function getWarnaKeberuntungan(neptu: number) {
  const warnaMap = [
    'Putih & Kuning (Membawa ketenangan dan aura positif)',
    'Merah Muda & Hijau (Menarik simpati dan keharmonisan)',
    'Biru & Hitam (Ketajaman pikiran dan keberanian)',
    'Emas & Putih (Kewibawaan dan kesucian)',
    'Hijau & Cokelat (Kesuburan dan keteguhan)'
  ];
  return warnaMap[neptu % 5];
}

export function getLuckyColorByPasaran(pasaran: string) {
  const colors: Record<string, string> = {
    'Legi': 'Putih (Ketulusan & Kejernihan)',
    'Pahing': 'Merah (Semangat & Keberanian)',
    'Pon': 'Kuning (Kewibawaan & Kebahagiaan)',
    'Wage': 'Hitam (Kemantapan & Kedalaman)',
    'Kliwon': 'Abu-abu / Mancawarna (Keseimbangan & Keluwesan)'
  };
  return colors[pasaran] || 'Putih';
}

export function getJodoh(neptu1: number, neptu2: number) {
  const sum = neptu1 + neptu2;
  const res = sum % 7;
  const jodohMap = [
    'Lebu Katiup Angin (Sering berpindah, mengalami ujian ketetapan)',
    'Wasesa Segara (Rezeki seluas lautan, pemaaf)',
    'Tunggak Semi (Rezekinya selalu ada, tumbuh terus)',
    'Satria Wibawa (Dihargai dan dihormati banyak orang)',
    'Sumur Sinaba (Menjadi sumber inspirasi & tempat bertanya)',
    'Satria Wirang (Sering mendapat malu, harus tabah)',
    'Bumi Kapetak (Pekerja keras, tahan banting, ulet)'
  ];
  return { category: jodohMap[res], score: res };
}

export function getStrategiBisnis(neptu: number, dina: string, pasaran: string) {
  const bidangMap = [
    'Peternakan, Kuliner, Tata Boga, atau bidang yang membutuhkan ketelatenan tinggi.',
    'Perdagangan umum, Jasa, Layanan masyarakat, Sales, Pendidik/Trainer.',
    'Pertanian, Properti, Investasi tanah, Tukang kayu atau aset fisik.',
    'Seni, Hiburan, Desain, Fashion, Penjualan barang hobi atau pakaian.',
    'Teknologi, Komunikasi, Transportasi, Jasa Konsultasi atau Penulis.'
  ];
  
  const kelebihanMap = [
    'Ulet, tidak mudah menyerah, cermat melihat peluang kecil, pintar mengatur modal.',
    'Pandai bergaul, memiliki relasi luas, komunikatif, mudah menarik simpati.',
    'Sabar, tekun, teliti, fokus pada kualitas, tidak mudah tergoda tren semata.',
    'Kreatif, banyak ide segar, inovatif, mudah mengikuti perkembangan zaman.',
    'Cepat mengambil peluang, adaptif, tangkas, negosiator yang cerdik.'
  ];
  
  const kekuranganMap = [
    'Terkadang pelit, curigaan, sulit mendelegasikan tugas kepada orang lain.',
    'Kurang teliti dalam hal pembukuan keuangan, mudah bosan pada rutinitas.',
    'Terlalu kaku, konservatif, sering lambat/ragu mengambil keputusan (kehilangan timing).',
    'Sering bergantung pada mood, kurang disiplin waktu, perencanaan keuangan kurang matang.',
    'Mudah berubah pikiran, terlalu nekat, cepat menyerah jika menemui jalan buntu di tengah jalan.'
  ];

  // Hari Baik Memulai Usaha (Simplified mapping logic)
  const hariBaik = DINA[(neptu + 2) % 7];
  const pasaranBaik = PASARAN[(neptu + 1) % 5];
  
  const bulanBaik1 = BULAN_JAWA[(neptu + 1) % 12];
  const bulanBaik2 = BULAN_JAWA[(neptu + 5) % 12];
  
  return {
    hariBaik: `${hariBaik} ${pasaranBaik}`,
    bulanBaik: `${bulanBaik1} atau ${bulanBaik2}`,
    bidang: bidangMap[neptu % 5],
    kelebihan: kelebihanMap[neptu % 5],
    kekurangan: kekuranganMap[neptu % 5]
  };
}

export function getDailyLuck(userNeptu: number, todayNeptu: number) {
  // Simple algorithm to calculate luck compatibility
  const combinations = (userNeptu + todayNeptu) % 10;
  const scores = [65, 80, 45, 90, 70, 55, 85, 40, 95, 60];
  const advices = [
    'Hari yang stabil, bagus untuk perencanaan.',
    'Energi Anda sedang tinggi, manfaatkan untuk hal produktif.',
    'Kurangi risiko hari ini, lebih baik berhemat.',
    'Luar biasa! Peluang besar menanti Anda.',
    'Hubungan sosial Anda sedang harmonis.',
    'Waspadai kesalahpahaman kecil dengan orang terdekat.',
    'Rezeki kecil mengalir, tetaplah bersyukur.',
    'Butuh istirahat lebih, jangan terlalu memaksakan diri.',
    'Magnet keberuntungan! Hari yang tepat untuk berdagang.',
    'Fokus pada detail, jangan terburu-buru mengambil keputusan.'
  ];
  
  return {
    score: scores[combinations],
    advice: advices[combinations]
  };
}

export function getAuspiciousHours(dinaIndex: number) {
  // Javanese Saat (Time Periods) logic simplification
  // Every day has 5 cycles (Saat 1-5) from sunrise to sunset
  const saatNames = ['Saat Slamet', 'Saat Rejeki', 'Saat Pacakulu', 'Saat Kolo', 'Saat Gedhong'];
  const saatDesc = [
    'Sangat baik untuk perjalanan & keamanan.',
    'Terbaik untuk dagang & mencari keuntungan.',
    'Baik untuk silaturahmi & perundingan.',
    'Hati-hati, waspada terhadap konflik/halangan.',
    'Mulia untuk memulai urusan besar/kedudukan.'
  ];
  
  // Rotating based on day of week
  const order = [
    [0, 1, 2, 3, 4], // Sun
    [1, 2, 3, 4, 0], // Mon
    [4, 0, 1, 2, 3], // Tue
    [3, 4, 0, 1, 2], // Wed
    [2, 3, 4, 0, 1], // Thu
    [1, 2, 3, 4, 0], // Fri
    [0, 1, 2, 3, 4]  // Sat
  ];
  
  const blocks = [
    { time: '06:00 - 08:24' },
    { time: '08:24 - 10:48' },
    { time: '10:48 - 13:12' },
    { time: '13:12 - 15:36' },
    { time: '15:36 - 18:00' }
  ];
  
  return blocks.map((b, i) => {
    const idx = order[dinaIndex][i];
    return {
      ...b,
      name: saatNames[idx],
      desc: saatDesc[idx],
      status: idx === 3 ? 'warning' : idx === 1 || idx === 4 ? 'good' : 'neutral'
    };
  });
}

export function getCharacterScores(neptu: number) {
  // Map neptu to 5 radar dimensions (0-100 scale)
  const base = neptu / 18;
  return [
    { label: 'Kepemimpinan', value: Math.min(100, Math.round(base * 95 + (neptu % 3) * 5)) },
    { label: 'Rezeki', value: Math.min(100, Math.round(base * 85 + (neptu % 5) * 4)) },
    { label: 'Sosial', value: Math.min(100, Math.round(base * 90 + (neptu % 2) * 10)) },
    { label: 'Spiritual', value: Math.min(100, Math.round(base * 80 + (neptu % 4) * 6)) },
    { label: 'Kesehatan', value: Math.min(100, Math.round(base * 75 + (neptu % 7) * 4)) }
  ];
}

export function getJavaneseEvents(year: number) {
  // Approximate major Javanese/Islamic-Javanese events
  // Note: For real world apps, these should come from an API or a lunar library
  const events = [
    { name: '1 Suro (Tahun Baru Jawa)', month: 0, day: 7, desc: 'Awal bulan pertama dalam kalender Jawa. Waktu untuk melakukan tirakatan, kirab pusaka, dan mubeng beteng bagi masyarakat Jawa sebagai bentuk introspeksi diri.' },
    { name: 'Sekaten (Maulid Nabi)', month: 8, day: 16, desc: 'Rangkaian kegiatan tahunan memperingati hari lahir Nabi Muhammad. Identik dengan pasar malam, gamelan Sekaten, dan prosesi Gunungan.' },
    { name: 'Hari Jadi Weton Anda', type: 'dynamic', desc: 'Momen sakral kembalinya hari lahir Anda dalam siklus 35 hari (Selapan). Waktu yang baik untuk bersyukur dan melakukan meditasi.' }
  ];
  
  // Adjust for 2024 specifically for 1 Suro
  if (year === 2024) events[0].day = 7;
  if (year === 2025) {
     events[0].day = 27;
     events[0].month = 5; // June
  }

  return events;
}
