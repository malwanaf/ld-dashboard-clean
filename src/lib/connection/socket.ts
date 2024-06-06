import {io} from 'socket.io-client';
import { dbstatus } from '$lib/stores/dbstatus';
import { updateStrikesResult } from '$lib/stores/strikes';

const socket = io("http://localhost:3000/");

socket.on("connect", () => {
    socket.on("getfirst", (data) => {
        if (data) {
            updateStrikesResult(data);
        }
    });

    socket.on("hasilnya", (data) => {
        if (data) {
            updateStrikesResult(data.data);
        }
    });

    console.log("svelte is connected");
    dbstatus.set("green");
});

socket.on("disconnect", () => {
    console.log("svelte is DISKONEK !!!");
    dbstatus.set("red");
});

export default socket;
