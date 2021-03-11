import * as Tone from 'tone';
import { reactive, watch, ref, toRefs } from 'vue'

const current_status = reactive({
    active: false,
    volume: -10, // vol -50 through 0
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

watch(() => current_status.volume, (new_value, old_value) => {
    drone_oscillator.volume.value = new_value;
});

export { toggle, delta_pitch_change, current_status as status };