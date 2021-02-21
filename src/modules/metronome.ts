import * as Tone from 'tone';

let metronome_has_been_set_up = false;
let metronome_is_running = false;
let metronome_oscillator: any = null;

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
}

function stop_metronome()
{
    metronome_is_running = false;
    set_up_metronome();
    Tone.Transport.stop();
}

function toggle()
{
    console.log("Metronome.toggle");
    if (metronome_is_running)
        stop_metronome();
    else
        start_metronome();
}


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

export {
    start_metronome, stop_metronome, toggle, bpm_change, set_bpm, set_volume
};
