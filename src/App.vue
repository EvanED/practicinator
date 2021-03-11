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
        <input type="text" size="5" v-bind:value="drone.pitch" @input="change_pitch">
        <button style="margin-left:0.5em" @click="toggle_drone">{{drone.next_state}}</button>
        {{drone.pitch}}
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
            drone: {
                pitch: "A3",
                next_state: "on",
            },
            dummy: Midi,
        };
    },
    computed: {
        bpm() { return Metronome.status.bpm },
        metronome_next_state() { return Metronome.status.active ? "off" : "on"; },
    },
    methods: {
        change_bpm(event) {
            const new_bpm = parseInt(event.target.value);
            Metronome.status.bpm = new_bpm;
        },
        change_pitch(event) {
            console.log("change_pitch");
            this.drone.pitch = event.target.value;
            Drone.pitch_change(this.drone.pitch, 0);
        },
        toggle_metronome(event) {
            console.log("App:toggle_metronome");
            Metronome.status.active = !Metronome.status.active;
        },
        toggle_drone(event) {
            console.log("App:toggle_drone");
            const is_on = Drone.toggle();
            this.drone.next_state = is_on ? "off" : "on";
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
