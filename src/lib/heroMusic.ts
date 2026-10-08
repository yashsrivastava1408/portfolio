/**
 * A rock track for the hero, played live with the Web Audio API (no audio file, nothing to license).
 *
 * The band: a drum kit (kick, snare with ghost notes, closed and open hats, crash, tom fills),
 * a bass, two overdriven rhythm guitars panned left and right, and a lead guitar with echo.
 * Everything goes through a small room reverb and a compressor, with slightly loose timing
 * and hit strength so it does not sound like a machine.
 *
 * It builds with the scroll: drums and bass first, then the riff, then the chorus, then the lead.
 *
 * Browsers only allow sound after a click, tap or key press. Scrolling alone does not count,
 * so the track stays silent until the first such gesture anywhere on the page.
 */

const BPM = 126;
const STEP = 60 / BPM / 4; // one sixteenth note, in seconds
const BAR = 16;
const VOLUME = 0.5;
const FADE = 0.45; // seconds, roughly, to fade in or out

// How far into the hero each layer joins (0 = top of the hero, 1 = its end).
const RIFF_AT = 0.18;
const CHORUS_AT = 0.45;
const LEAD_AT = 0.72;

const E2 = 82.41;
const G2 = 98.0;
const A2 = 110.0;
const C3 = 130.81;
const D3 = 146.83;
const E3 = 164.81;
const G4 = 392.0;
const A4 = 440.0;
const B4 = 493.88;
const D5 = 587.33;
const E5 = 659.25;
const G5 = 783.99;
const E4 = 329.63;

// Verse: palm-muted chugs on E with two open chords answering, one slot per eighth note. [root, open?]
const VERSE: [number, boolean][][] = [
    [[E2, false], [E2, false], [E2, false], [E2, false], [E2, false], [E2, false], [G2, true], [A2, true]],
    [[E2, false], [E2, false], [E2, false], [E2, false], [E2, false], [E2, false], [D3, true], [C3, true]],
];
// Chorus: open chords, one per bar, strummed on a pushed rhythm.
const CHORUS = [C3, D3, E3, E3];
const STRUMS = [0, 3, 6, 8, 11, 14];
// Lead: a four-bar phrase in E minor pentatonic. [step, note, length in steps]
const LEAD: [number, number, number][][] = [
    [[0, B4, 3], [3, D5, 3], [6, E5, 6], [12, D5, 2], [14, B4, 2]],
    [[0, A4, 3], [3, G4, 3], [6, E4, 9]],
    [[0, E5, 4], [4, G5, 4], [8, E5, 3], [11, D5, 3], [14, B4, 2]],
    [[0, E5, 11], [12, D5, 2], [14, B4, 2]],
];

type State = { muted: boolean; unlocked: boolean };

let state: State = { muted: false, unlocked: false };
const listeners = new Set<() => void>();
const setState = (next: Partial<State>) => {
    state = { ...state, ...next };
    listeners.forEach((l) => l());
};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let mix: GainNode | null = null; // everything meets here, before the tone filter and compressor
let tone: BiquadFilterNode | null = null;
let room: ConvolverNode | null = null;
let guitars: GainNode[] = [];
let lead: GainNode | null = null;
let bass: GainNode | null = null;
let noise: AudioBuffer | null = null;

let wanted = false; // the hero is on screen and being scrolled
let intensity = 0; // how far into the hero we are, 0..1
let timer: ReturnType<typeof setInterval> | null = null;
let sleepTimer: ReturnType<typeof setTimeout> | null = null;
let step = 0;
let nextTime = 0;
let unlockedAt = 0;
let level = 0; // 0..1, follows the fade; drives the head nod
// decided at the start of every bar
let bar = { stage: 0, chorus: false, lead: false, fill: false, crash: false };
let lastStage = -1;

const rnd = Math.random;
/** A little human looseness: hit strength varies by about ±10%. */
const feel = (v: number) => v * (0.9 + rnd() * 0.2);

function driveCurve(amount: number) {
    const curve = new Float32Array(2048);
    for (let i = 0; i < curve.length; i++) curve[i] = Math.tanh(((i / (curve.length - 1)) * 2 - 1) * amount);
    return curve;
}

