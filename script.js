/**
 * Sanal Piyano (16 Tuşlu İnteraktif Piyano)
 * Web Audio API ile zengin piyano ses sentezi ve tam klavye desteği
 */

// 24 Beyaz Tuş Tanımlamaları (A-M düzeni ve yetmeyen yerlerde 1-8 rakam tuşları)
const WHITE_KEYS = [
    // Oktav 4 (Do4 - Si4: 7 Tuş -> A, S, D, F, G, H, J)
    { id: 'C4', note: 'DO',  octave: '4', freq: 261.63, key: 'A', name: 'Do' },
    { id: 'D4', note: 'RE',  octave: '4', freq: 293.66, key: 'S', name: 'Re' },
    { id: 'E4', note: 'Mİ',  octave: '4', freq: 329.63, key: 'D', name: 'Mi' },
    { id: 'F4', note: 'FA',  octave: '4', freq: 349.23, key: 'F', name: 'Fa' },
    { id: 'G4', note: 'SOL', octave: '4', freq: 392.00, key: 'G', name: 'Sol' },
    { id: 'A4', note: 'LA',  octave: '4', freq: 440.00, key: 'H', name: 'La' },
    { id: 'B4', note: 'Sİ',  octave: '4', freq: 493.88, key: 'J', name: 'Si' },
    // Oktav 5 (Do5 - Si5: 7 Tuş -> K, L, Z, X, C, V, B)
    { id: 'C5', note: 'DO',  octave: '5', freq: 523.25, key: 'K', name: 'Do' },
    { id: 'D5', note: 'RE',  octave: '5', freq: 587.33, key: 'L', name: 'Re' },
    { id: 'E5', note: 'Mİ',  octave: '5', freq: 659.25, key: 'Z', name: 'Mi' },
    { id: 'F5', note: 'FA',  octave: '5', freq: 698.46, key: 'X', name: 'Fa' },
    { id: 'G5', note: 'SOL', octave: '5', freq: 783.99, key: 'C', name: 'Sol' },
    { id: 'A5', note: 'LA',  octave: '5', freq: 880.00, key: 'V', name: 'La' },
    { id: 'B5', note: 'Sİ',  octave: '5', freq: 987.77, key: 'B', name: 'Si' },
    // Oktav 6 (Do6, Re6: 2 Tuş -> N, M)
    { id: 'C6', note: 'DO',  octave: '6', freq: 1046.50, key: 'N', name: 'Do' },
    { id: 'D6', note: 'RE',  octave: '6', freq: 1174.66, key: 'M', name: 'Re' },
    // --- Harflerin yetmediği yerlerde Rakam Tuşları (1 - 8) ---
    { id: 'E6', note: 'Mİ',  octave: '6', freq: 1318.51, key: '1', name: 'Mi' },
    { id: 'F6', note: 'FA',  octave: '6', freq: 1396.91, key: '2', name: 'Fa' },
    { id: 'G6', note: 'SOL', octave: '6', freq: 1567.98, key: '3', name: 'Sol' },
    { id: 'A6', note: 'LA',  octave: '6', freq: 1760.00, key: '4', name: 'La' },
    { id: 'B6', note: 'Sİ',  octave: '6', freq: 1975.53, key: '5', name: 'Si' },
    { id: 'C7', note: 'DO',  octave: '7', freq: 2093.00, key: '6', name: 'Do' },
    { id: 'D7', note: 'RE',  octave: '7', freq: 2349.32, key: '7', name: 'Re' },
    { id: 'E7', note: 'Mİ',  octave: '7', freq: 2637.02, key: '8', name: 'Mi' }
];

