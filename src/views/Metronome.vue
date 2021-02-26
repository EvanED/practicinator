<template>
    <div class="about">
        <h1>This is an metronome page</h1>
    </div>
</template>

<script language="ts">
import * as Metronome from "@/modules/metronome";
import * as Drone from "@/modules/drone";
import * as Midi from "@/modules/midi";

export default {
    name: 'hello',
    data () {
        return {
            metronome: {
                bpm: 120,
                next_state: "on",
            },
            drone: {
                pitch: "A3",
                next_state: "on",
            },
            dummy: Midi,
        };
    },
    methods: {
        change_bpm(event) {
            const new_bpm = parseInt(event.target.value);
            Metronome.events.emit('set_bpm', new_bpm);
        },
        change_pitch(event) {
            console.log("change_pitch");
            this.drone.pitch = event.target.value;
            Drone.pitch_change(this.drone.pitch, 0);
        },
        toggle_metronome(event) {
            console.log("App:toggle_metronome");
            const is_on = Metronome.events.emit('toggle');
            this.metronome.next_state = is_on ? "off" : "on";
        },
        toggle_drone(event) {
            console.log("App:toggle_drone");
            const is_on = Drone.toggle();
            this.drone.next_state = is_on ? "off" : "on";
        }
    }
}
</script>
