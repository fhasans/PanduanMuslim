import React, { useState } from 'react';
import {
    BookOpen,
    Droplets,
    Moon,
    Heart,
    Home,
    CheckCircle2,
    Clock,
    Sun,
    Sunrise,
    Sunset,
    MoonStar,
    ChevronDown,
    ChevronUp,
    Calendar,
    Star,
    Book,
    Volume2,
    Users,
    Search,
    Filter
} from 'lucide-react';

// --- RAGAALEE QABIYYEE (HANYA LATIN & ARTI) ---

const bacaanSholatLengkap = [
    {
        gerakan: "Takbiratul Ihram",
        instruksi: "Dibaca 1x sebagai pembuka sholat",
        latin: "Allahu Akbar.",
        arti: "Allah Maha Besar."
    },
    {
        gerakan: "Doa Iftitah (Shafi'i)",
        instruksi: "Dibaca 1x HANYA pada rakaat pertama",
        latin: "Allaahu akbar kabiiraa, walhamdu lillaahi katsiiraa, wa subhaanallaahi bukratan wa ashiilaa. Innii wajjahtu wajhiya lilladzii fatharas samaawaati wal ardha haniifan musliman wa maa anaa minal musyrikiin. Inna shalaatii wa nusukii wa mahyaaya wa mamaatii lillaahi rabbil 'aalamiin. Laa syariika lahu wa bidzaalika umirtu wa anaa minal muslimiin.",
        arti: "Allah Maha Besar dengan sebesar-besarnya, segala puji bagi Allah dengan pujian yang banyak, Maha Suci Allah di waktu pagi dan petang. Sesungguhnya aku hadapkan wajahku kepada Dzat yang menciptakan langit dan bumi dengan keadaan lurus dan berserah diri, dan aku bukanlah dari golongan musyrikin. Sesungguhnya shalatku, ibadahku, hidupku dan matiku hanya untuk Allah, Tuhan semesta alam. Tiada sekutu bagi-Nya, dan demikianlah aku diperintahkan, dan aku termasuk golongan orang-orang muslim."
    },
    {
        gerakan: "Membaca Al-Fatihah (Wajib)",
        instruksi: "Wajib dibaca 1x pada SETIAP rakaat",
        latin: "Bismillaahir rahmaanir rahiim. Alhamdulillaahi rabbil 'aalamiin. Ar-rahmaanir rahiim. Maaliki yaumid diin. Iyyaaka na'budu wa iyyaaka nasta'iin. Ihdinas shiraathal mustaqiim. Shiraathal ladziina an'amta 'alaihim, ghairil maghdhuubi 'alaihim wa ladh-dhaalliin. (Aamiin)",
        arti: "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam. Maha Pengasih lagi Maha Penyayang. Pemilik hari pembalasan. Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan. Tunjukilah kami jalan yang lurus. (Yaitu) jalan orang-orang yang telah Engkau beri nikmat, bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat."
    },
    {
        gerakan: "Membaca Surat Pendek / Potongan Ayat Al-Qur'an (Sunnah)",
        instruksi: "Dianjurkan Setiap Setelah Baca Al-Fatihah",
        latin: "Bismillaahir rahmaanir rahiim. Qul huwallaahu ahad. Allaahush shamad. Lam yalid wa lam yuulad. Wa lam yakul lahuu kufuwan ahad.",
        arti: "Diatas adalah contoh surat pendek dari Al-Qur'an"
    },
    {
        gerakan: "Ruku'",
        instruksi: "Disunnahkan dibaca 3x SETIAP Ruku'",
        latin: "Subhaanakallaahumma rabbanaa wa bihamdika allaahummaghfir lii.",
        arti: "Maha Suci Engkau, ya Allah Tuhan kami, dan dengan memuji-Mu. Ya Allah, ampunilah aku."
    },
    {
        gerakan: "I'tidal (Bangkit dari Ruku')",
        instruksi: "Dibaca 1x setiap berdiri tegak dari Ruku'",
        latin: "Sami'allaahu liman hamidah. Rabbanaa lakal hamdu mil'us samaawaati wa mil'ul ardhi wa mil'u maa syi'ta min syai-in ba'du.",
        arti: "Allah maha mendengar pujian orang yang memuji-Nya. Ya Tuhan kami, bagi-Mu segala puji, sepenuh langit dan bumi, dan sepenuh apa yang Engkau kehendaki sesudah itu."
    },
    {
        gerakan: "Sujud",
        instruksi: "Disunnahkan dibaca 3x (setiap kali sujud)",
        latin: "Subhaanakallaahumma rabbanaa wa bihamdika allaahummaghfir lii.",
        arti: "Maha Suci Engkau, ya Allah Tuhan kami, dan dengan memuji-Mu. Ya Allah, ampunilah aku."
    },
    {
        gerakan: "Duduk di Antara Dua Sujud (Sunnah)",
        instruksi: "SANGAT DIANJURKAN Dibaca setiap duduk di antara dua sujud",
        latin: "Rabbighfirlii warhamnii wajburnii warfa'nii warzuqnii wahdinii wa 'aafinii wa'fu 'annii.",
        arti: "Ya Tuhanku, ampunilah aku, rahmatilah aku, cukupkanlah kekuranganku, angkatlah derajatku, berilah aku rezeki, berilah aku petunjuk, berilah aku kesehatan, dan maafkanlah aku."
    },
    {
        gerakan: "Tasyahud Awal (Duduk Rakaat Kedua)",
        instruksi: "Dibaca 1x saat duduk di rakaat ke-2 (untuk sholat >2 rakaat)",
        latin: "Attahiyaatu lillaahi wash shalawaatu wath thayyibaat. Assalaamu 'alaika ayyuhan nabiyyu wa rahmatullaahi wa barakaatuh. Assalaamu 'alainaa wa 'alaa 'ibaadillaahish shaalihiin. Asyhadu allaa ilaaha illallaah, wa asyhadu anna Muhammadan 'abduhu wa rasuuluh. Allaahumma shalli 'alaa Sayyidinaa Muhammad.",
        arti: "Segala penghormatan, sholawat, dan kebaikan adalah milik Allah. Semoga keselamatan, rahmat Allah, dan keberkahan-Nya tercurah kepadamu wahai Nabi. Semoga keselamatan tercurah kepada kami dan hamba-hamba Allah yang shalih. Aku bersaksi tiada tuhan yang berhak disembah selain Allah, dan aku bersaksi Muhammad adalah hamba dan utusan-Nya. Ya Allah, limpahkanlah rahmat kepada penghulu kami Nabi Muhammad."
    },
    {
        gerakan: "Tasyahud Akhir (Duduk Terakhir)",
        instruksi: "Dibaca 1x saat duduk di rakaat paling terakhir",
        latin: "Attahiyaatu lillaahi wash shalawaatu wath thayyibaat. Assalaamu 'alaika ayyuhan nabiyyu wa rahmatullaahi wa barakaatuh. Assalaamu 'alainaa wa 'alaa 'ibaadillaahish shaalihiin. Asyhadu allaa ilaaha illallaah, wa asyhadu anna Muhammadan 'abduhu wa rasuuluh. Allaahumma shalli 'alaa Sayyidinaa Muhammad wa 'alaa aali Sayyidinaa Muhammad, kamaa shallaita 'alaa Sayyidinaa Ibraahiim wa 'alaa aali Sayyidinaa Ibraahiim, wa baarik 'alaa Sayyidinaa Muhammad wa 'alaa aali Sayyidinaa Muhammad, kamaa baarakta 'alaa Sayyidinaa Ibraahiim wa 'alaa aali Sayyidinaa Ibraahiim, fil 'aalamiina innaka hamiidum majiid.",
        arti: "Segala penghormatan, sholawat, dan kebaikan adalah milik Allah. Semoga keselamatan, rahmat Allah, dan keberkahan-Nya tercurah kepadamu wahai Nabi. Semoga keselamatan tercurah kepada kami dan hamba-hamba Allah yang shalih. Aku bersaksi tiada tuhan yang berhak disembah selain Allah, dan aku bersaksi Muhammad adalah hamba dan utusan-Nya. Ya Allah, limpahkanlah rahmat kepada penghulu kami Nabi Muhammad dan keluarganya, sebagaimana Engkau melimpahkan rahmat kepada Nabi Ibrahim dan keluarganya, dan berkahilah Nabi Muhammad dan keluarganya, sebagaimana Engkau memberkahi Nabi Ibrahim dan keluarganya, di seluruh alam sesungguhnya Engkau Maha Terpuji lagi Maha Mulia."
    },
    {
        gerakan: "Doa Sebelum Salam",
        instruksi: "Dibaca 1x sesudah Tasyahud Akhir (Sunnah)",
        latin: "Allaahumma innii a'uudzu bika min 'adzaabi jahannam, wa min 'adzaabil qabri, wa min fitnatil mahyaa wal mamaati, wa min syarri fitnatil masiihid dajjaal.",
        arti: "Ya Allah, aku berlindung kepada-Mu dari siksa Jahannam, dari siksa kubur, dari fitnah kehidupan dan kematian, serta dari keburukan fitnah Dajjal."
    },
    {
        gerakan: "Salam",
        instruksi: "Dibaca 1x menoleh kanan, lalu 1x menoleh kiri",
        latin: "Assalaamu 'alaikum wa rahmatullaah.",
        arti: "Semoga keselamatan dan rahmat Allah tercurah kepada kalian. (Menoleh ke kanan, lalu ke kiri)"
    }
];