// Siyah Tuşlar (Bemol ve Diyez Ara Sesleri - 17 Adet)
const BLACK_KEYS = [
    // Oktav 4 (W, E, T, Y, U)
    { id: 'Cs4', sharp: 'Do♯', flat: 'Re♭', freq: 277.18, afterWhiteIndex: 0,  key: 'W', aliases: ['W', 'SHIFT+A'] },
    { id: 'Ds4', sharp: 'Re♯', flat: 'Mi♭', freq: 311.13, afterWhiteIndex: 1,  key: 'E', aliases: ['E', 'SHIFT+S'] },
    { id: 'Fs4', sharp: 'Fa♯', flat: 'Sol♭', freq: 369.99, afterWhiteIndex: 3,  key: 'T', aliases: ['T', 'SHIFT+F'] },
    { id: 'Gs4', sharp: 'Sol♯', flat: 'La♭', freq: 415.30, afterWhiteIndex: 4,  key: 'Y', aliases: ['Y', 'SHIFT+G'] },
    { id: 'As4', sharp: 'La♯', flat: 'Si♭', freq: 466.16, afterWhiteIndex: 5,  key: 'U', aliases: ['U', 'SHIFT+H'] },
    // Oktav 5 (O, P, Ğ, Ü, İ)
    { id: 'Cs5', sharp: 'Do♯', flat: 'Re♭', freq: 554.37, afterWhiteIndex: 7,  key: 'O', aliases: ['O', 'SHIFT+K'] },
    { id: 'Ds5', sharp: 'Re♯', flat: 'Mi♭', freq: 622.25, afterWhiteIndex: 8,  key: 'P', aliases: ['P', 'SHIFT+L'] },
    { id: 'Fs5', sharp: 'Fa♯', flat: 'Sol♭', freq: 739.99, afterWhiteIndex: 10, key: 'Ğ', aliases: ['Ğ', '[', 'SHIFT+X'] },
    { id: 'Gs5', sharp: 'Sol♯', flat: 'La♭', freq: 830.61, afterWhiteIndex: 11, key: 'Ü', aliases: ['Ü', ']', 'SHIFT+C'] },
    { id: 'As5', sharp: 'La♯', flat: 'Si♭', freq: 932.33, afterWhiteIndex: 12, key: 'İ', aliases: ['İ', '\\', 'SHIFT+V'] },
    // Oktav 6 (-, =)
    { id: 'Cs6', sharp: 'Do♯', flat: 'Re♭', freq: 1108.73, afterWhiteIndex: 14, key: '-', aliases: ['-', '_', 'SHIFT+N'] },
    { id: 'Ds6', sharp: 'Re♯', flat: 'Mi♭', freq: 1244.51, afterWhiteIndex: 15, key: '=', aliases: ['=', '+', 'SHIFT+M'] },
    // Oktav 6-7 Rakam Bölgesi Siyah Tuşları
    { id: 'Fs6', sharp: 'Fa♯', flat: 'Sol♭', freq: 1479.98, afterWhiteIndex: 17, key: '⇧2', aliases: ['SHIFT+2', "'", '@'] },
    { id: 'Gs6', sharp: 'Sol♯', flat: 'La♭', freq: 1661.22, afterWhiteIndex: 18, key: '⇧3', aliases: ['SHIFT+3', '^', '#'] },
    { id: 'As6', sharp: 'La♯', flat: 'Si♭', freq: 1864.66, afterWhiteIndex: 19, key: '⇧4', aliases: ['SHIFT+4', '+', '$'] },
    { id: 'Cs7', sharp: 'Do♯', flat: 'Re♭', freq: 2217.46, afterWhiteIndex: 21, key: '⇧6', aliases: ['SHIFT+6', '&'] },
    { id: 'Ds7', sharp: 'Re♯', flat: 'Mi♭', freq: 2489.02, afterWhiteIndex: 22, key: '⇧7', aliases: ['SHIFT+7', '/'] }
];

