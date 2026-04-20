export interface Rajah {
  id: string;
  name: string;
  pattern: string;
  description: string;
  usage: string;
}

export const rajahs: Rajah[] = [
  {
    id: 'kalacakra-text',
    name: 'Rajah Kalacakra (Mantra)',
    pattern: 'ꦪꦩꦫꦗꦗꦫꦩꦪ\nꦪꦩꦤꦶꦱꦱꦶꦤꦩꦪ\nꦪꦱꦶꦫꦥꦥꦫꦱꦶꦪ\nꦪꦩꦶ\nꦪꦩꦶꦢꦺꦴꦱꦱꦢꦺꦴꦩꦪ',
    description: 'Sastra Bedhah (Sastra Balik) untuk perlindungan diri dari segala marabahaya dan niat jahat.',
    usage: 'Dipasang sebagai penghalau aura negatif di tempat tinggal.'
  },
  {
    id: 'wafaq-musallas',
    name: 'Wafaq Musallas (Perlindungan)',
    pattern: '┌───┬───┬───┐\n│ ٨ │ ١ │ ٦ │\n├───┼───┼───┤\n│ ٣ │ ٣ │ ٧ │\n├───┼───┼───┤\n│ ٤ │ ٩ │ ٢ │\n└───┴───┴───┘',
    description: 'Wafaq angka keberkahan dan perlindungan yang sangat umum dalam kearifan lokal Jambi dan Jawa.',
    usage: 'Biasanya ditulis pada media kain atau kertas untuk jimat keselamatan.'
  },
  {
    id: 'jimat-tolak-balak',
    name: 'Rajah Penutup (Tolak Balak)',
    pattern: '۞ ꦩꦤꦶꦏ꧀ꦩꦪ ۞\n۝ ꦲꦭ꧀ꦭꦺꦴꦲ꧀ ۝\nꦠꦺꦴꦭꦏ꧀ꦧꦭꦏ꧀\n꧔꧔꧔꧖꧖꧖',
    description: 'Simbol mistis untuk menutup celah energi negatif masuk ke dalam jiwa.',
    usage: 'Mantra pengunci yang dibaca saat meditasi atau malam hari.'
  },
  {
    id: 'pegon-keselamatan',
    name: 'Rajah Keselamatan (Pegon)',
    pattern: 'يَاحَفِيْظُ يَانَصِيْرُ\n۞ ꦱ꧀ꦭꦩꦼꦠ꧀ ۞\nيَاوَكِيْلُ يَااللهُ',
    description: 'Perpaduan doa keselamatan dalam bahasa Arab (Asmaul Husna) dan tulisan Jawa.',
    usage: 'Sering digunakan sebagai sugesti batin untuk penjagaan diri.'
  },
  {
    id: 'bismillah-7-pintu',
    name: 'Wafaq Bismillah 7 Pintu',
    pattern: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ\n۩ ۞ ۩\n١ ٢ ٣ ٤ ٥ ٦ ٧\n꧑ ꧒ ꧓ ꧔ ꧕ ꧖ ꧗',
    description: 'Wafaq pembuka pintu rezeki dan pintu kemudahan dari segala urusan.',
    usage: 'Digunakan sebagai pengingat akan kekuatan Basmalah dalam setiap langkah.'
  },
  {
    id: 'rajah-pengasihan',
    name: 'Rajah Pengasihan (Asmara)',
    pattern: '۞ ꦩꦤꦶꦱ꧀ ۞\nꦪꦩꦫꦗ\n❤ ꦠꦽꦱ꧀ꦤ ❤\nꦱꦶꦃ ꦮꦶꦭꦱꦱ',
    description: 'Rajah pemikat batin untuk keharmonisan hubungan dan kasih sayang.',
    usage: 'Mantra penyejuk hati dalam pergaulan sosial.'
  },
  {
    id: 'wafaq-rezeki-dagang',
    name: 'Wafaq Rezeki (Dagang)',
    pattern: '┌─────────┐\n│ ف │ ت │ ح │\n├─────────┤\n│ ر │ ز │ ق │\n├─────────┤\n│ ٩ │ ٩ │ ٩ │\n└─────────┘',
    description: 'Wafaq khusus untuk kelancaran usaha dan daya tarik pembeli.',
    usage: 'Ditulis atau dipajang di tempat usaha sebagai wasilah doa.'
  },
  {
    id: 'rajah-kewibawaan',
    name: 'Rajah Kewibawaan',
    pattern: 'ꦱꦶꦁꦲ \n۩ ꦩꦕꦤ꧀ ۩\nيَاجَبَّارُ يَاقَهَّارُ',
    description: 'Simbol macan dan asma ketegasan untuk meningkatkan karisma diri.',
    usage: 'Meningkatkan rasa percaya diri saat memimpin atau berbicara.'
  },
  {
    id: 'haikal-perlindungan',
    name: 'Jimat Haikal (Benteng)',
    pattern: '🛡️ ۩ ۩ 🛡️\nح س ب ي الله\nꦥꦒꦼꦂꦫꦸꦮꦠ꧀\n۞ ۞ ۞',
    description: 'Haikal pelindung (benteng ghaib) untuk menangkal gangguan non-medis.',
    usage: 'Sebagai sarana batin untuk ketenangan di tempat baru.'
  },
  {
    id: 'rajah-syifa-husada',
    name: 'Rajah Syifa (Kesehatan)',
    pattern: 'يَاشَافِيْ يَاکَافِيْ\nꦱꦼꦒꦼꦂ ꦮꦫꦱ꧀\n⚕️ ۞ ⚕️',
    description: 'Rajah doa untuk memohon kesembuhan dan kebugaran badan.',
    usage: 'Sugesti doa saat meminum air atau saat sedang memulihkan kesehatan.'
  },
  {
    id: 'rajah-puser-bumi',
    name: 'Rajah Puser Bumi (Kestabilan)',
    pattern: 'ꦥꦸꦱꦼꦂ\nꦧꦸꦩꦶ\n꧑꧐꧑꧒꧑꧔\n۞ ꦱꦠꦾ ۞',
    description: 'Lambang pusat ketenangan untuk menjaga keseimbangan hidup saat menghadapi badai persoalan.',
    usage: 'Dipakai saat meditasi atau menenangkan pikiran yang kalut.'
  },
  {
    id: 'wafaq-7-lapis',
    name: 'Wafaq 7 Lapis (Perlindungan Luar)',
    pattern: '٧ ٧ ٧ ٧ ٧ ٧ ٧\n۩ ۞ ۩\nꦥꦚꦺꦁꦏꦼꦂ\n🛡️🛡️🛡️',
    description: 'Wafaq perlindungan berlapis untuk menjaga harta dan keluarga.',
    usage: 'Dituliskan secara simbolis di gerbang atau pintu masuk.'
  },
  {
    id: 'rajah-megatruh',
    name: 'Rajah Megatruh (Putus Sengkolo)',
    pattern: '✂ ꦱꦼꦁꦏꦺꦴꦭꦺꦴ ✂\nꦲꦶꦭꦁ\n۞ ꦩꦸꦂꦤꦶ ۞',
    description: 'Rajah untuk memutuskan rantai nasib buruk atau energi negatif menahun.',
    usage: 'Dibaca pada malam pergantian weton untuk pembersihan diri.'
  },
  {
    id: 'rajah-asmoro-dunyo',
    name: 'Rajah Asmoro Dunyo (Harmoni)',
    pattern: 'ꦄꦱ꧀ꦩꦺꦴꦫꦺꦴ\n❤ ꦢꦸꦚ ❤\nꦱꦼꦩꦿꦤꦪ',
    description: 'Rajah untuk mendatangkan rasa kasih sayang di lingkungan sekitar.',
    usage: 'Digunakan untuk mendinginkan suasana konflik dalam keluarga.'
  },
  {
    id: 'jimat-panutup-lambe',
    name: 'Jimat Panutup Lambe (Pembungkem)',
    pattern: '❌ ꦭꦩ꧀ꦧꦼ ❌\nꦩꦼꦤꦼꦁ\n🤐 ۞ 🤐',
    description: 'Efisien untuk meredam fitnah atau omongan lisan yang menyakitkan.',
    usage: 'Digunakan sebagai filter batin agar lisan tetap terjaga.'
  },
  {
    id: 'rajah-semar-mesem',
    name: 'Rajah Semar Mesem (Wibawa)',
    pattern: '☺ ꦱꦼꦩꦂ ☺\nꦩꦺꦱꦼꦩ꧀\nꦤꦺꦴꦫꦺꦴ\n۞ ꦧꦼꦏ꧀ꦠꦶ ۞',
    description: 'Keyakinan tradisional untuk daya tarik tingkat tinggi dan kemudahan bersosialisasi.',
    usage: 'Diposisikan pada cermin pribadi sebagai pengingat aura positif.'
  },
  {
    id: 'wafaq-nur-muhammad',
    name: 'Wafaq Nur Muhammad (Cahaya)',
    pattern: 'نُوْرُ الله\n۞ ꦤꦸꦂ ۞\nنُوْرُ مُحَمَّد',
    description: 'Wafaq cahaya sejati untuk mencerahkan hati dan pikiran yang gelap.',
    usage: 'Dibaca sebelum istirahat malam agar hati tetap damai.'
  },
  {
    id: 'rajah-singa-lodra',
    name: 'Rajah Singa Lodra (Keberanian)',
    pattern: '🦁 ꦱꦶꦔ 🦁\nꦭꦺꦴꦢꦿ\nيَاقَوِيُّ يَامَتِيْنُ',
    description: 'Rajah untuk membangkitkan keberanian dalam membela kebenaran.',
    usage: 'Menguatkan mental saat menghadapi persidangan atau tantangan besar.'
  },
  {
    id: 'rajah-panyengker',
    name: 'Rajah Panyengker (Batas Sakral)',
    pattern: '▓ ꦱꦼꦁꦏꦼꦂ ▓\n۩ ۞ ۩\nꦥꦚꦼꦁꦏꦼꦂ',
    description: 'Membentuk batasan imajiner untuk memisahkan diri dari gangguan eksternal.',
    usage: 'Digunakan saat merasa lingkungan kerja atau rumah kurang kondusif.'
  },
  {
    id: 'rajah-bolo-sewu',
    name: 'Rajah Bolo Sewu (Penjaga)',
    pattern: '⚔️ ꦧꦺꦴꦭꦺꦴ ⚔️\nꦱꦺꦮꦸ\n🛡️ ۞ 🛡️',
    description: 'Simbol kesiagaan batin seolah memiliki seribu penjaga yang mendampingi.',
    usage: 'Meningkatkan rasa aman saat berada di tempat yang asing.'
  },
  {
    id: 'jimat-pager-omah',
    name: 'Jimat Pager Omah (Keamanan)',
    pattern: '🏠 ꦥꦒꦼꦂ 🏠\n۩ ۞ ۩\n꧑꧐꧗꧗꧐꧑',
    description: 'Wafaq untuk menjauhkan rumah dari niat pencurian atau bencana alam.',
    usage: 'Pola visual yang dipasang secara digital atau cetak di area rumah.'
  },
  {
    id: 'rajah-kesuksesan',
    name: 'Rajah Kesuksesan (Lumbung)',
    pattern: '💰 ꦭꦸꦩ꧀ꦧꦸꦁ 💰\nꦩꦸꦭꦾ\n📈 ۞ 📈',
    description: 'Simbol lumbung yang penuh sebagai harapan akan tercapainya cita-cita.',
    usage: 'Sebagai motivasi batin dalam mengejar prestasi.'
  },
  {
    id: 'rajah-muruah',
    name: 'Rajah Muruah (Harga Diri)',
    pattern: '۩ ꦩꦸꦫꦸꦄꦃ ۩\nꦗꦠꦶꦢꦶꦫꦶ\n۞ ꦩꦸꦭꦾ ۞',
    description: 'Menjaga kemuliaan diri agar tidak direndahkan oleh orang lain.',
    usage: 'Sesuai untuk menjaga martabat dalam lingkungan profesional.'
  },
  {
    id: 'wafaq-sapta-jala',
    name: 'Wafaq Sapta Jala (Jaring 7)',
    pattern: '🕸️ ꧗ 🕸️\nꦱꦥ꧀ꦠ ꦗꦭ\n۝ ۞ ۝',
    description: 'Wafaq jaring tujuh untuk menyaring energi agar hanya yang baik yang masuk.',
    usage: 'Digunakan sebagai filter informasi agar tidak mudah termakan berita buruk.'
  },
  {
    id: 'rajah-panutup-songo',
    name: 'Rajah Panutup Songo (Kontrol Diri)',
    pattern: '꧙ ꦱꦺꦴꦔꦺꦴ ꧙\nꦥꦤꦸꦠꦸꦥ꧀\n۞ ꦩꦼꦤꦼꦁ ۞',
    description: 'Menutup sembilan lubang hawa nafsu agar tetap fokus pada tujuan luhur.',
    usage: 'Sangat baik digunakan saat sedang menjalankan puasa atau tirakat.'
  },
  {
    id: 'rajah-kawruh-jati',
    name: 'Rajah Kawruh Jati (Kebijaksanaan)',
    pattern: 'ꦏꦮꦿꦸꦃ\nꦗꦠꦶ\n📖 ۞ 📖',
    description: 'Membuka wawasan batin untuk memahami hakikat kehidupan yang sebenarnya.',
    usage: 'Digunakan saat sedang mempelajari ilmu pengetahuan baru.'
  },
  {
    id: 'jimat-tolak-beling',
    name: 'Jimat Tolak Beling (Anti Sihir)',
    pattern: '💎 ꦠꦺꦴꦭꦏ꧀ 💎\nꦧꦼꦭꦶꦁ\n🛡️ ۞ 🛡️',
    description: 'Rajah khusus untuk memantulkan energi serangan magis yang tajam.',
    usage: 'Perisai batin saat merasa ada gangguan yang bersifat magis.'
  },
  {
    id: 'rajah-pambungkem',
    name: 'Rajah Pambungkem (Meredam Amarah)',
    pattern: '🤫 ꦧꦸꦁꦏꦼꦩ꧀ 🤫\nꦩꦼꦤꦼꦁ\n🤐 ۞ 🤐',
    description: 'Meredam amarah lawan bicara agar komunikasi tetap berjalan damai.',
    usage: 'Dibaca dalam hati saat menghadapi situasi perdebatan panas.'
  },
  {
    id: 'rajah-tunggul-wulung',
    name: 'Rajah Tunggul Wulung (Sakti)',
    pattern: '⚐ ꦠꦸꦁꦒꦸꦭ꧀ ⚐\nꦮꦸꦭꦸꦁ\n۞ ꦗꦪ ۞',
    description: 'Panji sakral untuk memenangkan persaingan hidup secara ksatria.',
    usage: 'Menguatkan tekad saat memulai proyek atau usaha baru.'
  },
  {
    id: 'wafaq-hayyu',
    name: 'Wafaq Hayyu (Energi Hidup)',
    pattern: 'يَاحَيُّ يَاقَيُّوْمُ\n۞ ꦲꦸꦫꦶꦥ꧀ ۞\nꦩꦸꦂꦤꦶ',
    description: 'Wafaq untuk membangkitkan semangat hidup yang sedang padam.',
    usage: 'Digunakan sebagai booster energi saat merasa lelah secara mental.'
  },
  {
    id: 'rajah-akhir-zaman',
    name: 'Rajah Akhir Zaman (Keselamatan Ruwat)',
    pattern: '⌛ ꦫꦸꦮꦠ꧀ ⌛\nꦱꦭꦩꦼꦠ꧀\n۞ ꦄꦩꦤ꧀ ۞',
    description: 'Rajah keselamatan menyeluruh untuk menghadapi zaman yang penuh ketidakpastian.',
    usage: 'Doa sapu jagad untuk perlindungan diri, keluarga, dan lingkungan.'
  }
];