function filter(type: BiquadFilterType, freq: number, q = 0.7, gain = 0) {
    const f = ctx!.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    f.gain.value = gain;
    return f;
}

function gainNode(value: number) {
    const g = ctx!.createGain();
    g.gain.value = value;
    return g;
}

/** Send some of a sound to the room reverb. */
function toRoom(node: AudioNode, amount: number) {
    node.connect(gainNode(amount)).connect(room!);
}

function build() {
    ctx = new AudioContext();
    const sr = ctx.sampleRate;

    // output: mix → tone filter (opens as you scroll in) → compressor → master volume
    mix = ctx.createGain();
    tone = filter("lowpass", 600, 0.5);
    const glue = ctx.createDynamicsCompressor();
    glue.threshold.value = -16;
    glue.ratio.value = 4;
    glue.attack.value = 0.006;
    glue.release.value = 0.18;
    master = gainNode(0);
    mix.connect(tone).connect(glue).connect(master).connect(ctx.destination);

    // a small room: decaying noise that gets duller as it fades, different in each ear
    const tail = ctx.createBuffer(2, Math.floor(sr * 1.5), sr);
    for (let ch = 0; ch < 2; ch++) {
        const d = tail.getChannelData(ch);
        let last = 0;
        for (let i = 0; i < d.length; i++) {
            const t = i / d.length;
            last += (rnd() * 2 - 1 - last) * (0.55 - 0.4 * t);
            d[i] = last * Math.pow(1 - t, 3.2);
        }
    }
    room = ctx.createConvolver();
    room.buffer = tail;
    room.connect(gainNode(0.5)).connect(mix);

    // two rhythm guitars, one in each ear: overdrive, then a speaker-cabinet shape
    guitars = [-0.65, 0.65].map((pan) => {
        const input = gainNode(1);
        const amp = ctx!.createWaveShaper();
        amp.curve = driveCurve(9);
        amp.oversample = "4x";
        const panner = ctx!.createStereoPanner();
        panner.pan.value = pan;
        const cab = gainNode(0.13);
        input
            .connect(amp)
            .connect(filter("highpass", 85))
            .connect(filter("peaking", 2400, 1, 5))
            .connect(filter("lowpass", 4700))
            .connect(filter("lowpass", 4700))
            .connect(cab)
            .connect(panner)
            .connect(mix!);
        toRoom(cab, 0.25);
        return input;
    });

    // lead guitar: smoother drive, an echo three sixteenths long, and more room
    lead = gainNode(1);
    const leadAmp = ctx.createWaveShaper();
    leadAmp.curve = driveCurve(5);
    leadAmp.oversample = "4x";
    const leadOut = gainNode(0.1);
    lead.connect(leadAmp).connect(filter("highpass", 200)).connect(filter("lowpass", 3600)).connect(leadOut).connect(mix);
    const echo = ctx.createDelay(1);
    echo.delayTime.value = STEP * 3;
    const again = gainNode(0.33);
    leadOut.connect(echo);
    echo.connect(again).connect(echo);
    echo.connect(gainNode(0.45)).connect(mix);
    toRoom(leadOut, 0.6);

    bass = gainNode(1);
    bass.connect(filter("lowpass", 520)).connect(gainNode(0.55)).connect(mix);

    noise = ctx.createBuffer(1, sr, sr);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = rnd() * 2 - 1;
}

/** A gain node that jumps to `peak` at `t` and dies away over `length` seconds. */
function hit(t: number, peak: number, length: number, out: AudioNode) {
    const g = ctx!.createGain();
    g.gain.setValueAtTime(peak, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + length);
    g.connect(out);
    return g;
}

function osc(t: number, type: OscillatorType, freq: number, length: number, out: AudioNode, cents = 0) {
    const o = ctx!.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    o.detune.value = cents;
    o.connect(out);
    o.start(t);
    o.stop(t + length + 0.03);
    return o;
}