// Popüler Pratik Şarkıları
const SONGS = {
    twinkle: {
        name: 'Daha Dün Annemizin',
        notes: ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4']
    },
    odeToJoy: {
        name: 'Neşeye Övgü (Beethoven)',
        notes: ['E4', 'E4', 'F4', 'G4', 'G4', 'F4', 'E4', 'D4', 'C4', 'C4', 'D4', 'E4', 'E4', 'D4', 'D4']
    },
    jingle: {
        name: 'Jingle Bells',
        notes: ['E4', 'E4', 'E4', 'E4', 'E4', 'E4', 'E4', 'G4', 'C4', 'D4', 'E4', 'F4', 'F4', 'F4']
    },
    happyBirthday: {
        name: 'İyi ki Doğdun',
        notes: ['C4', 'C4', 'D4', 'C4', 'F4', 'E4', 'C4', 'C4', 'D4', 'C4', 'G4', 'F4']
    }
};

// Uygulama Durumu
let audioCtx = null;
let masterGain = null;
let reverbNode = null;
let isSustainActive = false;
let currentLayout = 'numbers'; // 'numbers' veya 'letters'
let showAccidentals = false;
const activeVoices = new Map(); // keyId -> Array of active audio nodes

// Kayıt & Şarkı Durumu
let isRecording = false;
let recordStartTime = 0;
let recordedEvents = [];
let activeSongKey = null;
let activeSongStep = 0;

let soundboardChain = null;

// Ses Motorunu Başlat
function initAudio() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();

        // Master Gain
        masterGain = audioCtx.createGain();
        const initialVol = document.getElementById('volume-slider').value / 100;
        masterGain.gain.setValueAtTime(initialVol, audioCtx.currentTime);

        // Akustik Piyano Rezonans & Gövde Filtresi (Soundboard EQ)
        initSoundboard();

        // Konser Salonu Akustik Reverb Efekti
        createReverb();

        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Akustik Gövde ve Ses Tahtası Filtresi (Spruce Soundboard Resonance)
function initSoundboard() {
    if (soundboardChain) return;

    // 1. Ladin ağacı gövde sıcaklığı (220Hz etrafında zengin rezonans)
    const woodWarmth = audioCtx.createBiquadFilter();
    woodWarmth.type = 'peaking';
    woodWarmth.frequency.value = 220;
    woodWarmth.Q.value = 1.3;
    woodWarmth.gain.value = 3.2;

    // 2. Akustik projeksiyon (1500Hz şarkı söyleyen orta frekans netliği)
    const midPresence = audioCtx.createBiquadFilter();
    midPresence.type = 'peaking';
    midPresence.frequency.value = 1500;
    midPresence.Q.value = 1.1;
    midPresence.gain.value = 1.6;

    // 3. Doğal hava sönümü (Sert dijital tizleri yuvarlayan alçak geçiren filtre)
    const highRollOff = audioCtx.createBiquadFilter();
    highRollOff.type = 'lowpass';
    highRollOff.frequency.value = 12500;

    woodWarmth.connect(midPresence);
    midPresence.connect(highRollOff);
    highRollOff.connect(masterGain);

    soundboardChain = woodWarmth;
}

// Konser Salonu Akustik Reverb Üreteci
function createReverb() {
    try {
        const sampleRate = audioCtx.sampleRate;
        const duration = 2.4; // 2.4 saniye akustik konser salonu kuyruğu
        const length = sampleRate * duration;
        const impulse = audioCtx.createBuffer(2, length, sampleRate);
        const left = impulse.getChannelData(0);
        const right = impulse.getChannelData(1);

        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            // Tiz seslerin havada daha hızlı sönümlenmesi (fiziksel oda modeli)
            const decayL = Math.exp(-t * 2.85);
            const decayR = Math.exp(-t * 2.95);

            // İlk yansımalar ve homojen difüzyon
            const early = (i < sampleRate * 0.06) ? (Math.random() * 0.45) : 0;
            left[i] = ((Math.random() * 2 - 1) * decayL + early) * 0.65;
            right[i] = ((Math.random() * 2 - 1) * decayR + early) * 0.65;
        }

        reverbNode = audioCtx.createConvolver();
        reverbNode.buffer = impulse;

        const reverbGain = audioCtx.createGain();
        reverbGain.gain.value = 0.26; // Zengin ve derin oda akustiği

        reverbNode.connect(reverbGain);
        reverbGain.connect(masterGain);
    } catch (e) {
        console.warn('Reverb oluşturulamadı:', e);
    }
}