const dataSholatWajib = [
    { id: 'subuh', nama: 'Subuh', waktu: 'Terbit fajar hingga terbit matahari', rakaat: 2, icon: <Sunrise size={20} className="text-blue-500" />, niat: "Ushallii fardhash shubhi rak'ataini mustaqbilal qiblati adaa-an lillaahi ta'aalaa.", artiNiat: "Aku berniat sholat fardhu Subuh dua rakaat menghadap kiblat karena Allah Ta'ala." },
    { id: 'dzuhur', nama: 'Dzuhur', waktu: 'Matahari tergelincir ke barat hingga bayangan sama panjang', rakaat: 4, icon: <Sun size={20} className="text-amber-500" />, niat: "Ushallii fardhadh dhuhri arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa.", artiNiat: "Aku berniat sholat fardhu Dzuhur empat rakaat menghadap kiblat karena Allah Ta'ala." },
    { id: 'ashar', nama: 'Ashar', waktu: 'Bayangan lebih panjang dari benda hingga matahari terbenam', rakaat: 4, icon: <Clock size={20} className="text-orange-500" />, niat: "Ushallii fardhal 'ashri arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa.", artiNiat: "Aku berniat sholat fardhu Ashar empat rakaat menghadap kiblat karena Allah Ta'ala." },
    { id: 'maghrib', nama: 'Maghrib', waktu: 'Matahari terbenam hingga hilangnya mega merah', rakaat: 3, icon: <Sunset size={20} className="text-red-500" />, niat: "Ushallii fardhal maghribi tsalaatsa raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa.", artiNiat: "Aku berniat sholat fardhu Maghrib tiga rakaat menghadap kiblat karena Allah Ta'ala." },
    { id: 'isya', nama: 'Isya', waktu: 'Hilangnya mega merah hingga pertengahan malam', rakaat: 4, icon: <MoonStar size={20} className="text-indigo-500" />, niat: "Ushallii fardhal 'isyaa-i arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa.", artiNiat: "Aku berniat sholat fardhu Isya empat rakaat menghadap kiblat karena Allah Ta'ala." }
];

const dataSholatSunnah = [
    {
        kategori: "Sholat Dhuha",
        daftar: [
            {
                nama: "Sholat Dhuha (2 - 8 Rakaat)",
                keutamaan: "Sebagai sedekah bagi seluruh persendian tubuh dan membawa kecukupan rezeki.",
                niat: "Ushallii sunnatadh dhuhaa rak'ataini lillaahi ta'aalaa.",
                arti: "Aku berniat sholat sunnah Dhuha dua rakaat karena Allah Ta'ala.",
                doaSetelah: {
                    latin: "Allaahumma innadh dhuhaa-a dhuhaa-uka, wal bahaa-a bahaa-uka, wal jamaala jamaaluka, wal quwwata quwwatuka, wal qudrata qudratuka, wal ishmata ishmatuka. Allaahumma in kaana rizqii fis samaa-i fa-anzilhu, wa in kaana fil ardhi fa-akhrijhu, wa in kaana mu'assiran fayassirhu, wa in kaana haraaman fathahhirhu, wa in kaana ba'iidan faqarribhu, bihaqqi dhuhaa-ika wa bahaa-ika wa jamaalika wa quwwatika wa qudratika, aatinii maa aataita 'ibaadakash shaalihiin.",
                    arti: "Ya Allah, sesungguhnya waktu Dhuha adalah waktu Dhuha-Mu, keagungan adalah keagungan-Mu, keindahan adalah keindahan-Mu, kekuatan adalah kekuatan-Mu, penjagaan adalah penjagaan-Mu. Ya Allah, apabila rezekiku berada di atas langit maka turunkanlah, apabila berada di dalam bumi maka keluarkanlah, apabila sukar mudahkanlah, apabila haram sucikanlah, apabila jauh dekatkanlah dengan kebenaran dhuha-Mu, keagungan-Mu, keindahan-Mu dan kekuatan-Mu, berikanlah kepadaku apa yang Engkau berikan kepada hamba-hamba-Mu yang shalih."
                }
            }
        ]
    },
    {
        kategori: "Qobliyah (Sebelum Sholat Wajib)",
        daftar: [
            { nama: "2 Rakaat Sebelum Subuh (Mu'akkad)", keutamaan: "Lebih baik dari dunia dan seisinya.", niat: "Ushallii sunnatash shubhi rak'ataini qabliyyatan lillaahi ta'aalaa.", arti: "Aku berniat sholat sunnah sebelum Subuh dua rakaat karena Allah Ta'ala." },
            { nama: "2 atau 4 Rakaat Sebelum Dzuhur (Mu'akkad)", niat: "Ushallii sunnatadh dhuhri rak'ataini (arba'a raka'aatin) qabliyyatan lillaahi ta'aalaa.", arti: "Aku berniat sholat sunnah sebelum Dzuhur dua (empat) rakaat karena Allah Ta'ala." },
            { nama: "2 atau 4 Rakaat Sebelum Ashar (Ghairu Mu'akkad)", keutamaan: "Allah merahmati orang yang sholat 4 rakaat sebelum Ashar.", niat: "Ushallii sunnatal 'ashri rak'ataini (arba'a raka'aatin) qabliyyatan lillaahi ta'aalaa.", arti: "Aku berniat sholat sunnah sebelum Ashar dua (empat) rakaat karena Allah Ta'ala." },
            { nama: "2 Rakaat Sebelum Maghrib (Ghairu Mu'akkad)", niat: "Ushallii sunnatal maghribi rak'ataini qabliyyatan lillaahi ta'aalaa.", arti: "Aku berniat sholat sunnah sebelum Maghrib dua rakaat karena Allah Ta'ala." },
            { nama: "2 Rakaat Sebelum Isya (Ghairu Mu'akkad)", niat: "Ushallii sunnatal 'isyaa-i rak'ataini qabliyyatan lillaahi ta'aalaa.", arti: "Aku berniat sholat sunnah sebelum Isya dua rakaat karena Allah Ta'ala." }
        ]
    },
    {
        kategori: "Ba'diyah (Sesudah Sholat Wajib)",
        daftar: [
            { nama: "2 Rakaat Sesudah Dzuhur (Mu'akkad)", niat: "Ushallii sunnatadh dhuhri rak'ataini ba'diyyatan lillaahi ta'aalaa.", arti: "Aku berniat sholat sunnah sesudah Dzuhur dua rakaat karena Allah Ta'ala." },
            { nama: "2 Rakaat Sesudah Maghrib (Mu'akkad)", niat: "Ushallii sunnatal maghribi rak'ataini ba'diyyatan lillaahi ta'aalaa.", arti: "Aku berniat sholat sunnah sesudah Maghrib dua rakaat karena Allah Ta'ala." },
            { nama: "2 Rakaat Sesudah Isya (Mu'akkad)", niat: "Ushallii sunnatal 'isyaa-i rak'ataini ba'diyyatan lillaahi ta'aalaa.", arti: "Aku berniat sholat sunnah sesudah Isya dua rakaat karena Allah Ta'ala." },
            { nama: "PENTING: Tidak Ada Ba'diyah Subuh & Ashar", larangan: true, arti: "Sesuai ajaran Nabi ﷺ, TIDAK ADA sholat sunnah Ba'diyah (sesudah) sholat fardhu Subuh (hingga matahari terbit) dan sesudah sholat fardhu Ashar (hingga matahari terbenam). Keduanya adalah waktu yang terlarang untuk sholat sunnah mutlak/ba'diyah." }
        ]
    }
];

const dzikirUmum = [
    { judul: "Istighfar (3x)", latin: "Astaghfirullaahal 'adzhiim.", arti: "Aku memohon ampun kepada Allah Yang Maha Agung." },
    { judul: "Tahlil dan Pujian", latin: "Laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai-in qadiir. Allaahumma laa maani'a limaa a'thaita, wa laa mu'thiya limaa mana'ta, wa laa yanfa'u dzal jaddi minkal jaddu.", arti: "Tiada tuhan selain Allah semata, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan pujian. Dia Maha Kuasa. Ya Allah, tiada yang dapat mencegah apa yang Engkau beri, dan tiada yang dapat memberi apa yang Engkau cegah." },
    { judul: "Ayat Kursi", latin: "Allaahu laa ilaaha illaa huwal hayyul qayyuum, laa ta'khudzuhuu sinatuw wa laa nauum...", arti: "Allah, tiada tuhan selain Dia. Yang Maha Hidup, Yang terus menerus mengurus makhluk-Nya..." },
    { judul: "Tasbih, Tahmid, Takbir", latin: "Subhaanallaah (33x), Alhamdulillaah (33x), Allaahu Akbar (33x).", arti: "Maha Suci Allah (33x), Segala puji bagi Allah (33x), Allah Maha Besar (33x)." },
    { judul: "Penyempurna 100", latin: "Laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai-in qadiir.", arti: "Tiada tuhan yang berhak disembah selain Allah semata, tiada sekutu bagi-Nya." }
];

