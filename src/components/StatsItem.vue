<template>
    <div class="level-item has-text-centered">
        <div>
            <p class="heading">{{ label }}</p>
            <p class="title">{{ value }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class StatsItem extends Vue {
    @Prop(String) private label!: string;
    @Prop(String) private value!: string;
}
</script>