// Çekiç Vuruş Darbesi (Felt Hammer Impact Transient)
function playHammerImpact(now, freq, velocity, targetNode) {
    try {
        const bufferSize = Math.floor(audioCtx.sampleRate * 0.035); // 35ms darbe sesi
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.007));
        }

        const noiseSource = audioCtx.createBufferSource();
        noiseSource.buffer = buffer;

        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(Math.min(1800, Math.max(280, freq * 1.5)), now);
        noiseFilter.Q.setValueAtTime(2.2, now);

        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(velocity * 0.24, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(targetNode);

        noiseSource.start(now);
        return noiseSource;
    } catch (e) {
        return null;
    }
}

// Gerçekçi Akustik Kuyruklu Konser Piyanosu Sentezi
function playSound(freq, velocity = 0.8) {
    initAudio();
    const now = audioCtx.currentTime;

    // Frekansa bağlı doğal tel titreşim süresi (Baslar uzun şarkı söyler, tizler çabuk söner)
    const naturalDecay = Math.max(1.2, 4.6 * Math.pow(261.63 / freq, 0.42));
    const damperRelease = Math.max(0.14, Math.min(0.28, 0.28 * Math.pow(261.63 / freq, 0.3)));

    // 1. Stereo Akustik Sahne Yayılımı (Baslar solda, tizler sağda)
    let panner = null;
    let nodeBeforeMaster = null;
    if (audioCtx.createStereoPanner) {
        panner = audioCtx.createStereoPanner();
        const minLog = Math.log(261.63);
        const maxLog = Math.log(2637.02);
        const norm = (Math.log(freq) - minLog) / (maxLog - minLog);
        const panVal = Math.max(-0.38, Math.min(0.38, -0.36 + norm * 0.72));
        panner.pan.setValueAtTime(panVal, now);
        panner.connect(soundboardChain || masterGain);
        nodeBeforeMaster = panner;
    } else {
        nodeBeforeMaster = soundboardChain || masterGain;
    }

    // 2. Nota Kazanç Zarfı (Double-Exponential Envelope)
    const voiceGain = audioCtx.createGain();
    voiceGain.gain.setValueAtTime(0.0001, now);
    // Hızlı çekiç vuruşu atağı (~2.5ms)
    voiceGain.gain.exponentialRampToValueAtTime(velocity, now + 0.0025);
    // İlk hızlı tel darbe sönümü (~140ms)
    voiceGain.gain.exponentialRampToValueAtTime(velocity * 0.52, now + 0.14);
    // Uzun doğal şarkı söyleyen sönüm (Singing string decay)
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + naturalDecay);

    // 3. Dinamik Spektral Filtre (Piyano telinin yüksek modlarının hızlı sönümlenmesi)
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    const initCutoff = Math.min(9500, Math.max(2200, freq * 3.6 * (0.6 + 0.5 * velocity)));
    const endCutoff = Math.min(2600, Math.max(650, freq * 1.4));
    filter.frequency.setValueAtTime(initCutoff, now);
    filter.frequency.exponentialRampToValueAtTime(endCutoff, now + 0.24);

    // 4. Çekiç Vuruş Darbesi (Keçe çekiç tahta gövde transienti)
    const impactSource = playHammerImpact(now, freq, velocity, filter);

    // 5. Çelik Tel İnharmonisi (String stiffness: fn = n * f0 * sqrt(1 + B * n^2))
    function inharmonic(n) {
        return n * freq * Math.sqrt(1 + 0.00016 * n * n);
    }

    // Harmonikler & Unison Çoklu Tel Titreşimi
    const harmonics = [
        // Temel Frekans (Akustik piyanoda 3 telli unison koro titreşimi)
        { freq: inharmonic(1), type: 'sine',     gain: 0.85, detune: 1.4 },
        { freq: inharmonic(1), type: 'triangle', gain: 0.58, detune: -1.4 },
        // 2. Harmonik (Oktav)
        { freq: inharmonic(2), type: 'sine',     gain: 0.40, detune: 0.7 },
        // 3. Harmonik (Beşli)
        { freq: inharmonic(3), type: 'sine',     gain: 0.22, detune: -0.6 },
        // 4. Harmonik (Çift Oktav)
        { freq: inharmonic(4), type: 'sine',     gain: 0.11, detune: 0 },
        // 5. Harmonik (Üçlü)
        { freq: inharmonic(5), type: 'sine',     gain: 0.05, detune: 0 },
        // 6. Harmonik (Metalik tel pırıltısı)
        { freq: inharmonic(6), type: 'sine',     gain: 0.025, detune: 0 }
    ];

    const oscNodes = [];

    harmonics.forEach(h => {
        if (h.freq > 18000) return; // İnsan kulağı üstü sınır

        const osc = audioCtx.createOscillator();
        osc.type = h.type;
        osc.frequency.setValueAtTime(h.freq, now);
        if (h.detune) osc.detune.setValueAtTime(h.detune, now);

        const hGain = audioCtx.createGain();
        hGain.gain.setValueAtTime(h.gain, now);

        osc.connect(hGain);
        hGain.connect(filter);
        osc.start(now);
        oscNodes.push(osc);
    });

    filter.connect(voiceGain);
    voiceGain.connect(nodeBeforeMaster);

    if (reverbNode) {
        voiceGain.connect(reverbNode);
    }

    return {
        naturalDecay: naturalDecay,
        damperRelease: damperRelease,
        stop: function(releaseDuration = damperRelease) {
            const stopTime = audioCtx.currentTime;
            voiceGain.gain.cancelScheduledValues(stopTime);
            voiceGain.gain.setValueAtTime(Math.max(0.0001, voiceGain.gain.value), stopTime);
            voiceGain.gain.exponentialRampToValueAtTime(0.0001, stopTime + releaseDuration);

            setTimeout(() => {
                oscNodes.forEach(osc => {
                    try { osc.stop(); osc.disconnect(); } catch (e) {}
                });
                try { if (impactSource) impactSource.stop(); } catch (e) {}
                voiceGain.disconnect();
                filter.disconnect();
                if (panner) panner.disconnect();
            }, releaseDuration * 1000 + 60);
        }
    };
}

