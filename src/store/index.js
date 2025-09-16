import { defineStore } from "pinia";

export const user = defineStore("user", {
    state: () => {
        return {
            name: "pinia",
        };
    },
    getters: {},
    actions: {
        setName(data) {
            this.name = data;
        },
    },
});