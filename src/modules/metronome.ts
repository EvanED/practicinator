import * as Tone from 'tone';
import mitt from 'mitt';

let metronome_has_been_set_up = false;
let metronome_is_running = false;
let metronome_oscillator: any = null;

const listener = mitt();

async function set_up_metronome()
{
    if (Tone.context.state !== 'running') {
        await Tone.context.resume();
    }
    //StartAudioContext(Tone.context);

    if (metronome_has_been_set_up)
        return;
    
    metronome_has_been_set_up = true;
    metronome_oscillator = new Tone.Oscillator().toDestination();
    metronome_oscillator.volume.value = -20;

    // repeated event every 8th note
    Tone.Transport.scheduleRepeat((time) => {
        // use the callback time to schedule events
        metronome_oscillator.start(time).stop(time + 0.1);
    }, "8n");

    metronome_has_been_set_up = true;
}

async function start_metronome()
{
    if (metronome_is_running) return;
    await set_up_metronome();
    Tone.Transport.start();
    metronome_is_running = true;
    console.log(metronome_is_running)
}

function stop_metronome()
{
    metronome_is_running = false;
    set_up_metronome();
    Tone.Transport.stop();
}

function toggle()
{
    console.log("Metronome.toggle with is running " + metronome_is_running);
    if (metronome_is_running) {
        stop_metronome();
        return false;
    }
    else {
        start_metronome();
        return true;
    }
}

listener.on('start',  () => start_metronome());
listener.on('stop',   () => stop_metronome());
listener.on('toggle', () => toggle());


function set_bpm(bpm: number)
{
    Tone.Transport.bpm.value = bpm;
}

function bpm_change(amount: number)
{
    Tone.Transport.bpm.value += amount;
}

function set_volume(vol: number)
{
    // vol -50 through 0
    metronome_oscillator.volume.value = vol;
}

listener.on('set_bpm',    (x) => set_bpm(x));
listener.on('bpm_change', (x) => bpm_change(x));
listener.on('set_volume', (x) => set_volume(x));

export {
    listener as events,
};