// Nota Başlat
function noteOn(keyId) {
    if (activeVoices.has(keyId)) return;

    // Tuşu bul
    const whiteData = WHITE_KEYS.find(k => k.id === keyId);
    const blackData = BLACK_KEYS.find(k => k.id === keyId);
    const item = whiteData || blackData;
    if (!item) return;

    // Ses çal
    const voice = playSound(item.freq);
    activeVoices.set(keyId, voice);

    // UI Güncelle
    const keyElem = document.getElementById(`key-${keyId}`);
    if (keyElem) {
        keyElem.classList.add('active');
    }

    // Kayıt kontrolü
    if (isRecording) {
        recordedEvents.push({
            type: 'on',
            keyId: keyId,
            time: Date.now() - recordStartTime
        });
    }

    // Şarkı pratik rehberi kontrolü
    checkSongStep(keyId);
}

// Nota Bitir
function noteOff(keyId) {
    const voice = activeVoices.get(keyId);
    if (!voice) return;

    // Sustain pedalı basılıysa telin doğal sönmesine izin ver; basılı değilse keçe susturucu (damper) düşer
    const releaseTime = isSustainActive ? voice.naturalDecay : voice.damperRelease;
    voice.stop(releaseTime);
    activeVoices.delete(keyId);

    // UI Güncelle
    const keyElem = document.getElementById(`key-${keyId}`);
    if (keyElem) {
        keyElem.classList.remove('active');
    }

    // Kayıt kontrolü
    if (isRecording) {
        recordedEvents.push({
            type: 'off',
            keyId: keyId,
            time: Date.now() - recordStartTime
        });
    }
}