function noiseInto(t: number, length: number, out: AudioNode) {
    const src = ctx!.createBufferSource();
    src.buffer = noise;
    src.connect(out);
    src.start(t, rnd() * 0.5);
    src.stop(t + length + 0.03);
}

/* ── drums ── */

function kick(t: number, v: number) {
    const o = osc(t, "sine", 125, 0.3, hit(t, 0.8 * v, 0.3, mix!));
    o.frequency.exponentialRampToValueAtTime(46, t + 0.075);
    // the beater: a tiny click on top of the thump
    const click = filter("highpass", 2200);
    click.connect(hit(t, 0.28 * v, 0.012, mix!));
    noiseInto(t, 0.012, click);
}

function snare(t: number, v: number) {
    // wires: bright noise; shell: two tones that drop a little
    const wires = filter("highpass", 1600);
    const out = hit(t, 0.5 * v, 0.19, mix!);
    wires.connect(filter("peaking", 3800, 1, 4)).connect(out);
    noiseInto(t, 0.19, wires);
    toRoom(out, 0.4);
    for (const f of [186, 332]) {
        const o = osc(t, "triangle", f * 1.25, 0.1, hit(t, 0.32 * v, 0.1, mix!));
        o.frequency.exponentialRampToValueAtTime(f, t + 0.04);
    }
}

// Cymbals: six square waves at clashing pitches make the metal ring; noise adds the sizzle.
const METAL = [205, 304, 369, 522, 540, 800];

function cymbal(t: number, v: number, length: number, centre: number, wash: number) {
    const body = filter("bandpass", centre, 0.8);
    const out = hit(t, v, length, mix!);
    body.connect(filter("highpass", 6500)).connect(out);
    for (const f of METAL) osc(t, "square", f * 1.9, length, body);
    const sizzle = filter("highpass", 8000);
    sizzle.connect(hit(t, v * wash, length, mix!));
    noiseInto(t, length, sizzle);
    return out;
}

// The closed hat plays on almost every eighth note, so it is kept cheap: filtered noise only.
function hat(t: number, v: number) {
    const tick = filter("highpass", 8200);
    tick.connect(filter("peaking", 10500, 1.5, 6)).connect(hit(t, 0.16 * v, 0.045, mix!));
    noiseInto(t, 0.045, tick);
}
const openHat = (t: number, v: number) => toRoom(cymbal(t, 0.075 * v, 0.32, 9500, 1), 0.2);
const crash = (t: number) => toRoom(cymbal(t, 0.16, 1.5, 7000, 1.3), 0.5);

function tom(t: number, freq: number, v: number) {
    const out = hit(t, 0.6 * v, 0.26, mix!);
    const o = osc(t, "sine", freq * 1.6, 0.26, out);
    o.frequency.exponentialRampToValueAtTime(freq, t + 0.06);
    toRoom(out, 0.35);
}

/* ── guitars and bass ── */

/** A power chord (root, fifth, octave) on both rhythm guitars. Muted notes are short and dark. */
function chord(t: number, root: number, open: boolean, length: number, v: number) {
    guitars.forEach((input, side) => {
        // the second guitar is a separate "take": a few milliseconds late and tuned a hair differently
        const at = t + (side ? 0.004 + rnd() * 0.009 : rnd() * 0.004);
        const env = ctx!.createGain();
        env.gain.setValueAtTime(0.0001, at);
        env.gain.linearRampToValueAtTime(v, at + 0.004);
        if (open) {
            env.gain.linearRampToValueAtTime(v * 0.7, at + length * 0.8);
            env.gain.linearRampToValueAtTime(0.0001, at + length);
        } else {
            env.gain.exponentialRampToValueAtTime(0.0005, at + length);
        }
        const mute = filter("lowpass", open ? 7000 : 2600);
        if (!open) mute.frequency.exponentialRampToValueAtTime(480, at + 0.07);
        mute.connect(env).connect(input);
        [1, 1.498, 2].forEach((ratio, n) => {
            const string = gainNode([1, 0.8, 0.6][n]);
            string.connect(mute);
            osc(at, "sawtooth", root * ratio, length, string, (rnd() - 0.5) * 14);
        });
    });
}

