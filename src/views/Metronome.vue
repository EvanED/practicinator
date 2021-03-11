<template>
    <div class="about">
        <h1>This is an metronome page</h1>
    </div>
        <router-link to="/metronome">Metronome</router-link>
        <div style="width:0.5em; display:inline-block"></div>
        <input type="number" size="3" v-bind:value="bpm" @change="change_bpm">
        <button style="margin-left:0.5em" @click="toggle_metronome">{{next_state}}</button>
        {{bpm}}
</template>

<script language="ts">
import * as Metronome from "@/modules/metronome";

export default {
    name: 'hello',
    computed: {
        bpm() { return Metronome.status.bpm },
        next_state() { return Metronome.status.active ? "off" : "on"; },
    },
    methods: {
        change_bpm(event) {
            const new_bpm = parseInt(event.target.value);
            Metronome.status.bpm = new_bpm;
        },
        toggle_metronome(event) {
            console.log("App:toggle_metronome");
            Metronome.status.active = !Metronome.status.active;
        },
    }
}
</script>