// Klavye Tuşlarını DOM'a Yerleştir
function renderKeyboard() {
    const container = document.getElementById('piano-keyboard');
    container.innerHTML = '';

    const totalWhiteKeys = WHITE_KEYS.length; // 24 adet

    // 1. Beyaz Tuşları Yerleştir (24 Adet: A-M ve 1-8)
    WHITE_KEYS.forEach((k) => {
        const whiteKey = document.createElement('div');
        whiteKey.className = 'key-white';
        whiteKey.id = `key-${k.id}`;
        whiteKey.dataset.keyId = k.id;

        whiteKey.innerHTML = `
            <div class="note-label">
                ${k.note}<span class="octave-sub">${k.octave}</span>
            </div>
            <div class="key-badge">${k.key}</div>
        `;

        // Mouse & Dokunmatik Olayları
        attachKeyEvents(whiteKey, k.id);
        container.appendChild(whiteKey);
    });

    // 2. Siyah Tuşları Doğru Geometrik Konumlarına Yerleştir (17 Adet)
    BLACK_KEYS.forEach(k => {
        const blackKey = document.createElement('div');
        blackKey.className = 'key-black';
        blackKey.id = `key-${k.id}`;
        blackKey.dataset.keyId = k.id;

        // Pozisyon hesaplama (24 beyaz tuş genişliği yüzdesi üzerinden)
        const whiteKeyWidthPercent = 100 / totalWhiteKeys;
        const leftPercent = (k.afterWhiteIndex + 1) * whiteKeyWidthPercent - (2.7 / 2);
        blackKey.style.left = `${leftPercent}%`;

        blackKey.innerHTML = `
            <div class="note-label-container">
                <div class="sharp-name">${k.sharp}</div>
                <div class="flat-name">${k.flat}</div>
            </div>
            <div class="key-badge">${k.key}</div>
        `;

        attachKeyEvents(blackKey, k.id);
        container.appendChild(blackKey);
    });
}

// Tuşlara Mouse & Touch Olayları Ekleme
function attachKeyEvents(elem, keyId) {
    let isPressed = false;

    elem.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isPressed = true;
        noteOn(keyId);
    });

    elem.addEventListener('mouseup', () => {
        if (isPressed) {
            isPressed = false;
            noteOff(keyId);
        }
    });

    elem.addEventListener('mouseleave', () => {
        if (isPressed) {
            isPressed = false;
            noteOff(keyId);
        }
    });

    // Dokunmatik Ekran Desteği
    elem.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isPressed = true;
        noteOn(keyId);
    }, { passive: false });

    elem.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (isPressed) {
            isPressed = false;
            noteOff(keyId);
        }
    });
}

// Tuş Kısayol Haritası Oluştur
function getKeyMap() {
    const map = {};

    // 24 Beyaz Tuş (A - M, sonra 1 - 8)
    WHITE_KEYS.forEach(k => {
        const keyUpper = k.key.toUpperCase();
        map[keyUpper] = k.id;
        map[k.key] = k.id;
        map[`KEY_${keyUpper}`] = k.id;
        map[`DIGIT${k.key}`] = k.id;
    });

    // 17 Siyah Tuş (Bemol & Diyez)
    BLACK_KEYS.forEach(k => {
        const keyUpper = k.key.toUpperCase();
        map[keyUpper] = k.id;
        map[k.key] = k.id;
        map[`KEY_${keyUpper}`] = k.id;
        if (k.aliases) {
            k.aliases.forEach(alias => {
                map[alias.toUpperCase()] = k.id;
                map[alias] = k.id;
            });
        }
    });

    return map;
}

// Fiziksel Bilgisayar Klavyesi Dinleyicileri
const keyMap = getKeyMap();
const pressedPhysicalKeys = new Set();
const physicalKeyToNoteId = new Map();

