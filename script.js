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

// Ses Motorunu Başlat
function initAudio() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();

        // Master Gain
        masterGain = audioCtx.createGain();
        const initialVol = document.getElementById('volume-slider').value / 100;
        masterGain.gain.setValueAtTime(initialVol, audioCtx.currentTime);

        // Sıcak Salon Reverb Efekti (Sentetik İmpuls Yanıtı)
        createReverb();

        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Sentetik Reverb Üreteci
function createReverb() {
    try {
        const sampleRate = audioCtx.sampleRate;
        const length = sampleRate * 1.5; // 1.5 saniye reverb
        const impulse = audioCtx.createBuffer(2, length, sampleRate);
        const left = impulse.getChannelData(0);
        const right = impulse.getChannelData(1);

        for (let i = 0; i < length; i++) {
            const decay = Math.exp(-i / (sampleRate * 0.45));
            left[i] = (Math.random() * 2 - 1) * decay;
            right[i] = (Math.random() * 2 - 1) * decay;
        }

        reverbNode = audioCtx.createConvolver();
        reverbNode.buffer = impulse;

        const reverbGain = audioCtx.createGain();
        reverbGain.gain.value = 0.22; // Hafif ve ferah oda akustiği

        reverbNode.connect(reverbGain);
        reverbGain.connect(audioCtx.destination);
    } catch (e) {
        console.warn('Reverb oluşturulamadı:', e);
    }
}

// Gerçekçi Akustik Piyano Tınısı Sentezi
function playSound(freq, velocity = 0.8) {
    initAudio();
    const now = audioCtx.currentTime;

    // Nota Ana Kazanç Zarfı (Envelope)
    const voiceGain = audioCtx.createGain();
    voiceGain.gain.setValueAtTime(0.0001, now);
    // Hızlı çekiç vuruşu atağı (~3ms)
    voiceGain.gain.exponentialRampToValueAtTime(velocity, now + 0.004);
    // Doğal piyano teli sönümü (Decay)
    voiceGain.gain.exponentialRampToValueAtTime(velocity * 0.45, now + 0.35);

    // Dinamik Alçak Geçiren Filtre (Piyano çekici vuruş parlaklığı)
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3800, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + 0.4);

    // Harmonikler: Doğal piyano teli tınısı için çoklu osilatörler
    const harmonics = [
        { mult: 1.0, type: 'triangle', gain: 0.65 },
        { mult: 1.0, type: 'sine',     gain: 0.40, detune: 2.5 },
        { mult: 2.0, type: 'sine',     gain: 0.28 },
        { mult: 3.0, type: 'sine',     gain: 0.12 },
        { mult: 4.0, type: 'sine',     gain: 0.05 }
    ];

    const oscNodes = [];

    harmonics.forEach(h => {
        const osc = audioCtx.createOscillator();
        osc.type = h.type;
        osc.frequency.setValueAtTime(freq * h.mult, now);
        if (h.detune) osc.detune.setValueAtTime(h.detune, now);

        const hGain = audioCtx.createGain();
        hGain.gain.setValueAtTime(h.gain, now);

        osc.connect(hGain);
        hGain.connect(filter);
        osc.start(now);
        oscNodes.push(osc);
    });

    filter.connect(voiceGain);
    voiceGain.connect(masterGain);

    if (reverbNode) {
        voiceGain.connect(reverbNode);
    }

    return {
        stop: function(releaseDuration = 0.25) {
            const stopTime = audioCtx.currentTime;
            voiceGain.gain.cancelScheduledValues(stopTime);
            voiceGain.gain.setValueAtTime(voiceGain.gain.value, stopTime);
            voiceGain.gain.exponentialRampToValueAtTime(0.0001, stopTime + releaseDuration);

            setTimeout(() => {
                oscNodes.forEach(osc => {
                    try { osc.stop(); osc.disconnect(); } catch (e) {}
                });
                voiceGain.disconnect();
                filter.disconnect();
            }, releaseDuration * 1000 + 50);
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

    // Sustain pedalı basılıysa telin uzun süre titreşmesine izin ver (2.2s)
    const releaseTime = isSustainActive ? 2.2 : 0.22;
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