const dzikirKhusus = [
    { judul: "Khusus Subuh & Maghrib (Dibaca 10x sebelum mengubah posisi kaki)", latin: "Laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu yuhyii wa yumiitu wa huwa 'alaa kulli syai-in qadiir.", arti: "Tiada tuhan selain Allah semata, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan pujian, Dia menghidupkan dan mematikan. Dia Maha Kuasa atas segala sesuatu." },
    { judul: "Memohon Perlindungan dari Neraka (Dibaca 7x)", latin: "Allaahumma ajirnii minan naar.", arti: "Ya Allah, lindungilah aku dari api neraka." },
    { judul: "Khusus Setelah Subuh (Doa Rezeki & Ilmu)", latin: "Allaahumma innii as-aluka 'ilman naafi'an, wa rizqan thayyiban, wa 'amalan mutaqabbalan.", arti: "Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amalan yang diterima." }
];

// Surat Juz Amma (Seleksi Utama 93-114)
const dataJuzAmma = [
    {
        surat: "Ad-Duhaa", artiNama: "Waktu Dhuha", jumlahAyat: 11, nomor: 93,
        bacaan: "Wadh dhuhaa. Wal laili idzaa sajaa. Maa wadda'aka rabbuka wa maa qalaa. Wa lal aakhiratu khairul laka minal uulaa. Wa lasaufa yu'thiika rabbuka fatardhaa. Alam yajidka yatiiman fa aawaa. Wa wajadaka dhaallan fahadaa. Wa wajadaka 'aa-ilan fa aghnaa. Fa ammal yatiima falaa taqhar. Wa ammas saa-ila falaa tanhar. Wa ammaa bini'mati rabbika fahaddits.",
        arti: "Demi waktu dhuha. Dan demi malam apabila telah sunyi. Tuhanmu tidak meninggalkanmu dan tidak (pula) membencimu. Dan sungguh, yang kemudian itu lebih baik bagimu daripada yang permulaan. Dan sungguh, kelak Tuhanmu pasti memberikan karunia-Nya kepadamu, sehingga engkau menjadi puas..."
    },
    {
        surat: "Al-Insyirah", artiNama: "Kelapangan", jumlahAyat: 8, nomor: 94,
        bacaan: "Alam nasyrah laka shadrak. Wa wadha'naa 'anka wizrak. Alladzii anqadha zhahrak. Wa rafa'naa laka dzikrak. Fa inna ma'al 'usri yusraa. Inna ma'al 'usri yusraa. Fa idzaa faraghta fanshab. Wa ilaa rabbika farghab.",
        arti: "Bukankah Kami telah melapangkan dadamu (Muhammad)? Dan Kami pun telah menurunkan beban darimu, yang memberatkan punggungmu, dan Kami tinggikan sebutan (nama)mu. Maka sesungguhnya beserta kesulitan ada kemudahan..."
    },
    {
        surat: "At-Tin", artiNama: "Buah Tin", jumlahAyat: 8, nomor: 95,
        bacaan: "Wat tiini waz zaituun. Wa thuuri siiniin. Wa haadzal baladil amiin. Laqad khalaqnal insaana fii ahsani taqwiim. Tsumma radadnaahu asfala saafiliin. Illal ladziina aamanuu wa 'amilush shaalihaati falahum ajrun ghairu mamnuun. Famaa yukadz-dzibuka ba'du bid diin. Alaisallaahu bi-ahkamil haakimiin.",
        arti: "Demi (buah) Tin dan (buah) Zaitun, demi gunung Sinai, dan demi negeri (Mekah) yang aman ini. Sungguh, Kami telah menciptakan manusia dalam bentuk yang sebaik-baiknya, kemudian Kami kembalikan dia ke tempat yang serendah-rendahnya..."
    },
    {
        surat: "Al-'Alaq", artiNama: "Segumpal Darah", jumlahAyat: 19, nomor: 96,
        bacaan: "Iqra' bismi rabbikal ladzii khalaq. Khalaqal insaana min 'alaq. Iqra' wa rabbukal akram. Alladzii 'allama bil qalam. 'Allamal insaana maa lam ya'lam... (hingga 19 ayat)",
        arti: "Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan, Dia telah menciptakan manusia dari segumpal darah. Bacalah, dan Tuhanmulah Yang Mahamulia, Yang mengajar (manusia) dengan pena. Dia mengajarkan manusia apa yang tidak diketahuinya..."
    },
    {
        surat: "Al-Qadr", artiNama: "Kemuliaan", jumlahAyat: 5, nomor: 97,
        bacaan: "Innaa anzalnaahu fii lailatil qadr. Wa maa adraaka maa lailatul qadr. Lailatul qadri khairum min alfi syahr. Tanazzalul malaa-ikatu war ruuhu fiihaa bi-idzni rabbihim min kulli amr. Salaamun hiya hattaa mathla'il fajr.",
        arti: "Sesungguhnya Kami telah menurunkannya (Al-Qur'an) pada malam qadar. Dan tahukah kamu apakah malam kemuliaan itu? Malam kemuliaan itu lebih baik daripada seribu bulan. Pada malam itu turun para malaikat dan Ruh (Jibril) dengan izin Tuhannya..."
    },
    {
        surat: "Al-Bayyinah", artiNama: "Pembuktian", jumlahAyat: 8, nomor: 98,
        bacaan: "Lam yakunil ladziina kafaruu min ahlil kitaabi wal musyrikiina munfakkiina hattaa ta'tiyahumul bayyinah. Rasuulum minallaahi yatluu shuhufam muthahharah... (hingga 8 ayat)",
        arti: "Orang-orang yang kafir dari golongan Ahli Kitab dan orang-orang musyrik tidak akan meninggalkan (agama mereka) sampai datang kepada mereka bukti yang nyata, (yaitu) seorang Rasul dari Allah (Muhammad) yang membacakan lembaran-lembaran yang disucikan (Al-Qur'an)..."
    },
    {
        surat: "Az-Zalzalah", artiNama: "Kegoncangan", jumlahAyat: 8, nomor: 99,
        bacaan: "Idzaa zulzilatil ardhu zilzaalahaa. Wa akhrajatil ardhu atsqaalahaa. Wa qaalal insaanu maa lahaa. Yauma-idzin tuhadditsu akhbaarahaa. Bi-anna rabbaka auhaa lahaa. Yauma-idziy yashdurun naasu asytaatal liyurau a'maalahum. Famay ya'mal mitsqaala dzarratin khairay yarah. Wamay ya'mal mitsqaala dzarratin syarray yarah.",
        arti: "Apabila bumi digoncangkan dengan goncangan yang dahsyat, dan bumi telah mengeluarkan beban-beban berat (yang dikandung)nya, dan manusia bertanya, 'Apa yang terjadi pada bumi ini?' Pada hari itu bumi menyampaikan beritanya..."
    },
    {
        surat: "Al-'Adiyat", artiNama: "Kuda Perang", jumlahAyat: 11, nomor: 100,
        bacaan: "Wal 'aadiyaati dhab-haa. Fal muuriyaati qad-haa. Fal mughiiraati shub-haa. Fa atsarna bihii naq-'aa. Fawashatna bihii jam-'aa. Innal insaana lirabbihii lakanuud. Wa innahuu 'alaa dzaalika lasyahiid. Wa innahuu lihubbil khairi lasyadiid. Afalaa ya'lamu idzaa bu'tsira maa fil qubuur. Wa hushshila maa fish shuduur. Inna rabbahum bihim yauma-idzil lakhabiir.",
        arti: "Demi kuda perang yang berlari kencang terengah-engah, dan kuda yang memercikkan bunga api (dengan pukulan kuku kakinya), dan kuda yang menyerang dengan tiba-tiba pada waktu pagi, sehingga menerbangkan debu..."
    },
    {
        surat: "Al-Qari'ah", artiNama: "Hari Kiamat", jumlahAyat: 11, nomor: 101,
        bacaan: "Al qoo-ri'ah. Mal qoo-ri'ah. Wa maa adraaka mal qoo-ri'ah. Yauma yakuunun naasu kal faraasyil mabtsuuts. Wa takuunul jibaalu kal 'ihnil manfuus. Fa ammaa man tsaqulat mawaaziinuh. Fahuwa fii 'iiysatir raadhiyah. Wa ammaa man khaffat mawaaziinuh. Fa ummuhuu haawiyah. Wa maa adraaka maa hiyah. Naarun haamiyah.",
        arti: "Hari Kiamat, apakah hari Kiamat itu? Dan tahukah kamu apakah hari Kiamat itu? Pada hari itu manusia seperti laron yang beterbangan, dan gunung-gunung seperti bulu yang dihambur-hamburkan..."
    },
    {
        surat: "At-Takatsur", artiNama: "Bermegah-megahan", jumlahAyat: 8, nomor: 102,
        bacaan: "Alhaakumut takaatsur. Hattaa zurtumul maqaabir. Kallaa saufa ta'lamuun. Tsumma kallaa saufa ta'lamuun. Kallaa lau ta'lamuuna 'ilmal yaqiin. Latarawunnal jahiim. Tsumma latarawunnahaa 'ainal yaqiin. Tsumma latus-alunna yauma-idzin 'anin na'iim.",
        arti: "Bermegah-megahan telah melalaikan kamu, sampai kamu masuk ke dalam kubur. Sekali-kali tidak! Kelak kamu akan mengetahui (akibat perbuatanmu itu)..."
    },
    {
        surat: "Al-'Ashr", artiNama: "Masa / Waktu", jumlahAyat: 3, nomor: 103,
        bacaan: "Wal 'ashr. Innal insaana lafii khusr. Illal ladziina aamanuu wa 'amilush shaalihaati wa tawaashau bil haqqi wa tawaashau bish shabr.",
        arti: "Demi masa. Sungguh, manusia berada dalam kerugian, kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran."
    },
    {
        surat: "Al-Humazah", artiNama: "Pengumpat", jumlahAyat: 9, nomor: 104,
        bacaan: "Wailul likulli humazatil lumazah. Alladzii jama'a maalaw wa 'addadah. Yahsabu anna maalahuu akhladah. Kallaa layumbadzanna fil huthamah. Wa maa adraaka mal huthamah. Naarullaahil muu-qadah. Allatii taththali'u 'alal af-idah. Innahaa 'alaihim mu'shadah. Fii 'amadim mumaddadah.",
        arti: "Celakalah bagi setiap pengumpat dan pencela, yang mengumpulkan harta dan menghitung-hitungnya, dia (manusia) mengira bahwa hartanya itu dapat mengekalkannya..."
    },
    {
        surat: "Al-Fil", artiNama: "Gajah", jumlahAyat: 5, nomor: 105,
        bacaan: "Alam tara kaifa fa'ala rabbuka bi ash-haabil fiil. Alam yaj'al kaidahum fii tadhliil. Wa arsala 'alaihim thairan abaabiil. Tarmiihim bihijaaratim min sijjjiil. Faja'alahum ka'ashfim ma'kuul.",
        arti: "Tidakkah engkau (Muhammad) perhatikan bagaimana Tuhanmu telah bertindak terhadap pasukan bergajah? Bukankah Dia telah menjadikan tipu daya mereka itu sia-sia?..."
    },
    {
        surat: "Quraisy", artiNama: "Suku Quraisy", jumlahAyat: 4, nomor: 106,
        bacaan: "Li-iilaafi quraiisy. Iilaafihim rihlatasy-syitaa-i wash-shaaiif. Falya'buduu rabba haadzal baiit. Alladzii ath'amahum min juu'iw wa aamanahum min khauuf.",
        arti: "Karena kebiasaan orang-orang Quraisy, (yaitu) kebiasaan mereka bepergian pada musim dingin dan musim panas. Maka hendaklah mereka menyembah Tuhan (pemilik) rumah ini (Ka'bah)..."
    },
    {
        surat: "Al-Ma'un", artiNama: "Barang yang Berguna", jumlahAyat: 7, nomor: 107,
        bacaan: "Ara-aital ladzii yukadz-dzibu biddiin. Fadzaalikal ladzii yadu'ul yatiim. Wa laa yahudh-dhu 'alaa tha'aamil miskiin. Fawailul lil mushalliin. Alladziina hum 'an shalaatihim saahuun. Alladziina hum yuraa-uun. Wa yamna'uunal maa'uun.",
        arti: "Tahukah kamu (orang) yang mendustakan agama? Maka itulah orang yang menghardik anak yatim, dan tidak mendorong memberi makan orang miskin. Maka celakalah orang yang sholat..."
    },
    {
        surat: "Al-Kautsar", artiNama: "Nikmat yang Banyak", jumlahAyat: 3, nomor: 108,
        bacaan: "Innaa a'thainaakal kautsar. Fashalli lirabbika wanhar. Inna syaani-aka huwal abtar.",
        arti: "Sungguh, Kami telah memberimu (Muhammad) nikmat yang banyak. Maka laksanakanlah sholat karena Tuhanmu, dan berkurbanlah..."
    },
    {
        surat: "Al-Kafirun", artiNama: "Orang-orang Kafir", jumlahAyat: 6, nomor: 109,
        bacaan: "Qul yaa ayyuhal kaafiruun. Laa a'budu maa ta'buduun. Wa laa antum 'aabiduuna maa a'bud. Wa laa anaa 'aabidum maa 'abattum. Wa laa antum 'aabiduuna maa a'bud. Lakum diinukum waliya diin.",
        arti: "Katakanlah (Muhammad), 'Wahai orang-orang kafir! Aku tidak akan menyembah apa yang kamu sembah. Dan kamu bukan penyembah apa yang aku sembah...'"
    },
    {
        surat: "An-Nasr", artiNama: "Pertolongan", jumlahAyat: 3, nomor: 110,
        bacaan: "Idzaa jaa-a nashrullaahi wal fath. Wa ra-aitan naasa yadkhuluuna fii diinillaahi afwaajaa. Fasabbih bihamdi rabbika wastaghfirh, innahuu kaana tawwaabaa.",
        arti: "Apabila telah datang pertolongan Allah dan kemenangan, dan engkau melihat manusia berbondong-bondong masuk agama Allah..."
    },
    {
        surat: "Al-Lahab", artiNama: "Gejolak Api", jumlahAyat: 5, nomor: 111,
        bacaan: "Tabbat yadaa abii lahabiw wa tabb. Maa aghnaa 'anhu maaluhuu wa maa kasab. Sayashlaa naaran dzaata lahab. Wamra-atuhuu hammaalatal hathab. Fii jiidihaa hablum mim masad.",
        arti: "Binasalah kedua tangan Abu Lahab dan benar-benar binasa dia! Tidaklah berguna baginya hartanya dan apa yang dia usahakan..."
    },
    {
        surat: "Al-Ikhlas", artiNama: "Keesaan Allah", jumlahAyat: 4, nomor: 112,
        bacaan: "Qul huwallaahu ahad. Allaahush shamad. Lam yalid wa lam yuulad. Wa lam yakul lahuu kufuwan ahad.",
        arti: "Katakanlah (Muhammad), 'Dialah Allah, Yang Maha Esa. Allah tempat meminta segala sesuatu. (Allah) tidak beranak dan tidak pula diperanakkan...'"
    },
    {
        surat: "Al-Falaq", artiNama: "Waktu Subuh", jumlahAyat: 5, nomor: 113,
        bacaan: "Qul a'uudzu birabbil falaq. Min syarri maa khalaq. Wa min syarri ghaasiqin idzaa waqab. Wa min syarrin naffaatsaati fil 'uqad. Wa min syarri haasidin idzaa hasad.",
        arti: "Katakanlah, 'Aku berlindung kepada Tuhan yang menguasai subuh (fajar), dari kejahatan (makhluk yang) Dia ciptakan...'"
    },
    {
        surat: "An-Nas", artiNama: "Manusia", jumlahAyat: 6, nomor: 114,
        bacaan: "Qul a'uudzu birabbin naas. Malikin naas. Ilaahin naas. Min syarril waswaasil khannnaas. Alladzii yuwaswisu fii shuduurin naas. Minal jinnati wan naas.",
        arti: "Katakanlah, 'Aku berlindung kepada Tuhannya manusia, Raja manusia, sembahan manusia, dari kejahatan (bisikan) setan yang bersembunyi...'"
    }
];