window.addEventListener('keydown', (e) => {
    // Input/Select alanlarındaysa engelleme
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

    // Space: Sustain Pedal
    if (e.code === 'Space') {
        e.preventDefault();
        toggleSustain();
        return;
    }

    const rawKey = e.key;
    const upperKey = rawKey.toUpperCase();
    let noteId = null;

    // 1. Shift kombinasyonu kontrolü (örn. Shift+1, Shift+A veya doğrudan üretilen karakter '!', '+')
    if (e.shiftKey) {
        const cleanCode = e.code.replace('Digit', '').replace('Key', '').toUpperCase();
        noteId = keyMap[`SHIFT+${cleanCode}`] || keyMap[`SHIFT+${upperKey}`] || keyMap[rawKey] || keyMap[upperKey];
    }

    // 2. Doğrudan tuş eşlemesi
    if (!noteId) {
        noteId = keyMap[upperKey] || keyMap[rawKey];
    }

    // 3. Kod bazlı kontrol (KeyW -> W)
    if (!noteId && e.code.startsWith('Key')) {
        const letter = e.code.replace('Key', '').toUpperCase();
        noteId = keyMap[letter];
    }

    if (noteId && !pressedPhysicalKeys.has(e.code)) {
        e.preventDefault();
        pressedPhysicalKeys.add(e.code);
        physicalKeyToNoteId.set(e.code, noteId);
        noteOn(noteId);
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') return;

    const noteId = physicalKeyToNoteId.get(e.code);
    pressedPhysicalKeys.delete(e.code);
    physicalKeyToNoteId.delete(e.code);

    if (noteId) {
        noteOff(noteId);
    }
});

// Sustain Pedalı Değiştir
function toggleSustain(forceState) {
    if (typeof forceState === 'boolean') {
        isSustainActive = forceState;
    } else {
        isSustainActive = !isSustainActive;
    }

    const btn = document.getElementById('sustain-btn');
    if (isSustainActive) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
}

// Şarkı Rehberi Mantığı
function startSongTrainer(songKey) {
    activeSongKey = songKey;
    activeSongStep = 0;

    // Aktif şarkı butonunu işaretle
    document.querySelectorAll('.song-chip').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.song === songKey);
    });
    document.getElementById('stop-song-btn').style.display = 'inline-block';

    updateSongGuideHighlight();
}

function stopSongTrainer() {
    activeSongKey = null;
    activeSongStep = 0;

    document.querySelectorAll('.song-chip').forEach(btn => btn.classList.remove('active'));
    document.getElementById('stop-song-btn').style.display = 'none';

    // Highlightları temizle
    document.querySelectorAll('.song-guide').forEach(k => k.classList.remove('song-guide'));
    document.getElementById('trainer-helper').textContent = 
        'Bir şarkı seçerek tuş rehberini başlatabilir veya doğrudan klavyenizden serbestçe çalabilirsiniz!';
}

function updateSongGuideHighlight() {
    // Önceki vurguyu temizle
    document.querySelectorAll('.song-guide').forEach(k => k.classList.remove('song-guide'));

    if (!activeSongKey || !SONGS[activeSongKey]) return;

    const song = SONGS[activeSongKey];
    if (activeSongStep >= song.notes.length) {
        document.getElementById('trainer-helper').innerHTML = 
            `🎉 <strong>Tebrikler!</strong> "${song.name}" parçasını başarıyla tamamladınız!`;
        stopSongTrainer();
        return;
    }

    const currentNoteId = song.notes[activeSongStep];
    const keyElem = document.getElementById(`key-${currentNoteId}`);
    if (keyElem) {
        keyElem.classList.add('song-guide');
    }

    const whiteData = WHITE_KEYS.find(k => k.id === currentNoteId);
    const shortcut = whiteData ? whiteData.key : '';
    
    document.getElementById('trainer-helper').innerHTML = 
        `🎼 <strong>${song.name}</strong> (${activeSongStep + 1} / ${song.notes.length}) — Lütfen <strong>${whiteData.note} (${whiteData.name})</strong> tuşuna basın [Klavye: <strong>${shortcut}</strong>]`;
}