function bassNote(t: number, freq: number, length: number, v: number) {
    const out = hit(t, 0.5 * v, length, bass!);
    osc(t, "sawtooth", freq, length, out);
    osc(t, "triangle", freq, length, out);
}

/** One lead note: two detuned waves, with vibrato that comes in once the note is held. */
function leadNote(t: number, freq: number, length: number) {
    const env = ctx!.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(0.9, t + 0.012);
    env.gain.linearRampToValueAtTime(0.6, t + length * 0.85);
    env.gain.linearRampToValueAtTime(0.0001, t + length);
    env.connect(lead!);
    const wobble = osc(t, "sine", 5.6, length, ctx!.createGain());
    const depth = ctx!.createGain();
    depth.gain.setValueAtTime(0, t);
    depth.gain.linearRampToValueAtTime(length > 0.5 ? 14 : 4, t + Math.min(length, 0.5));
    wobble.disconnect();
    wobble.connect(depth);
    [osc(t, "sawtooth", freq, length, env, -5), osc(t, "square", freq, length, env, 6)].forEach((o) => depth.connect(o.detune));
}

/* ── the arrangement ── */

function playStep(i: number, t: number) {
    const s = i % BAR;
    const barNo = Math.floor(i / BAR);

    if (s === 0) {
        const stage = intensity < RIFF_AT ? 0 : intensity < CHORUS_AT ? 1 : intensity < LEAD_AT ? 2 : 3;
        // stage 2 trades four bars of verse for four of chorus; stage 3 stays on the chorus
        const chorus = stage === 3 || (stage === 2 && barNo % 8 >= 4);
        bar = {
            stage,
            chorus,
            lead: stage === 3,
            fill: stage >= 1 && barNo % 4 === 3,
            crash: stage >= 1 && (stage !== lastStage || barNo % 4 === 0) && (chorus || stage !== lastStage || barNo % 8 === 0),
        };
        lastStage = stage;
    }
    const { stage, chorus } = bar;
    // drums land a few milliseconds early or late, never on a grid
    const loose = t + (rnd() - 0.5) * 0.007;
    const inFill = bar.fill && s >= 12;

    // kick
    const kicks = stage === 0 ? [0, 8] : chorus ? [0, 6, 8, 14] : barNo % 2 ? [0, 8, 10] : [0, 6, 8];
    if (kicks.includes(s) && !(inFill && s > 12)) kick(s === 0 ? t : loose, feel(s % 8 ? 0.8 : 1));

    // snare on 2 and 4, a soft ghost note before some bars, and a tom run to end each phrase
    if (stage >= 1) {
        if (s === 4 || s === 12) snare(loose, feel(1));
        if (s === 15 && barNo % 2 && !inFill) snare(loose, feel(0.2));
        if (inFill && s > 12) {
            tom(loose, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 175, 132, 98][s], feel(1));
            if (s === 15) snare(loose + STEP * 0.5, feel(0.7));
        }
    }
    if (bar.crash && s === 0) crash(t);

    // hats: tight eighths in the verse, open and washy on the beat in the chorus
    if (!inFill && s % 2 === 0) {
        const onBeat = s % 4 === 0;
        if (chorus && onBeat) openHat(loose, feel(1));
        else if (!chorus && s === 14 && barNo % 2) openHat(loose, feel(0.9));
        else hat(loose, feel(onBeat ? 1 : 0.6) * (stage === 0 ? 0.7 : 1));
    }

    // rhythm guitars and bass
    if (chorus) {
        const root = barNo % 4 === 3 && s >= 8 ? D3 : CHORUS[barNo % 4];
        const n = STRUMS.indexOf(s);
        if (n >= 0) chord(t, root, true, ((STRUMS[n + 1] ?? BAR) - s) * STEP * 0.97, feel(0.85));
        if (s % 2 === 0) bassNote(t, root / 2, STEP * 1.8, feel(s % 4 ? 0.8 : 1));
    } else if (s % 2 === 0) {
        const [root, open] = VERSE[barNo % 2][s / 2];
        if (stage >= 1) chord(t, root, open, open ? STEP * 1.9 : STEP * 1.5, feel(s % 4 ? 0.7 : 0.9));
        bassNote(t, stage >= 1 ? root : E2, STEP * 1.7, feel(s % 4 ? 0.8 : 1));
    }

    // lead guitar over the chorus
    if (bar.lead) {
        for (const [at, note, length] of LEAD[barNo % 4]) if (at === s) leadNote(t, note, length * STEP * 0.96);
    }
}

