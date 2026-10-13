# 🎹 24 Tuşlu Sanal Piyano (Virtual Piano)

Web Audio API kullanılarak geliştirilmiş, tarayıcı üzerinden tamamen çevrimdışı ve gecikmesiz çalışan, 24 beyaz ve 17 siyah tuşlu interaktif sanal piyano.

## ✨ Özellikler

- **24 Beyaz Tuş (Do - Re - Mi - Fa - Sol - La - Si):** 3.5 oktavlık geniş ses aralığı (C4'ten E7'ye).
- **17 Siyah Tuş (Bemol ♭ & Diyez ♯):** Tam kromatik ses desteği.
- **Klavyeden Çalma Desteği:**
  - **A - M Tuş Düzeni:** İlk 16 nota doğal harf düzeniyle çalınır (`A, S, D, F, G, H, J, K, L, Z, X, C, V, B, N, M`).
  - **Rakam Tuşları (1 - 8):** Harflerin yetmediği üst oktavlar rakam tuşlarıyla çalınır (`1, 2, 3, 4, 5, 6, 7, 8`).
  - **Siyah Tuşlar:** Üst sıra harfler (`W, E, T, Y, U, O, P, Ğ, Ü, İ, -, =`) ve rakam tuşları için `Shift` kombinasyonları.
- **Gelişmiş Akustik Piyano Ses Motoru (Fiziksel Modelleme):**
  - **Çekiç Vuruş Darbesi:** Keçe çekicin çelik tele vurma anındaki tahta/keçe perkülatif darbe transienti (hammer impact).
  - **3 Telli Unison Titreşim (Chorus / Beating):** Akustik piyanolardaki çoklu tel mikro-detuning etkisiyle canlı, şarkı söyleyen doğal rezonans.
  - **Çelik Tel İnharmonisi (Dispersion):** Sert çelik tellerin fiziksel inharmoni formülüyle ($f_n = n \cdot f_0 \sqrt{1 + B \cdot n^2}$) üretilen berrak zil tınısı.
  - **Ladin Gövde & Ses Tahtası EQ:** Piyano kasasının ahşap sıcaklığı ve akustik projeksiyonu (Soundboard EQ).
  - **Stereo Akustik Sahne:** Bas sesler solda, tiz sesler sağda konumlanan doğal 3D stereo yayılım.
  - **Frekansa Bağlı Doğal Sönüm & Keçe Susturucu:** Bas tellerin uzun, tiz tellerin çabuk sönümlenmesi ve tuş bırakıldığında düşen keçe susturucu (damper).
  - **2.4s Konser Salonu Reverb:** Zengin ve ferah konser salonu akustiği.
- **Sustain Pedalı:** Klavyedeki <kbd>Space</kbd> tuşuyla veya arayüzden pedala tıklanarak tellerin doğal sönüm süresince yankılanmasını sağlar.
- **İnteraktif Şarkı Rehberi:** *"Daha Dün Annemizin"*, *"Neşeye Övgü (Beethoven)"*, *"Jingle Bells"*, *"İyi ki Doğdun"* gibi şarkıları adım adım ışık rehberliğiyle çaldırır.
- **Kayıt ve Dinleme (Record & Playback):** Çaldığınız melodileri kaydedip tekrar dinleme imkanı.
- **Tam Duyarlı (Responsive) Tasarım:** Masaüstü ve dokunmatik cihazlarla uyumlu.

## 🚀 Kurulum ve Çalıştırma

Projeyi çalıştırmak için herhangi bir paket yöneticisine veya bağımlılığa gerek yoktur.

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/zynex07/sanal-piyano.git
   ```
2. Klasöre girin ve `index.html` dosyasını herhangi bir web tarayıcısında açın:
   ```bash
   cd sanal-piyano
   open index.html # macOS için
   ```

## 🛠️ Kullanılan Teknolojiler

- HTML5 (Semantik arayüz)
- CSS3 (3D animasyonlar, Flexbox, gradyanlar)
- Vanilla JavaScript & Web Audio API (Sentezleyici ve efekt motoru)

## 📄 Lisans

MIT