function checkSongStep(pressedKeyId) {
    if (!activeSongKey || !SONGS[activeSongKey]) return;

    const song = SONGS[activeSongKey];
    const expectedNote = song.notes[activeSongStep];

    if (pressedKeyId === expectedNote) {
        activeSongStep++;
        updateSongGuideHighlight();
    }
}

// Kayıt & Tekrar Çalma (Record & Playback)
function toggleRecording() {
    const btn = document.getElementById('record-btn');
    const text = document.getElementById('record-btn-text');
    const playBtn = document.getElementById('play-record-btn');

    if (!isRecording) {
        // Kayıt Başlat
        isRecording = true;
        recordedEvents = [];
        recordStartTime = Date.now();
        btn.classList.add('recording');
        text.textContent = 'Kaydı Durdur';
        playBtn.disabled = true;
    } else {
        // Kayıt Durdur
        isRecording = false;
        btn.classList.remove('recording');
        text.textContent = 'Kayıt Başlat';
        if (recordedEvents.length > 0) {
            playBtn.disabled = false;
        }
    }
}

function playRecording() {
    if (recordedEvents.length === 0 || isRecording) return;

    const playBtn = document.getElementById('play-record-btn');
    playBtn.disabled = true;
    playBtn.textContent = '⏳ Çalınıyor...';

    initAudio();

    recordedEvents.forEach(evt => {
        setTimeout(() => {
            if (evt.type === 'on') {
                noteOn(evt.keyId);
            } else if (evt.type === 'off') {
                noteOff(evt.keyId);
            }
        }, evt.time);
    });

    const totalDuration = recordedEvents[recordedEvents.length - 1].time + 800;
    setTimeout(() => {
        playBtn.disabled = false;
        playBtn.textContent = '▶ Kaydı Dinle';
    }, totalDuration);
}

// Sayfa Yüklendiğinde Olay Dinleyicileri
document.addEventListener('DOMContentLoaded', () => {
    renderKeyboard();

    // Ses Seviyesi Kaydırıcısı
    const volumeSlider = document.getElementById('volume-slider');
    const volumeText = document.getElementById('volume-text');
    const volumeIcon = document.getElementById('volume-icon');

    volumeSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        volumeText.textContent = `${val}%`;
        if (masterGain && audioCtx) {
            masterGain.gain.setValueAtTime(val / 100, audioCtx.currentTime);
        }
        volumeIcon.textContent = val === 0 ? '🔇' : (val < 50 ? '🔉' : '🔊');
    });

    // Sustain Butonu
    document.getElementById('sustain-btn').addEventListener('click', () => {
        toggleSustain();
    });

    // Klavye Dizilimi (Varsa)
    const layoutSelect = document.getElementById('layout-select');
    if (layoutSelect) {
        layoutSelect.addEventListener('change', (e) => {
            currentLayout = e.target.value;
            renderKeyboard();
            if (activeSongKey) updateSongGuideHighlight();
        });
    }

    // Siyah Tuşlar (Bemol ve Diyez) - Varsayılan Olarak Açık ve Aktif
    const toggleAccidentalsBtn = document.getElementById('toggle-accidentals-btn');
    const keyboardWrapper = document.getElementById('piano-keyboard');

    showAccidentals = true;
    keyboardWrapper.classList.remove('hide-accidentals');
    toggleAccidentalsBtn.classList.add('active');

    toggleAccidentalsBtn.addEventListener('click', () => {
        showAccidentals = !showAccidentals;
        keyboardWrapper.classList.toggle('hide-accidentals', !showAccidentals);
        toggleAccidentalsBtn.classList.toggle('active', showAccidentals);
    });

    // Şarkı Çipleri
    document.querySelectorAll('.song-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            const songKey = btn.dataset.song;
            if (activeSongKey === songKey) {
                stopSongTrainer();
            } else {
                startSongTrainer(songKey);
            }
        });
    });

    document.getElementById('stop-song-btn').addEventListener('click', stopSongTrainer);

    // Kayıt Butonları
    document.getElementById('record-btn').addEventListener('click', toggleRecording);
    document.getElementById('play-record-btn').addEventListener('click', playRecording);
});
