import * as Tone from 'tone';
import { reactive, watch, ref, toRefs } from 'vue'

const current_status = reactive({
    active: false,
    pitch: "A3",
})

let drone_oscillator: any = null;

async function set_up_drone()
{
    if (Tone.context.state !== 'running') {
        await Tone.context.resume();
    }

    // make and start a 440hz sine tone
    drone_oscillator = new Tone.Oscillator(current_status.pitch, "sine4").toDestination();
    drone_oscillator.volume.value = -10;
}

async function start_drone()
{
    await set_up_drone();
    drone_oscillator.start();
}

function stop_drone()
{
    drone_oscillator.stop();
}

function pitch_change(base_tone: string, amount_half_steps: number)
{
    current_status.pitch = Tone.Frequency(base_tone).transpose(amount_half_steps).toNote();
    return current_status.pitch;
}

function delta_pitch_change(amount_half_steps: number)
{
    current_status.pitch = Tone.Frequency(current_status.pitch).transpose(amount_half_steps).toNote();
    return current_status.pitch;
}

function toggle()
{
    current_status.active = !current_status.active;
    return current_status.active;
}

function set_volume(vol: number)
{
    // vol -50 through 0
    drone_oscillator.volume.value = vol;
}

watch(() => current_status.active, (new_value, old_value) => {
    if (new_value)
        start_drone();
    else
        stop_drone();
});

watch(() => current_status.pitch, (new_value, old_value) => {
    if (current_status.active) {
        stop_drone();
        start_drone();
    }
});

export { toggle, pitch_change, set_volume, delta_pitch_change, current_status as status };