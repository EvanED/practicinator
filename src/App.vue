<template>
    <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/config">Config</router-link> |

        <router-link to="/metronome">Metronome</router-link>
        <div style="width:0.5em; display:inline-block"></div>
        <input type="number" size="3" v-bind:value="bpm" @change="change_bpm">
        <button style="margin-left:0.5em" @click="toggle_metronome">{{metronome_next_state}}</button>
        {{bpm}}
        |

        <router-link to="/drone">Drone</router-link>
        <div style="width:0.5em; display:inline-block"></div>
        <input type="text" size="5" v-bind:value="pitch" @change="change_pitch">
        <button style="margin-left:0.5em" @click="toggle_drone">{{drone_next_state}}</button>
        {{pitch}}
        |

        <!--<router-link to="/music">Music</router-link> |-->
        <router-link to="/library">Library</router-link>
    </div>
    <router-view/>
</template>

<script language="ts">
import * as Metronome from "@/modules/metronome";
import * as Drone from "@/modules/drone";
import * as Midi from "@/modules/midi";

export default {
    name: 'hello',
    data () {
        return {
            dummy: Midi,
        };
    },
    computed: {
        bpm()   { return Metronome.status.bpm },
        pitch() { return Drone.status.pitch },
        metronome_next_state() { return Metronome.status.active ? "off" : "on"; },
        drone_next_state()     { return Drone.status.active     ? "off" : "on"; },
    },
    methods: {
        change_bpm(event) {
            const new_bpm = parseInt(event.target.value);
            Metronome.status.bpm = new_bpm;
        },
        change_pitch(event) {
            console.log("change_pitch");
            Drone.status.pitch = event.target.value;
        },
        toggle_metronome(event) {
            console.log("App:toggle_metronome");
            Metronome.status.active = !Metronome.status.active;
        },
        toggle_drone(event) {
            console.log("App:toggle_drone");
            const is_on = Drone.toggle();
        }
    }
}
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