function schedule() {
    if (!ctx) return;
    // queue everything due in the next 0.15s; the audio clock does the exact timing
    while (nextTime < ctx.currentTime + 0.15) {
        playStep(step, nextTime);
        step++;
        nextTime += STEP;
    }
}

/** The whole mix starts muffled, as if heard through a wall, and opens up over the first part of the hero. */
function openTone() {
    if (!ctx || !tone) return;
    const open = Math.min(1, intensity / (RIFF_AT * 1.3));
    tone.frequency.setTargetAtTime(600 * Math.pow(18000 / 600, open), ctx.currentTime, 0.25);
}

function apply() {
    if (!ctx || !master) return;
    const on = wanted && !state.muted && !document.hidden;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setTargetAtTime(on ? VOLUME : 0, now, FADE / 3);

    if (on) {
        if (sleepTimer) clearTimeout(sleepTimer);
        sleepTimer = null;
        void ctx.resume();
        if (!timer) {
            // start on the first beat of a bar so the nod and the kick line up
            step = 0;
            lastStage = -1;
            openTone();
            nextTime = ctx.currentTime + 0.06;
            timer = setInterval(schedule, 50);
            schedule();
        }
    } else if (timer && !sleepTimer) {
        // once it has faded out, stop making sound altogether so nothing runs in the background
        sleepTimer = setTimeout(() => {
            sleepTimer = null;
            if (timer) clearInterval(timer);
            timer = null;
            void ctx?.suspend();
        }, FADE * 1000 * 3);
    }
}

function unlock() {
    if (state.unlocked) return;
    try {
        build();
    } catch {
        return; // no Web Audio here: stay silent
    }
    unlockedAt = performance.now();
    setState({ unlocked: true });
    apply();
}

let armed = false;

export const heroMusic = {
    /** Call once in the browser: restores the mute choice and waits for the first click, tap or key press. */
    arm() {
        if (armed || typeof window === "undefined") return;
        armed = true;
        try {
            if (localStorage.getItem("hero-sound") === "off") setState({ muted: true });
        } catch {}
        const first = () => {
            unlock();
            window.removeEventListener("pointerdown", first, true);
            window.removeEventListener("keydown", first, true);
        };
        window.addEventListener("pointerdown", first, true);
        window.addEventListener("keydown", first, true);
        document.addEventListener("visibilitychange", apply);
    },
    /** How far through the hero the visitor has scrolled (0..1). More of the band joins as this grows. */
    setIntensity(value: number) {
        intensity = Math.min(1, Math.max(0, value));
        openTone();
    },
    /** The hero tells us whether it is on screen and being scrolled. */
    setActive(active: boolean) {
        if (wanted === active) return;
        wanted = active;
        apply();
    },
    toggleMuted() {
        // the click that first unlocked sound should not also mute it
        if (performance.now() - unlockedAt < 400) return;
        const muted = !state.muted;
        setState({ muted });
        try {
            localStorage.setItem("hero-sound", muted ? "off" : "on");
        } catch {}
        apply();
    },
    /** 0..1: a sharp dip on every beat while the loop is audible. The character nods to it. */
    nod() {
        const on = !!ctx && !!timer && wanted && !state.muted;
        level += ((on ? 1 : 0) - level) * 0.05;
        if (!ctx || level < 0.01) return 0;
        const sinceStart = ctx.currentTime - (nextTime - step * STEP);
        const phase = (((sinceStart / (STEP * 4)) % 1) + 1) % 1;
        return level * Math.exp(-phase * 4.5);
    },
    subscribe(listener: () => void) {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    },
    getState: () => state,
};

export const HERO_MUSIC_SERVER_STATE: State = { muted: false, unlocked: false };
