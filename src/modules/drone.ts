import * as Tone from 'tone';

let frequency = "A3";
let drone_oscillator: any = null;
let drone_is_running = false;

async function set_up_drone()
{
    if (Tone.context.state !== 'running') {
        await Tone.context.resume();
    }

    // make and start a 440hz sine tone
    drone_oscillator = new Tone.Oscillator(frequency, "sine4").toDestination();
    drone_oscillator.volume.value = -10;
}

async function start_drone()
{
    if (drone_is_running) return;
    await set_up_drone();
    drone_oscillator.start();
    drone_is_running = true;
}

function stop_drone()
{
    if (!drone_is_running) return;
    drone_oscillator.stop();
    drone_is_running = false;
}

function pitch_change(base_tone: string, amount_half_steps: number)
{
    frequency = Tone.Frequency(base_tone).transpose(amount_half_steps).toNote();
    if (drone_is_running) {
        stop_drone();
        start_drone();
    }
    return frequency;
}

function delta_pitch_change(amount_half_steps: number)
{
    frequency = Tone.Frequency(frequency).transpose(amount_half_steps).toNote();
    if (drone_is_running) {
        stop_drone();
        start_drone();
    }
    return frequency;
}

function toggle()
{
    if (drone_is_running)
        stop_drone();
    else
        start_drone();
}

function set_volume(vol: number)
{
    // vol -50 through 0
    drone_oscillator.volume.value = vol;
}

export { toggle, pitch_change, set_volume, delta_pitch_change };