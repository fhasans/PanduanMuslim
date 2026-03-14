// ============================================================
// DATA DZIKIR SETELAH SHOLAT — PER WAKTU
// Source: dzikir&bacaan*.md files (user-provided)
// ============================================================

// ---- SHARED BUILDING BLOCKS ----
const SHARED = {
    istighfar: {
        judul: "Istighfar (3x)",
        desc: "Memohon ampunan kepada Allah.",
        latin: "Astaghfirullaahal-'azhiim, alladzii laa ilaaha illaa huwal-hayyul-qayyuum, wa atuubu ilaiih.",
        arti: "Aku memohon ampun kepada Allah Yang Maha Agung, tiada tuhan selain Dia, Yang Maha Hidup lagi Terus-menerus mengurus makhluk-Nya, dan aku bertaubat kepada-Nya.",
        target: 3
    },
    tahlilSingkat: {
        judul: "Tahlil (3x)",
        desc: "Pengakuan keesaan Allah setelah sholat.",
        latin: "Laa ilaaha illallaahu wahdahu laa syariika lah, lahul-mulku wa lahul-hamdu, yuhyii wa yumiitu, wa huwa 'alaa kulli syai'in qadiir.",
        arti: "Tiada tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya. Milik-Nya segala kerajaan dan pujian, Dia yang menghidupkan dan mematikan, dan Dia Maha Kuasa atas segala sesuatu.",
        target: 3
    },
    tahlilKhusus: {
        judul: "Tahlil Khusus (10x)",
        desc: "Dibaca sebelum mengubah posisi duduk (kaki) setelah salam.",
        latin: "Laa ilaaha illallaahu wahdahu laa syariika lah, lahul-mulku wa lahul-hamdu, yuhyii wa yumiitu, wa huwa 'alaa kulli syai'in qadiir.",
        arti: "Tiada tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya. Milik-Nya segala kerajaan dan pujian, Dia yang menghidupkan dan mematikan, dan Dia Maha Kuasa atas segala sesuatu.",
        target: 10
    },
    perlindunganNeraka: {
        judul: "Perlindungan Neraka (7x)",
        desc: "Doa pembebasan dari neraka, khusus dibaca setelah Subuh dan Maghrib.",
        latin: "Allahumma ajirnii minan-naar.",
        arti: "Ya Allah, lindungilah aku dari api neraka.",
        target: 7
    },
    pujianKedamaian: {
        judul: "Pujian Kedamaian (1x)",
        desc: "Memohon kesejahteraan dari Allah.",
        latin: "Allahumma antas-salaam, wa minkas-salaam, wa ilaika ya'uudus-salaam, fahayyinaa rabbanaa bis-salaam, wa adkhilnal-jannata daaras-salaam, tabaarakta rabbanaa wa ta'aalaita yaa dzal-jalaali wal-ikraam.",
        arti: "Ya Allah, Engkaulah Dzat Yang Maha Sejahtera, dari-Mu-lah kesejahteraan, dan kepada-Mu-lah kembalinya kesejahteraan. Hidupkanlah kami dengan sejahtera, dan masukkanlah kami ke surga tempat kesejahteraan. Maha Suci Engkau ya Tuhan kami dan Maha Tinggi Engkau, wahai Dzat yang memiliki Keagungan dan Kemuliaan.",
        target: 1
    },
    ayatKursi: {
        judul: "Ayat Kursi (1x)",
        desc: "Penjaga diri. Siapa yang membacanya tiap selesai sholat fardhu, tidak ada yang menghalanginya masuk surga.",
        latin: "Allahu laa ilaaha illaa huwal hayyul qayyuum, laa ta'khudzuhuu sinatuw wa laa naum. Lahuu maa fis-samaawaati wa maa fil-ardh. Man dzal-ladzii yasyfa'u 'indahuu illaa bi-idznih. Ya'lamu maa baina aidiihim wa maa khalfahum. Wa laa yuhiithuuna bisyai-im min 'ilmihii illaa bimaa syaa-a. Wasi'a kursiyyuhus-samaawaati wal-ardh. Wa laa ya'uuduhuu hifzhuhumaa wahuwal 'aliyyul 'azhiim.",
        arti: "Allah, tiada tuhan selain Dia. Yang Maha Hidup, Yang terus-menerus mengurus makhluk-Nya, tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan di bumi. Tidak ada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang di hadapan dan di belakang mereka. Mereka tidak mengetahui sesuatu pun dari ilmu-Nya melainkan apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi. Dan Dia tidak merasa berat memelihara keduanya, dan Dia Maha Tinggi, Maha Besar.",
        target: 1
    },
    surahPerlindungan1x: {
        judul: "Tiga Surah Perlindungan (masing-masing 1x)",
        desc: "Dibaca 1x untuk sholat Dzuhur, Ashar, dan Isya.",
        isSequence: true,
        items: [
            { judul: "Al-Ikhlas (1x)", latin: "Qul huwallahu ahad. Allahush-shamad. Lam yalid wa lam yuulad. Wa lam yakul lahuu kufuwan ahad.", arti: "Katakanlah: Dialah Allah, Yang Maha Esa. Allah tempat meminta segala sesuatu. Dia tidak beranak dan tidak diperanakkan. Dan tidak ada sesuatu yang setara dengan Dia.", target: 1 },
            { judul: "Al-Falaq (1x)", latin: "Qul a'uudzu birabbil falaq. Min syarri maa khalaq. Wa min syarri ghaasiqin idzaa waqab. Wa min syarrin-naffaathaati fil-'uqad. Wa min syarri haasidin idzaa hasad.", arti: "Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh. Dari kejahatan makhluk yang Dia ciptakan. Dari kejahatan malam apabila telah gelap gulita. Dari kejahatan penyihir yang meniup pada buhul-buhul. Dan dari kejahatan orang yang dengki apabila dia dengki.", target: 1 },
            { judul: "An-Nas (1x)", latin: "Qul a'uudzu birabbin-naas. Malikin-naas. Ilaahin-naas. Min syarril waswaasil-khannaas. Alladzii yuwaswisu fii shuduurin-naas. Minal-jinnati wan-naas.", arti: "Katakanlah: Aku berlindung kepada Tuhannya manusia. Rajanya manusia. Sembahan manusia. Dari kejahatan bisikan setan yang bersembunyi. Yang membisikkan kejahatan ke dalam dada manusia. Dari golongan jin dan manusia.", target: 1 }
        ]
    },
    surahPerlindungan3x: {
        judul: "Tiga Surah Perlindungan (masing-masing 3x)",
        desc: "Khusus setelah Subuh dan Maghrib, dibaca 3 kali.",
        isSequence: true,
        items: [
            { judul: "Al-Ikhlas (3x)", latin: "Qul huwallahu ahad. Allahush-shamad. Lam yalid wa lam yuulad. Wa lam yakul lahuu kufuwan ahad.", arti: "Katakanlah: Dialah Allah, Yang Maha Esa. Allah tempat meminta segala sesuatu. Dia tidak beranak dan tidak diperanakkan. Dan tidak ada sesuatu yang setara dengan Dia.", target: 3 },
            { judul: "Al-Falaq (3x)", latin: "Qul a'uudzu birabbil falaq. Min syarri maa khalaq. Wa min syarri ghaasiqin idzaa waqab. Wa min syarrin-naffaathaati fil-'uqad. Wa min syarri haasidin idzaa hasad.", arti: "Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh. Dari kejahatan makhluk yang Dia ciptakan. Dari kejahatan malam apabila telah gelap gulita. Dari kejahatan penyihir yang meniup pada buhul-buhul. Dan dari kejahatan orang yang dengki apabila dia dengki.", target: 3 },
            { judul: "An-Nas (3x)", latin: "Qul a'uudzu birabbin-naas. Malikin-naas. Ilaahin-naas. Min syarril waswaasil-khannaas. Alladzii yuwaswisu fii shuduurin-naas. Minal-jinnati wan-naas.", arti: "Katakanlah: Aku berlindung kepada Tuhannya manusia. Rajanya manusia. Sembahan manusia. Dari kejahatan bisikan setan yang bersembunyi. Yang membisikkan kejahatan ke dalam dada manusia. Dari golongan jin dan manusia.", target: 3 }
        ]
    },
    tasbihSet: {
        judul: "Tasbih, Tahmid, Takbir & Penggenap 100",
        desc: "Akhiri dengan dzikir 33x-33x-33x lalu penggenap ke-100.",
        isSequence: true,
        items: [
            { judul: "Tasbih (33x)", latin: "Subhaanallaah.", arti: "Maha Suci Allah.", target: 33 },
            { judul: "Tahmid (33x)", latin: "Alhamdulillaah.", arti: "Segala Puji bagi Allah.", target: 33 },
            { judul: "Takbir (33x)", latin: "Allahu Akbar.", arti: "Allah Maha Besar.", target: 33 },
            { judul: "Penggenap ke-100 (1x)", latin: "Laa ilaaha illallaahu wahdahu laa syariika lah, lahul-mulku wa lahul-hamdu wa huwa 'alaa kulli syai-in qadiir.", arti: "Tiada tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya. Milik-Nya segala kerajaan dan pujian, dan Dia Maha Kuasa atas segala sesuatu.", target: 1 }
        ]
    },
    doaPenutup: {
        judul: "Doa Penutup",
        desc: "Doa memohon kebaikan, keselamatan, dan ditutup dengan shalawat.",
        isSequence: true,
        items: [
            { judul: "Basmallah & Shalawat Pembuka", latin: "Bismillaahirrahmaanirrahiim. Alhamdulillaahi rabbil 'aalamiin. Allahumma shalli 'alaa Sayyidinaa Muhammad, wa 'alaa aali Sayyidinaa Muhammad.", arti: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam. Ya Allah, limpahkanlah rahmat kepada Nabi Muhammad, dan kepada keluarga Nabi Muhammad.", target: 1 },
            { judul: "Doa Keselamatan", latin: "Allahumma innaa nas'aluka salaa-matan fid-diin, wa 'aafiyatan fil-jasad, wa ziyaa-datan fil-'ilm, wa barakatan fir-rizq, wa taubatan qablal-maut, wa rahmatan 'indal-maut, wa maghfiratan ba'dal-maut.", arti: "Ya Allah, sungguh kami memohon keselamatan agama, kesehatan jasmani, tambahan ilmu, keberkahan rezeki, taubat sebelum mati, rahmat saat mati, dan ampunan setelah mati.", target: 1 },
            { judul: "Doa Sapu Jagat", latin: "Rabbanaa aatinaa fid-dunyaa hasanah, wa fil-aakhirati hasanah, wa qinaa 'adzaaban-naar.", arti: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.", target: 1 },
            { judul: "Shalawat Penutup", latin: "Wa shallallaahu 'alaa Sayyidinaa Muhammadin wa 'alaa aalihii wa shahbihii wa sallam. Walhamdulillaahi rabbil 'aalamiin.", arti: "Semoga Allah melimpahkan rahmat dan keselamatan kepada Nabi Muhammad, beserta keluarga dan sahabatnya. Segala puji bagi Allah, Tuhan semesta alam.", target: 1 }
        ]
    }
};

// ============================================================
// EXPORT: Per-Waktu Dzikir Data
// ============================================================

export const dzikirPerWaktu = {
    subuh: {
        label: "Subuh",
        catatan: "Dzikir Subuh memiliki keistimewaan yang sama dengan Maghrib: Tahlil 10x, Doa Perlindungan Neraka 7x, dan tiga surah perlindungan dibaca 3x. Ada tambahan doa khusus pagi dari Nabi ﷺ.",
        items: [
            SHARED.istighfar,
            SHARED.tahlilKhusus,
            SHARED.perlindunganNeraka,
            SHARED.pujianKedamaian,
            {
                judul: "Doa Khusus Pagi/Subuh (1x)",
                desc: "Doa yang rutin dibaca Nabi ﷺ khusus setelah salam sholat Subuh. (HR. Ibnu Majah)",
                latin: "Allahumma innii as-aluka 'ilman naafi'an, wa rizqan thayyiban, wa 'amalan mutaqabbalan.",
                arti: "Ya Allah, sungguh aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik (halal), dan amal yang diterima.",
                target: 1
            },
            SHARED.ayatKursi,
            SHARED.surahPerlindungan3x,
            SHARED.tasbihSet,
            SHARED.doaPenutup
        ]
    },
    dzuhur: {
        label: "Dzuhur",
        catatan: "Rangkaian dzikir Dzuhur sama dengan Ashar dan Isya. Tahlil cukup 3x, tidak ada doa perlindungan neraka 7x, dan tiga surah perlindungan cukup dibaca 1x.",
        items: [
            SHARED.istighfar,
            SHARED.tahlilSingkat,
            SHARED.pujianKedamaian,
            SHARED.ayatKursi,
            SHARED.surahPerlindungan1x,
            SHARED.tasbihSet,
            SHARED.doaPenutup
        ]
    },
    ashar: {
        label: "Ashar",
        catatan: "Rangkaian dzikir Ashar sama persis dengan Dzuhur dan Isya.",
        items: [
            SHARED.istighfar,
            SHARED.tahlilSingkat,
            SHARED.pujianKedamaian,
            SHARED.ayatKursi,
            SHARED.surahPerlindungan1x,
            SHARED.tasbihSet,
            SHARED.doaPenutup
        ]
    },
    maghrib: {
        label: "Maghrib",
        catatan: "Sama seperti Subuh: Tahlil 10x, Doa Perlindungan Neraka 7x, dan tiga surah perlindungan dibaca 3x.",
        items: [
            SHARED.istighfar,
            SHARED.tahlilKhusus,
            SHARED.perlindunganNeraka,
            SHARED.pujianKedamaian,
            SHARED.ayatKursi,
            SHARED.surahPerlindungan3x,
            SHARED.tasbihSet,
            SHARED.doaPenutup
        ]
    },
    isya: {
        label: "Isya",
        catatan: "Sama dengan Dzuhur dan Ashar: Tahlil 3x, tidak ada doa perlindungan neraka 7x, dan tiga surah perlindungan cukup dibaca 1x.",
        items: [
            SHARED.istighfar,
            SHARED.tahlilSingkat,
            SHARED.pujianKedamaian,
            SHARED.ayatKursi,
            SHARED.surahPerlindungan1x,
            SHARED.tasbihSet,
            SHARED.doaPenutup
        ]
    },
    tahajjud: {
        label: "Tahajjud",
        catatan: "Selain dzikir standar, sangat ditekankan membaca Sayyidul Istighfar dan Doa Tahajjud khusus yang diajarkan Nabi ﷺ (HR. Bukhari & Muslim).",
        items: [
            SHARED.istighfar,
            {
                judul: "Sayyidul Istighfar (1x)",
                desc: "Penghulu istighfar, sangat dianjurkan di sepertiga malam terakhir.",
                latin: "Allahumma anta rabbii laa ilaaha illaa anta, khalaqtanii wa ana 'abduka, wa ana 'alaa 'ahdika wa wa'dika masta-tha'tu, a'uudzu bika min syarri maa shana'tu, abuu-u laka bini'matika 'alayya, wa abuu-u bidzanbii faghfir lii fa-innahuu laa yaghfirudz-dzunuuba illaa anta.",
                arti: "Ya Allah, Engkau adalah Tuhanku, tidak ada tuhan selain Engkau yang telah menciptakanku. Aku adalah hamba-Mu, dan aku senantiasa dalam ikatan janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan yang telah aku perbuat. Aku mengakui nikmat-Mu kepadaku, dan aku mengakui dosaku. Maka ampunilah aku, karena sungguh tidak ada yang dapat mengampuni dosa-dosa selain Engkau.",
                target: 1
            },
            SHARED.ayatKursi,
            SHARED.surahPerlindungan1x,
            SHARED.tasbihSet,
            {
                judul: "Doa Tahajjud (1x)",
                desc: "Doa yang diajarkan Nabi ﷺ khusus setelah sholat malam. (HR. Bukhari & Muslim, dari Ibnu Abbas ra.)",
                latin: "Allahumma lakal-hamdu, anta qayyimus-samaawaati wal-ardhi wa man fiihinna. Wa lakal-hamdu, laka mulkus-samaawaati wal-ardhi wa man fiihinna. Wa lakal-hamdu, anta nuurus-samaawaati wal-ardh. Wa lakal-hamdu, antal-haq, wa wa'dukal-haq, wa liqaa'uka haq, wa qauluka haq, wal-jannatu haq, wan-naaru haq, wan-nabiyyuuna haq, wa Muhammadun shallallaahu 'alaihi wa sallama haq, was-saa'atu haq. Allahumma laka aslamtu, wa bika aamantu, wa 'alaika tawakkaltu, wa ilaika anabtu, wa bika khaashamtu, wa ilaika haakamtu. Faghfir lii maa qaddamtu, wa maa akhkhartu, wa maa asrartu, wa maa a'lantu, wa maa anta a'lamu bihii minnii. Antal-muqaddimu wa antal-mu'akhkhiru, laa ilaaha illaa anta, wa laa haula wa laa quwwata illaa billaah.",
                arti: "Ya Allah, bagi-Mu segala puji. Engkaulah Pemelihara langit dan bumi serta apa yang ada di dalamnya. Bagi-Mu segala puji, milik-Mu kerajaan langit dan bumi. Bagi-Mu segala puji, Engkaulah Cahaya langit dan bumi. Bagi-Mu segala puji, Engkaulah Yang Maha Benar, janji-Mu benar, pertemuan dengan-Mu benar, firman-Mu benar, surga itu benar, neraka itu benar, para nabi itu benar, Nabi Muhammad ﷺ itu benar, dan hari kiamat itu benar. Ya Allah, hanya kepada-Mu aku berserah diri, beriman, bertawakal, dan kembali. Maka ampunilah dosa-dosaku yang lalu dan yang akan datang, yang tersembunyi dan yang nyata. Engkaulah Yang Maha Terdahulu dan Yang Maha Terakhir. Tiada tuhan selain Engkau, dan tiada daya serta kekuatan melainkan dengan pertolongan Allah.",
                target: 1
            },
            {
                judul: "Doa Penutup (Sapu Jagat)",
                desc: "Ditutup dengan permohonan kebaikan dunia-akhirat. Silakan tambahkan doa hajat pribadi.",
                isSequence: true,
                items: [
                    { judul: "Doa Sapu Jagat", latin: "Rabbanaa aatinaa fid-dunyaa hasanah, wa fil-aakhirati hasanah, wa qinaa 'adzaaban-naar.", arti: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.", target: 1 },
                    { judul: "Shalawat Penutup", latin: "Wa shallallaahu 'alaa Sayyidinaa Muhammadin wa 'alaa aalihii wa shahbihii wa sallam. Walhamdulillaahi rabbil 'aalamiin.", arti: "Semoga Allah melimpahkan rahmat dan keselamatan kepada Nabi Muhammad, beserta keluarga dan sahabatnya. Segala puji bagi Allah, Tuhan semesta alam.", target: 1 }
                ]
            }
        ]
    },
    taubat: {
        label: "Taubat",
        catatan: "Fokus utama dzikir setelah Sholat Taubat adalah istighfar yang panjang dan penuh penyesalan. Taubat yang diterima harus memenuhi 3 syarat: berhenti dari dosa, menyesal, dan bertekad tidak mengulangi.",
        items: [
            {
                judul: "Istighfar Utama (33x atau lebih)",
                desc: "Sangat dianjurkan membaca dengan penuh penyesalan dan ketundukan hati.",
                latin: "Astaghfirullaahal-'azhiim, alladzii laa ilaaha illaa huwal-hayyul-qayyuum, wa atuubu ilaiih.",
                arti: "Aku memohon ampun kepada Allah Yang Maha Agung, tiada tuhan selain Dia, Yang Maha Hidup lagi Terus-menerus mengurus makhluk-Nya, dan aku bertaubat kepada-Nya.",
                target: 33
            },
            {
                judul: "Sayyidul Istighfar (1x)",
                desc: "Penghulu (rajanya) istighfar. Sangat dianjurkan oleh Nabi ﷺ.",
                latin: "Allahumma anta rabbii laa ilaaha illaa anta, khalaqtanii wa ana 'abduka, wa ana 'alaa 'ahdika wa wa'dika masta-tha'tu, a'uudzu bika min syarri maa shana'tu, abuu-u laka bini'matika 'alayya, wa abuu-u bidzanbii faghfir lii fa-innahuu laa yaghfirudz-dzunuuba illaa anta.",
                arti: "Ya Allah, Engkau adalah Tuhanku, tidak ada tuhan selain Engkau Yang menciptakanku. Aku adalah hamba-Mu, dalam ikatan janji-Mu semampuku. Aku berlindung dari keburukan perbuatanku. Aku mengakui nikmat-Mu dan dosa-dosaku. Maka ampunilah aku, karena tidak ada yang mengampuni dosa selain Engkau.",
                target: 1
            },
            SHARED.ayatKursi,
            SHARED.surahPerlindungan1x,
            {
                judul: "Doa Taubat Khusus",
                desc: "Tundukkan kepala dan bacalah doa berikut dengan penuh penyesalan.",
                isSequence: true,
                items: [
                    { judul: "Doa Ampunan Menyeluruh", latin: "Allahummaghfir lii dzanbii kullahu, diqqahu wa jillahu, wa awwalahu wa aakhirahu, wa 'alaaniyatahu wa sirrahu.", arti: "Ya Allah, ampunilah seluruh dosaku, baik yang kecil maupun yang besar, yang pertama maupun yang terakhir, yang terang-terangan maupun yang tersembunyi.", target: 1 },
                    { judul: "Pengakuan Kezaliman Diri (QS. 7:23)", latin: "Rabbanaa zhalamnaa anfusanaa, wa illam taghfir lanaa wa tarhamnaa lanakuunanna minal-khaasiriin.", arti: "Ya Tuhan kami, kami telah menzalimi diri kami sendiri. Jika Engkau tidak mengampuni kami dan memberi rahmat, niscaya kami termasuk orang-orang yang rugi.", target: 1 },
                    { judul: "Permohonan Taubat Diterima", latin: "Rabbi-ghfir lii watub 'alayya, innaka antat-tawwaabur-rahiim.", arti: "Ya Tuhanku, ampunilah aku dan terimalah taubatku, sesungguhnya Engkau Maha Penerima taubat lagi Maha Penyayang.", target: 0 }
                ]
            }
        ]
    }
};

// Backward compatibility (for any component that still uses old exports)
export const dzikirUmum = dzikirPerWaktu.dzuhur.items;
export const dzikirKhusus = [SHARED.tahlilKhusus, SHARED.perlindunganNeraka];
