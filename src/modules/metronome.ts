import * as Tone from 'tone';
import { reactive, watch, ref, toRefs } from 'vue'

let metronome_has_been_set_up = false;
let metronome_is_running = false;
let metronome_oscillator: any = null;

const current_status = reactive({
    active: false,
    bpm: 120,
    volume: -20,
});

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

watch(() => current_status.active, (new_value, old_value) => {
    if (new_value)
        start_metronome();
    else
        stop_metronome();
});

watch(() => current_status.bpm, (new_value, old_value) => {
    set_bpm(new_value);
});

watch(() => current_status.volume, (new_value, old_value) => {
    set_volume(new_value);
});

export {
    current_status as status,
};
