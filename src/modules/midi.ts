import * as Drone from '@/modules/drone';
import * as Metronome from '@/modules/metronome';

function on_midi_load_failed(...rest: any[])
{
    console.log("Could not access your MIDI devices");
    console.log(rest);
}


function midi_toggle_metronome()
{
    //Metronome.toggle();
}


function midi_toggle_drone()
{
    Drone.toggle();
}


function midi_vol_change(midi_message: any, module: any)
{
    const midi_vol = midi_message.data[2];
    const vol_scaled = midi_vol / 127 * 50;
    module.set_volume(-vol_scaled);
}


function midi_vol1_change(midi_message: any)
{
    midi_vol_change(midi_message, Metronome);
}


function midi_vol2_change(midi_message: any)
{
    midi_vol_change(midi_message, Drone);
}


function set_up_midi_mapping()
{
    const m = new Map();

    m.set("192-0", midi_toggle_metronome);
    m.set("192-1", midi_toggle_drone);

    //m.set("192-2", () => Metronome.bpm_change(-10));
    //m.set("192-3", () => Metronome.bpm_change(10));

    m.set("176-27", midi_vol1_change);
    m.set("176-7",  midi_vol2_change);

    m.set("192-5", () => Drone.delta_pitch_change(-1));
    m.set("192-6", () => Drone.delta_pitch_change(1));
    m.set("192-7", () => Drone.delta_pitch_change(-7));
    m.set("192-8", () => Drone.delta_pitch_change(7));

    return m;
}

const midi_messages = set_up_midi_mapping();


function on_midi_message(midi_message: any)
{
    console.log(midi_message);

    const key = midi_message.data[0] + "-" + midi_message.data[1];
    console.log(key);

    const handler = midi_messages.get(key);
    if (handler !== undefined) handler(midi_message);
}

function on_midi_loaded(midi_access: any)
{
    const inputs = midi_access.inputs;
    for (const input of inputs.values()) {
        input.onmidimessage = on_midi_message;
    }
}

function set_up_midi()
{
    if ('requestMIDIAccess' in navigator) {
        navigator.requestMIDIAccess().then(
            on_midi_loaded, on_midi_load_failed
        );
    }
}

set_up_midi()