// --- KOMPONEN UTAMA ---

export default function App() {
    const [activeTab, setActiveTab] = useState('beranda');

    const renderContent = () => {
        switch (activeTab) {
            case 'wudhu': return <WudhuSection />;
            case 'sholat': return <SholatSectionWrapper />;
            case 'puasa': return <PuasaSection />;
            case 'hafalan': return <HafalanSection />;
            default: return <BerandaSection setTab={setActiveTab} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 md:pb-0">
            <nav className="hidden md:block sticky top-0 z-50 bg-white shadow-sm border-b border-emerald-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('beranda')}>
                            <BookOpen className="h-8 w-8 text-emerald-600" />
                            <span className="font-bold text-xl text-emerald-900">Sunnah<span className="text-emerald-500">Guide</span></span>
                        </div>
                        <div className="flex space-x-4">
                            <DesktopNavButton icon={<Home size={18} />} label="Beranda" active={activeTab === 'beranda'} onClick={() => setActiveTab('beranda')} />
                            <DesktopNavButton icon={<Droplets size={18} />} label="Wudhu" active={activeTab === 'wudhu'} onClick={() => setActiveTab('wudhu')} />
                            <DesktopNavButton icon={<Moon size={18} />} label="Sholat" active={activeTab === 'sholat'} onClick={() => setActiveTab('sholat')} />
                            <DesktopNavButton icon={<Heart size={18} />} label="Puasa" active={activeTab === 'puasa'} onClick={() => setActiveTab('puasa')} />
                            <DesktopNavButton icon={<Book size={18} />} label="Hafalan" active={activeTab === 'hafalan'} onClick={() => setActiveTab('hafalan')} />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-6 animate-in fade-in duration-500">
                {renderContent()}
            </main>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 px-2 z-50 safe-area-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <MobileNavButton icon={<Home size={22} />} label="Beranda" active={activeTab === 'beranda'} onClick={() => setActiveTab('beranda')} />
                <MobileNavButton icon={<Droplets size={22} />} label="Wudhu" active={activeTab === 'wudhu'} onClick={() => setActiveTab('wudhu')} />
                <MobileNavButton icon={<Moon size={22} />} label="Sholat" active={activeTab === 'sholat'} onClick={() => setActiveTab('sholat')} />
                <MobileNavButton icon={<Heart size={22} />} label="Puasa" active={activeTab === 'puasa'} onClick={() => setActiveTab('puasa')} />
                <MobileNavButton icon={<Book size={22} />} label="Hafalan" active={activeTab === 'hafalan'} onClick={() => setActiveTab('hafalan')} />
            </nav>
        </div>
    );
}

// --- KOMPONEN NAVIGASI ---

function DesktopNavButton({ icon, label, active, onClick }) {
    return (
        <button onClick={onClick} className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${active ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500 hover:bg-slate-100 hover:text-emerald-600'}`}>
            {icon} <span>{label}</span>
        </button>
    );
}

function MobileNavButton({ icon, label, active, onClick }) {
    return (
        <button onClick={onClick} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${active ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <div className={`${active ? 'bg-emerald-100' : 'bg-transparent'} p-1.5 rounded-xl transition-all`}>
                {icon}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    );
}

// --- KOMPONEN ACCORDION GENERIC ---
function AccordionCard({ title, subtitle, icon, defaultOpen = false, children, extraBadge }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left p-5 flex justify-between items-center transition-colors ${isOpen ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}
            >
                <div className="flex items-center gap-3">
                    {icon && <div className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">{icon}</div>}
                    <div>
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            {title}
                            {extraBadge}
                        </h4>
                        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
                    </div>
                </div>
                <div className="shrink-0 ml-4 text-slate-400">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </button>

            {isOpen && (
                <div className="p-5 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
}

// --- HALAMAN BERANDA ---
function BerandaSection({ setTab }) {
    return (
        <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-600 text-white shadow-lg p-6 md:p-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <BookOpen size={24} className="text-amber-300" />
                        <span className="font-bold tracking-wider text-sm text-emerald-100 uppercase">SunnahGuide</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-extrabold leading-tight mb-3">
                        Sempurnakan Ibadahmu,<br />Sesuai Tuntunan Nabi ﷺ
                    </h1>
                    <p className="text-emerald-50 text-sm md:text-base opacity-90 leading-relaxed max-w-lg">
                        Panduan praktis wudhu, sholat, dan ibadah harian berlandaskan Al-Qur'an dan hadits shahih. Mudah dipahami untuk setiap muslim.
                    </p>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Menu Utama</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <MenuCard icon={<Droplets size={28} className="text-blue-500" />} title="Wudhu & Bersuci" bg="bg-blue-50" onClick={() => setTab('wudhu')} />
                    <MenuCard icon={<Moon size={28} className="text-emerald-500" />} title="Panduan Sholat" bg="bg-emerald-50" onClick={() => setTab('sholat')} />
                    <MenuCard icon={<Heart size={28} className="text-amber-500" />} title="Puasa Ramadhan" bg="bg-amber-50" onClick={() => setTab('puasa')} />
                    <MenuCard icon={<Book size={28} className="text-indigo-500" />} title="Juz Amma" bg="bg-indigo-50" onClick={() => setTab('hafalan')} />
                </div>
            </div>
        </div>
    );
}

function MenuCard({ icon, title, bg, onClick }) {
    return (
        <button onClick={onClick} className={`${bg} border border-white/50 shadow-sm hover:shadow-md transition-all rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 aspect-square active:scale-95`}>
            <div className="bg-white p-3 rounded-full shadow-sm">
                {icon}
            </div>
            <span className="font-semibold text-slate-800 text-sm">{title}</span>
        </button>
    );
}

// --- SHOLAT SECTION (DENGAN MODE: HARIAN, RAMADHAN, HARI RAYA) ---

function SholatSectionWrapper() {
    const [appMode, setAppMode] = useState('harian');

    return (
        <div className="space-y-6">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-900">Panduan Sholat</h2>
                <p className="text-slate-500 text-sm mt-1">Pilih mode ibadah sesuai waktu pelaksanaannya.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-200/50 p-1.5 rounded-2xl">
                <ModeButton icon={<Clock size={16} />} label="Harian" active={appMode === 'harian'} onClick={() => setAppMode('harian')} />
                <ModeButton icon={<Star size={16} />} label="Ramadhan" active={appMode === 'ramadhan'} onClick={() => setAppMode('ramadhan')} />
                <ModeButton icon={<Calendar size={16} />} label="Hari Raya" active={appMode === 'hariraya'} onClick={() => setAppMode('hariraya')} />
                <ModeButton icon={<Users size={16} />} label="Jenazah" active={appMode === 'jenazah'} onClick={() => setAppMode('jenazah')} />
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-1 md:p-6 min-h-[50vh]">
                {appMode === 'harian' && <ModeHarian />}
                {appMode === 'ramadhan' && <ModeRamadhan />}
                {appMode === 'hariraya' && <ModeHariRaya />}
                {appMode === 'jenazah' && <ModeJenazah />}
            </div>
        </div>
    );
}

function ModeButton({ icon, label, active, onClick }) {
    return (
        <button onClick={onClick} className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-3 px-2 rounded-xl text-xs md:text-sm font-bold transition-all ${active ? 'bg-white text-emerald-700 shadow border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}>
            {icon} <span>{label}</span>
        </button>
    );
}

function TabButton({ label, active, onClick }) {
    return (
        <button onClick={onClick} className={`flex-1 min-w-max py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${active ? 'bg-emerald-100 text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {label}
        </button>
    );
}

function ModeHarian() {
    const [subTab, setSubTab] = useState('wajib');

    return (
        <div className="space-y-4 p-2 md:p-0">
            <div className="bg-slate-100/70 p-1 rounded-xl flex gap-1 overflow-x-auto no-scrollbar">
                <TabButton label="Sholat Wajib" active={subTab === 'wajib'} onClick={() => setSubTab('wajib')} />
                <TabButton label="Sunnah Rawatib" active={subTab === 'sunnah'} onClick={() => setSubTab('sunnah')} />
                <TabButton label="Dzikir Setelah" active={subTab === 'dzikir'} onClick={() => setSubTab('dzikir')} />
            </div>
            <div className="pt-2">
                {subTab === 'wajib' && <SholatWajibView />}
                {subTab === 'sunnah' && <SholatSunnahView />}
                {subTab === 'dzikir' && <DzikirView />}
            </div>
        </div>
    );
}

function SholatWajibView() {
    const [selectedWaktu, setSelectedWaktu] = useState(dataSholatWajib[0]);

    return (
        <div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2 md:mx-0 md:px-0">
                {dataSholatWajib.map((waktu) => (
                    <button
                        key={waktu.id}
                        onClick={() => setSelectedWaktu(waktu)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold border transition-all ${selectedWaktu.id === waktu.id ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {waktu.nama}
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-slate-100 p-3 rounded-xl">{selectedWaktu.icon}</div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Sholat {selectedWaktu.nama} ({selectedWaktu.rakaat} Rakaat)</h3>
                        <p className="text-slate-500 text-sm">{selectedWaktu.waktu}</p>
                    </div>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 mb-6">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3 block">Niat (Lafadz)</span>
                    <div className="bg-white/60 p-3 rounded-lg border-l-4 border-emerald-500 mb-2 flex justify-between items-start gap-2">
                        <p className="font-semibold text-emerald-900 text-lg leading-relaxed">
                            "{selectedWaktu.niat}"
                        </p>
                        <AudioButton text={selectedWaktu.niat} className="shrink-0 bg-white" />
                    </div>
                    <p className="text-slate-600 text-sm italic">Artinya: "{selectedWaktu.artiNiat}"</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-200 mb-6">
                    <span className="font-bold">Catatan Penting:</span> Semua bacaan di bawah ini adalah tuntunan sahih. Tuma'ninah (tenang sejenak di setiap gerakan) adalah rukun sholat.
                </div>

                <div className="space-y-4">
                    {bacaanSholatLengkap.map((item, idx) => (
                        <AccordionCard
                            key={idx}
                            title={item.gerakan}
                            icon={idx + 1}
                            defaultOpen={idx === 0}
                            extraBadge={
                                item.instruksi ? (
                                    <span className="text-[10px] md:text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full ml-2">
                                        {item.instruksi}
                                    </span>
                                ) : null
                            }
                        >
                            <div className="bg-slate-50 p-3 rounded-lg mb-2 flex justify-between items-start gap-2">
                                <p className="font-semibold text-emerald-900 text-lg leading-relaxed">
                                    "{item.latin}"
                                </p>
                                <AudioButton text={item.latin} className="shrink-0 bg-white" />
                            </div>
                            <p className="text-sm text-slate-600 italic">Artinya: "{item.arti}"</p>
                        </AccordionCard>
                    ))}
                </div>
            </div>
        </div>
    );
}

function SholatSunnahView() {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800 font-medium">
                    Sholat Rawatib terbagi menjadi Mu'akkad (sangat dianjurkan) dan Ghairu Mu'akkad. Terdapat juga sholat sunnah waktu seperti Dhuha.
                </p>
            </div>

            {dataSholatSunnah.map((grup, idx) => (
                <div key={idx} className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-2">{grup.kategori}</h3>
                    <div className="grid gap-4">
                        {grup.daftar.map((item, itemIdx) => (
                            item.larangan ? (
                                <div key={itemIdx} className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
                                    <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                                        <CheckCircle2 size={18} className="text-red-500" /> {item.nama}
                                    </h4>
                                    <p className="text-sm text-red-800 leading-relaxed font-medium">{item.arti}</p>
                                </div>
                            ) : (
                                <AccordionCard
                                    key={itemIdx}
                                    title={item.nama}
                                    subtitle={item.keutamaan ? `Keutamaan: ${item.keutamaan}` : 'Niat sholat sunnah'}
                                    defaultOpen={false}
                                >
                                    <div className="bg-slate-50 p-3 rounded-lg mb-2 flex justify-between items-start gap-2">
                                        <p className="font-semibold text-slate-800 leading-relaxed">"{item.niat}"</p>
                                        <AudioButton text={item.niat} className="shrink-0 bg-white" />
                                    </div>
                                    <p className="text-sm text-slate-500 italic mb-2">Artinya: "{item.arti}"</p>

                                    {item.doaSetelah && (
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <h5 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                                                <BookOpen size={16} /> Doa Setelah Sholat
                                            </h5>
                                            <div className="bg-emerald-50 p-3 rounded-lg mb-2 flex justify-between items-start gap-2">
                                                <p className="font-semibold text-emerald-900 leading-relaxed">"{item.doaSetelah.latin}"</p>
                                                <AudioButton text={item.doaSetelah.latin} className="shrink-0 bg-white border border-emerald-100" />
                                            </div>
                                            <p className="text-sm text-slate-600 italic">Artinya: "{item.doaSetelah.arti}"</p>
                                        </div>
                                    )}
                                </AccordionCard>
                            )
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function DzikirView() {
    const [tipe, setTipe] = useState('umum'); // umum, subuhmaghrib

    return (
        <div className="animate-in fade-in space-y-4">
            <div className="flex bg-slate-100 p-1 rounded-lg w-full max-w-sm">
                <button onClick={() => setTipe('umum')} className={`flex-1 text-sm py-2 font-bold rounded-md transition-colors ${tipe === 'umum' ? 'bg-white text-emerald-700 shadow' : 'text-slate-500'}`}>Dzuhur, Ashar, Isya</button>
                <button onClick={() => setTipe('subuhmaghrib')} className={`flex-1 text-sm py-2 font-bold rounded-md transition-colors ${tipe === 'subuhmaghrib' ? 'bg-white text-emerald-700 shadow' : 'text-slate-500'}`}>Subuh & Maghrib</button>
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <p className="text-sm text-emerald-800 font-medium">
                    Dzikir dibaca perlahan setelah salam. Ketuk untuk membuka teks dzikir.
                </p>
            </div>

            <div className="space-y-4">
                {dzikirUmum.map((dzikir, idx) => (
                    <AccordionCard key={idx} title={dzikir.judul} icon={idx + 1} defaultOpen={idx === 0}>
                        <div className="mb-3 p-3 rounded-lg flex justify-between items-start gap-2 bg-emerald-50">
                            <p className="font-medium text-lg leading-relaxed text-emerald-900">{dzikir.latin}</p>
                            <AudioButton text={dzikir.latin} className="shrink-0 bg-white" />
                        </div>
                        <p className="text-sm text-slate-600 italic border-l-2 border-slate-300 pl-3">Artinya: "{dzikir.arti}"</p>
                    </AccordionCard>
                ))}

                {tipe === 'subuhmaghrib' && (
                    <div className="mt-6 border-t-2 border-dashed border-emerald-200 pt-6 space-y-4">
                        <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                            <Star className="text-amber-500" size={20} /> Tambahan Subuh & Maghrib
                        </h3>
                        {dzikirKhusus.map((dzikir, idx) => (
                            <AccordionCard key={'khusus' + idx} title={dzikir.judul} icon="+" defaultOpen={true}>
                                <div className="mb-3 p-3 rounded-lg flex justify-between items-start gap-2 bg-amber-50 border border-amber-100">
                                    <p className="font-medium text-lg leading-relaxed text-amber-900">{dzikir.latin}</p>
                                    <AudioButton text={dzikir.latin} className="shrink-0 bg-white border border-amber-200" />
                                </div>
                                <p className="text-sm text-slate-600 italic border-l-2 border-amber-300 pl-3">Artinya: "{dzikir.arti}"</p>
                            </AccordionCard>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ModeRamadhan() {
    const [subTab, setSubTab] = useState('tarawih');

    return (
        <div className="space-y-4 p-2 md:p-0">
            <div className="bg-slate-100/70 p-1 rounded-xl flex gap-1 overflow-x-auto no-scrollbar">
                <TabButton label="Sholat Tarawih" active={subTab === 'tarawih'} onClick={() => setSubTab('tarawih')} />
                <TabButton label="Sholat Witir" active={subTab === 'witir'} onClick={() => setSubTab('witir')} />
            </div>
            <div className="pt-2">
                {subTab === 'tarawih' && <TarawihView />}
                {subTab === 'witir' && <WitirView />}
            </div>
        </div>
    );
}

function TarawihView() {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200">
                <h3 className="font-bold text-amber-800 mb-2">Panduan Sholat Tarawih</h3>
                <p className="text-sm text-amber-900 leading-relaxed mb-4">
                    Sholat Tarawih sunnah dikerjakan setelah sholat Isya di bulan Ramadhan. Nabi ﷺ mengerjakannya 11 rakaat (8 Tarawih + 3 Witir), namun boleh juga dikerjakan 23 rakaat. Dilakukan dengan cara <strong>2 rakaat salam, 2 rakaat salam</strong>.
                </p>

                <AccordionCard title="Niat Sholat Tarawih (2 Rakaat)" defaultOpen={true}>
                    <div className="flex justify-between items-start gap-2 bg-white p-3 rounded-lg">
                        <p className="font-semibold text-emerald-700 mb-1">
                            "Ushallii sunnatat taraawiihi rak'ataini (imaman / makmuuman / lillaahi ta'aalaa)."
                        </p>
                        <AudioButton text="Ushallii sunnatat taraawiihi rak'ataini lillaahi ta'aalaa." className="shrink-0 -mt-1" />
                    </div>
                    <p className="text-xs text-slate-500 italic mt-2">
                        Pilih "imaman" jika jadi imam, "makmuuman" jika jadi makmum, atau langsung "lillaahi ta'aalaa" jika sholat sendiri.
                    </p>
                </AccordionCard>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
                    <span className="font-bold text-blue-800 block mb-2">Dzikir Jeda Antara Tarawih</span>
                    <p className="text-sm text-blue-900 leading-relaxed">
                        Menurut sunnah yang sahih dari Nabi ﷺ, tidak ada bacaan atau dzikir khusus yang diwajibkan di sela-sela rakaat Tarawih. Waktu jeda ini aslinya digunakan untuk istirahat ("Tarwiha" = istirahat). Namun dibolehkan memperbanyak istighfar atau doa secara mandiri.
                    </p>
                </div>
            </div>
        </div>
    );
}

function WitirView() {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-200">
                <h3 className="font-bold text-indigo-800 mb-2">Panduan Sholat Witir</h3>
                <p className="text-sm text-indigo-900 leading-relaxed mb-4">
                    Witir adalah sholat penutup malam yang rakaatnya ganjil. Disunnahkan dikerjakan dengan <strong>2 rakaat salam, lalu ditambah 1 rakaat salam</strong>.
                </p>

                <AccordionCard title="Niat Sholat Witir" defaultOpen={true}>
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl border border-indigo-100">
                            <span className="font-bold text-slate-700 block mb-2 text-sm">Niat 2 Rakaat Witir</span>
                            <div className="flex justify-between items-start gap-2">
                                <p className="font-semibold text-emerald-700 mb-1 text-sm">"Ushallii sunnatal witri rak'ataini..."</p>
                                <AudioButton text="Ushallii sunnatal witri rak'ataini" className="shrink-0 -mt-2 bg-white" />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-indigo-100">
                            <span className="font-bold text-slate-700 block mb-2 text-sm">Niat 1 Rakaat Witir (Penutup)</span>
                            <div className="flex justify-between items-start gap-2">
                                <p className="font-semibold text-emerald-700 mb-1 text-sm">"Ushallii sunnatal witri rak'atan..."</p>
                                <AudioButton text="Ushallii sunnatal witri rak'atan" className="shrink-0 -mt-2 bg-white" />
                            </div>
                        </div>
                    </div>
                </AccordionCard>

                <div className="mt-4">
                    <AccordionCard title="Bacaan Sahih Setelah Witir (1 Rakaat Terakhir)">
                        <p className="text-sm text-slate-600 mb-3">Nabi ﷺ membaca dzikir ini 3 kali, dan pada bacaan ketiga, beliau memanjangkan dan mengeraskan suaranya:</p>

                        <div className="bg-slate-50 p-3 rounded-lg mb-2">
                            <div className="flex justify-between items-start gap-2">
                                <p className="font-bold text-lg text-slate-800 mb-1">
                                    "Subhaanal malikil qudduus." (Dibaca 3x)
                                </p>
                                <AudioButton text="Subhaanal malikil qudduus." className="shrink-0 -mt-1 bg-white" />
                            </div>
                            <p className="text-sm text-slate-500 italic mb-3">Artinya: "Maha Suci Engkau yang Maha Merajai lagi Maha Suci dari kekurangan."</p>

                            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-start gap-2">
                                <p className="font-bold text-lg text-slate-800 mb-1">
                                    "Rabbil malaa-ikati war-ruuh." (Dibaca 1x setelah yang ke-3)
                                </p>
                                <AudioButton text="Rabbil malaa-ikati war-ruuh." className="shrink-0 -mt-1 bg-white" />
                            </div>
                            <p className="text-sm text-slate-500 italic">Artinya: "Tuhan para malaikat dan Jibril."</p>
                        </div>
                    </AccordionCard>
                </div>
            </div>
        </div>
    );
}

function ModeHariRaya() {
    return (
        <div className="space-y-6 animate-in fade-in p-2 md:p-0">
            <div className="bg-emerald-800 text-white p-6 rounded-3xl text-center shadow-md bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]">
                <MoonStar size={40} className="mx-auto text-amber-300 mb-3" />
                <h3 className="text-xl md:text-2xl font-bold mb-2">Panduan Sholat Idul Fitri & Idul Adha</h3>
                <p className="text-emerald-100 text-sm">Dilaksanakan di lapangan atau masjid pada pagi hari raya. Berjumlah 2 rakaat tanpa adzan dan iqamah.</p>
            </div>

            <AccordionCard title="Niat Sholat Ied" defaultOpen={true}>
                <div className="space-y-4">
                    <div>
                        <span className="font-bold text-sm text-emerald-600">Idul Fitri:</span>
                        <div className="flex justify-between items-start gap-2 bg-slate-50 p-2 rounded mt-1">
                            <p className="font-semibold text-slate-800">"Ushallii sunnata li 'iidil fithri rak'ataini (imaman/makmuuman) lillaahi ta'aalaa."</p>
                            <AudioButton text="Ushallii sunnata li 'iidil fithri rak'ataini lillaahi ta'aalaa." className="shrink-0 -mt-1 bg-white" />
                        </div>
                    </div>
                    <div>
                        <span className="font-bold text-sm text-amber-600">Idul Adha:</span>
                        <div className="flex justify-between items-start gap-2 bg-slate-50 p-2 rounded mt-1">
                            <p className="font-semibold text-slate-800">"Ushallii sunnata li 'iidil adl-haa rak'ataini (imaman/makmuuman) lillaahi ta'aalaa."</p>
                            <AudioButton text="Ushallii sunnata li 'iidil adl-haa rak'ataini lillaahi ta'aalaa." className="shrink-0 -mt-1 bg-white" />
                        </div>
                    </div>
                </div>
            </AccordionCard>

            <AccordionCard title="Tata Cara Khusus Sholat Ied" defaultOpen={true}>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="bg-emerald-100 text-emerald-800 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                        <div className="w-full">
                            <h5 className="font-bold text-slate-800">Rakaat Pertama (7x Takbir)</h5>
                            <p className="text-sm text-slate-600 mt-1">Setelah takbiratul ihram dan doa iftitah, melakukan takbir zawaid (tambahan) sebanyak 7 kali sebelum membaca Al-Fatihah.</p>
                            <div className="mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-start gap-2">
                                <div>
                                    <span className="text-xs font-bold text-slate-400">BACAAN DI ANTARA TAKBIR:</span>
                                    <p className="font-medium text-slate-800 mt-1 text-sm">"Subhaanallaah walhamdulillaah wa laa ilaaha illallaah wallaahu akbar."</p>
                                </div>
                                <AudioButton text="Subhaanallaah walhamdulillaah wa laa ilaaha illallaah wallaahu akbar." className="shrink-0 bg-white" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-emerald-100 text-emerald-800 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                        <div className="w-full">
                            <h5 className="font-bold text-slate-800">Rakaat Kedua (5x Takbir)</h5>
                            <p className="text-sm text-slate-600 mt-1">Setelah bangkit dari sujud (takbir intiqal), melakukan takbir tambahan sebanyak 5 kali sebelum membaca Al-Fatihah. Bacaan di sela takbir sama seperti rakaat pertama.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-emerald-100 text-emerald-800 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                        <div className="w-full">
                            <h5 className="font-bold text-slate-800">Mendengarkan Khutbah</h5>
                            <p className="text-sm text-slate-600 mt-1">Selesai sholat (salam), jamaah sangat dianjurkan untuk duduk tenang mendengarkan khutbah Ied hingga selesai.</p>
                        </div>
                    </div>
                </div>
            </AccordionCard>
        </div>
    );
}

function ModeJenazah() {
    return (
        <div className="space-y-6 animate-in fade-in p-2 md:p-0">
            <div className="bg-slate-800 text-white p-6 rounded-3xl text-center shadow-md bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]">
                <Users size={40} className="mx-auto text-emerald-400 mb-3" />
                <h3 className="text-xl md:text-2xl font-bold mb-2">Panduan Sholat Jenazah</h3>
                <p className="text-slate-300 text-sm">Hukumnya Fardhu Kifayah. Dilakukan dengan 4 kali takbir, tanpa ruku' dan tanpa sujud.</p>
            </div>

            <AccordionCard title="1. Niat Sholat Jenazah" defaultOpen={true}>
                <div className="space-y-4">
                    <div>
                        <span className="font-bold text-sm text-emerald-700">A. Mayit Laki-laki (Sebagai Imam):</span>
                        <div className="flex justify-between items-start gap-2 bg-slate-50 p-3 rounded-lg mt-1">
                            <p className="font-semibold text-slate-800">"Ushallii 'alaa haadzal mayyiti arba'a takbiiraatin fardhal kifaayati imaaman lillaahi ta'aalaa."</p>
                            <AudioButton text="Ushallii 'alaa haadzal mayyiti arba'a takbiiraatin fardhal kifaayati imaaman lillaahi ta'aalaa." className="shrink-0 bg-white border border-slate-200" />
                        </div>
                    </div>

                    <div>
                        <span className="font-bold text-sm text-emerald-700">B. Mayit Laki-laki (Sebagai Makmum):</span>
                        <div className="flex justify-between items-start gap-2 bg-slate-50 p-3 rounded-lg mt-1">
                            <p className="font-semibold text-slate-800">"Ushallii 'alaa haadzal mayyiti arba'a takbiiraatin fardhal kifaayati makmuuman lillaahi ta'aalaa."</p>
                            <AudioButton text="Ushallii 'alaa haadzal mayyiti arba'a takbiiraatin fardhal kifaayati makmuuman lillaahi ta'aalaa." className="shrink-0 bg-white border border-slate-200" />
                        </div>
                    </div>

                    <div>
                        <span className="font-bold text-sm text-indigo-700">C. Mayit Perempuan (Sebagai Imam):</span>
                        <div className="flex justify-between items-start gap-2 bg-slate-50 p-3 rounded-lg mt-1">
                            <p className="font-semibold text-slate-800">"Ushallii 'alaa haadzihil mayyitati arba'a takbiiraatin fardhal kifaayati imaaman lillaahi ta'aalaa."</p>
                            <AudioButton text="Ushallii 'alaa haadzihil mayyitati arba'a takbiiraatin fardhal kifaayati imaaman lillaahi ta'aalaa." className="shrink-0 bg-white border border-slate-200" />
                        </div>
                    </div>

                    <div>
                        <span className="font-bold text-sm text-indigo-700">D. Mayit Perempuan (Sebagai Makmum):</span>
                        <div className="flex justify-between items-start gap-2 bg-slate-50 p-3 rounded-lg mt-1">
                            <p className="font-semibold text-slate-800">"Ushallii 'alaa haadzihil mayyitati arba'a takbiiraatin fardhal kifaayati makmuuman lillaahi ta'aalaa."</p>
                            <AudioButton text="Ushallii 'alaa haadzihil mayyitati arba'a takbiiraatin fardhal kifaayati makmuuman lillaahi ta'aalaa." className="shrink-0 bg-white border border-slate-200" />
                        </div>
                    </div>
                </div>
            </AccordionCard>

            <AccordionCard title="2. Tata Cara & Bacaan 4 Takbir" defaultOpen={true}>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="bg-slate-100 text-slate-800 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                        <div className="w-full">
                            <h5 className="font-bold text-slate-800">Takbir Pertama (Membaca Al-Fatihah)</h5>
                            <p className="text-sm text-slate-600 mt-1 mb-2">Setelah takbiratul ihram, langsung membaca Surah Al-Fatihah (tanpa doa iftitah).</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-slate-100 text-slate-800 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                        <div className="w-full">
                            <h5 className="font-bold text-slate-800">Takbir Kedua (Membaca Sholawat)</h5>
                            <p className="text-sm text-slate-600 mt-1 mb-2">Membaca sholawat nabi. Boleh sholawat pendek atau sholawat Ibrahimiyyah (seperti di tahiyat akhir).</p>
                            <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-start gap-2">
                                <p className="font-medium text-slate-800 text-sm">"Allaahumma shalli 'alaa Sayyidinaa Muhammad wa 'alaa aali Sayyidinaa Muhammad."</p>
                                <AudioButton text="Allaahumma shalli 'alaa Sayyidinaa Muhammad wa 'alaa aali Sayyidinaa Muhammad." className="shrink-0 bg-white border border-slate-200" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-slate-100 text-slate-800 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                        <div className="w-full">
                            <h5 className="font-bold text-slate-800">Takbir Ketiga (Mendoakan Mayit)</h5>
                            <p className="text-sm text-slate-600 mt-1 mb-2">Ganti <strong>"lahu"</strong> menjadi <strong>"laha"</strong> jika mayitnya perempuan.</p>
                            <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-start gap-2">
                                <div>
                                    <p className="font-medium text-slate-800 text-sm">"Allaahummaghfir lahu warhamhu wa 'aafihi wa'fu 'anhu."</p>
                                    <p className="text-xs text-slate-500 italic mt-1">Arti: "Ya Allah, ampunilah dia, rahmatilah dia, bebaskanlah dia, dan maafkanlah dia."</p>
                                </div>
                                <AudioButton text="Allaahummaghfir lahu warhamhu wa 'aafihi wa'fu 'anhu." className="shrink-0 bg-white border border-slate-200" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-slate-100 text-slate-800 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">4</div>
                        <div className="w-full">
                            <h5 className="font-bold text-slate-800">Takbir Keempat (Doa Penutup & Salam)</h5>
                            <p className="text-sm text-slate-600 mt-1 mb-2">Ganti <strong>"ajrahu"</strong> dan <strong>"ba'dahu"</strong> menjadi <strong>"ajrahaa"</strong> dan <strong>"ba'dahaa"</strong> jika perempuan. Setelah ini langsung Salam.</p>
                            <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-start gap-2">
                                <div>
                                    <p className="font-medium text-slate-800 text-sm">"Allaahumma laa tahrimnaa ajrahu wa laa taftinnaa ba'dahu waghfir lanaa wa lahu."</p>
                                    <p className="text-xs text-slate-500 italic mt-1">Arti: "Ya Allah, janganlah Engkau halangi kami untuk mendapatkan pahalanya, dan janganlah Engkau beri fitnah kami sepeninggalnya, dan ampunilah kami dan dia."</p>
                                </div>
                                <AudioButton text="Allaahumma laa tahrimnaa ajrahu wa laa taftinnaa ba'dahu waghfir lanaa wa lahu." className="shrink-0 bg-white border border-slate-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </AccordionCard>
        </div>
    );
}

// --- HALAMAN WUDHU & PUASA ---
function WudhuSection() {
    return (
        <div className="p-4 md:p-0 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 text-center">Panduan Wudhu</h2>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm mb-6 text-center">
                Bacaan Niat (Latin): <br />
                <div className="flex justify-center items-start gap-2 mt-2">
                    <span className="font-bold text-base block">"Nawaitul wudhuu-a liraf'il hadatsil ashghari fardhal lillaahi ta'aalaa."</span>
                    <AudioButton text="Nawaitul wudhuu-a liraf'il hadatsil ashghari fardhal lillaahi ta'aalaa." className="shrink-0 -mt-2 bg-white" />
                </div>
                <span className="italic mt-1 block">Artinya: "Aku berniat wudhu untuk menghilangkan hadats kecil fardhu karena Allah Ta'ala."</span>
            </div>
            <div className="space-y-3">
                {[
                    "Membaca Basmalah ('Bismillah').",
                    "Mencuci kedua telapak tangan 3x.",
                    "Berkumur dan menghirup air ke hidung 3x.",
                    "Membasuh seluruh wajah 3x.",
                    "Membasuh tangan kanan hingga siku 3x, lalu tangan kiri 3x.",
                    "Mengusap kepala hingga telinga 1x.",
                    "Mencuci kaki kanan hingga mata kaki 3x, lalu kaki kiri 3x.",
                    "Tertib (berurutan)."
                ].map((step, idx) => (
                    <div key={idx} className="flex gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={20} />
                        <p className="text-slate-700">{step}</p>
                    </div>
                ))}
            </div>
            <AccordionCard title="Doa Setelah Wudhu" defaultOpen={true}>
                <div className="flex justify-between items-start gap-2 mb-2 bg-emerald-50 p-3 rounded-lg">
                    <p className="font-semibold text-emerald-900 leading-relaxed">
                        "Asyhadu allaa ilaaha illallaah wahdahu laa syariikalah, wa asyhadu anna Muhammadan 'abduhu wa rasuuluh. Allahummaj'alnii minat tawwaabiina waj'alnii minal mutathahhiriin."
                    </p>
                    <AudioButton text="Asyhadu allaa ilaaha illallaah wahdahu laa syariikalah, wa asyhadu anna Muhammadan 'abduhu wa rasuuluh. Allahummaj'alnii minat tawwaabiina waj'alnii minal mutathahhiriin." className="shrink-0 bg-white" />
                </div>
                <p className="text-sm text-slate-600 italic">
                    Artinya: "Aku bersaksi tiada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya. Dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya. Ya Allah, jadikanlah aku termasuk orang yang bertaubat dan orang yang bersuci."
                </p>
            </AccordionCard>
        </div>
    );
}

function PuasaSection() {
    return (
        <div className="p-4 md:p-0 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 text-center">Panduan Puasa</h2>

            <AccordionCard title="Niat Puasa Ramadhan" defaultOpen={true}>
                <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-500 mb-2 flex justify-between items-start gap-2">
                    <p className="font-semibold text-amber-900 text-lg leading-relaxed">
                        "Nawaitu shauma ghadin 'an adaa-i fardhi syahri ramadhaana haadzihis sanati lillaahi ta'aalaa."
                    </p>
                    <AudioButton text="Nawaitu shauma ghadin 'an adaa-i fardhi syahri ramadhaana haadzihis sanati lillaahi ta'aalaa." className="shrink-0 bg-white border-amber-200" />
                </div>
                <p className="text-slate-600 text-sm italic">
                    Artinya: "Aku berniat puasa esok hari untuk menunaikan fardhu di bulan Ramadhan tahun ini karena Allah Ta'ala."
                </p>
            </AccordionCard>

            <AccordionCard title="Hal yang Membatalkan Puasa" defaultOpen={true}>
                <ul className="space-y-3">
                    <li className="flex gap-3"><CheckCircle2 className="text-red-500 shrink-0" size={18} /> <span className="text-slate-700 text-sm">Makan dan minum dengan sengaja.</span></li>
                    <li className="flex gap-3"><CheckCircle2 className="text-red-500 shrink-0" size={18} /> <span className="text-slate-700 text-sm">Muntah dengan sengaja.</span></li>
                    <li className="flex gap-3"><CheckCircle2 className="text-red-500 shrink-0" size={18} /> <span className="text-slate-700 text-sm">Keluarnya darah Haid atau Nifas bagi wanita.</span></li>
                </ul>
            </AccordionCard>
        </div>
    );
}

// --- HAFALAN & JUZ AMMA ---
function HafalanSection() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const filteredSurat = dataJuzAmma.filter(surat => {
        const matchSearch = surat.surat.toLowerCase().includes(search.toLowerCase()) ||
            surat.artiNama.toLowerCase().includes(search.toLowerCase());

        let matchFilter = true;
        if (filter === '<10') matchFilter = surat.jumlahAyat < 10;
        if (filter === '10-20') matchFilter = surat.jumlahAyat >= 10 && surat.jumlahAyat <= 20;
        if (filter === '>20') matchFilter = surat.jumlahAyat > 20;

        return matchSearch && matchFilter;
    });

    return (
        <div className="p-4 md:p-0 space-y-6">
            <div className="text-center md:text-left mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Juz Amma</h2>
                <p className="text-slate-500 text-sm mt-1">Kumpulan surah pendek dari Juz 30 beserta terjemahannya.</p>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari nama atau arti surah..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="relative shrink-0 w-full sm:w-auto">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                        <Filter size={18} />
                    </div>
                    <select
                        className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none text-slate-700 font-medium"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">Semua Ayat</option>
                        <option value="<10">Kurang dari 10 Ayat</option>
                        <option value="10-20">10 hingga 20 Ayat</option>
                        <option value=">20">Lebih dari 20 Ayat</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredSurat.length > 0 ? (
                    filteredSurat.map((surat, idx) => (
                        <AccordionCard
                            key={idx}
                            title={`Surat ${surat.surat}`}
                            subtitle={`Arti: ${surat.artiNama} • ${surat.jumlahAyat} Ayat`}
                            icon={surat.nomor}
                            defaultOpen={false}
                        >
                            <div className="space-y-4">
                                <div className="bg-indigo-50 p-4 rounded-xl flex justify-between items-start gap-2">
                                    <p className="font-semibold text-lg text-slate-800 leading-relaxed">{surat.bacaan}</p>
                                    <AudioButton text={surat.bacaan} className="shrink-0 bg-white border border-indigo-100" />
                                </div>
                                <p className="text-sm text-slate-600 italic border-l-2 border-indigo-200 pl-3">
                                    "{surat.arti}"
                                </p>
                            </div>
                        </AccordionCard>
                    ))
                ) : (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Search className="mx-auto text-slate-300 mb-2" size={32} />
                        <p className="text-slate-500 font-medium">Surah tidak ditemukan</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function AudioButton({ text, className = "" }) {
    const [isPlaying, setIsPlaying] = React.useState(false);

    const playAudio = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            window.speechSynthesis.resume();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID';
            utterance.rate = 0.80;

            utterance.onstart = () => setIsPlaying(true);
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = (event) => {
                console.error("Audio error:", event);
                setIsPlaying(false);
            };

            window.speechSynthesis.speak(utterance);
        } else {
            alert("Maaf, pelayar web anda tidak menyokong ciri audio.");
        }
    };

    return (
        <button
            onClick={playAudio}
            className={`text-emerald-600 hover:text-emerald-800 p-2 rounded-full transition-colors shadow-sm border border-emerald-100 ${className} ${isPlaying ? 'bg-emerald-200 animate-pulse scale-110' : 'hover:bg-emerald-100'}`}
            title="Dengarkan Audio"
        >
            <Volume2 size={18} />
        </button>
    );
}