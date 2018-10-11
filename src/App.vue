<template>
    <div id="app">
        <section class="section">
            <div class="container">
                <nav class="level">
                    <StatsItem label="Torrents" :value="torrents.length" />
                    <StatsItem label="DL. speed" :value="stats.downloadRate | toSpeed" />
                    <StatsItem label="UL. speed" :value="stats.uploadRate | toSpeed" />
                </nav>
            </div>
        </section>

        <section class="section" id="torrents">
            <div class="container">
                <table class="table is-fullwidth is-striped is-hoverable">
                    <thead>
                        <tr>
                            <th>Torrent</th>
                            <th style="width: 120px; text-align: right;">Size</th>
                            <th style="width: 25%;">Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="torrent in torrents" :key="torrent.infoHash">
                            <td>
                                {{ torrent.name }}<br />
                                <small>{{ torrent.savePath }}</small>
                            </td>
                            <td style="text-align: right; vertical-align: middle;">
                                {{ torrent.size | toFileSize }}
                            </td>
                            <td style="vertical-align: middle;">
                                <progress class="progress is-primary" max="100" :value="Math.ceil(torrent.progress * 100)"></progress>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import StatsItem from './components/StatsItem.vue';
import filesize from 'filesize';

interface Stats {
    downloadRate: number;
    uploadRate: number;
}

@Component({
    components: {
        StatsItem,
    },
    filters: {
        toFileSize(value: number) {
            if (isNaN(value)) {
                return '-';
            }

            return filesize(value);
        },

        toSpeed(value: number) {
            if (isNaN(value) || value <= 0) {
                return '-';
            }

            return `${filesize(value)}/s`;
        },
    },
})
export default class App extends Vue {
    private stats: Stats = {
        downloadRate: 0,
        uploadRate: 0,
    };

    private torrents: any[] = [];
    private ws?: WebSocket;

    private mounted(): void {
        const protocol = (window.location.protocol === 'https:') ? 'wss://' : 'ws://';
        const host = window.location.host;

        this.ws = new WebSocket(`${protocol}${host}/ws`);
        this.ws.onmessage = (message) => {
            const msg = JSON.parse(message.data);

            switch (msg.event) {
                case 'init':
                    this.torrents.push(...msg.torrents);
                    break;

                case 'torrentAdded':
                    this.torrents.push(msg.torrent);
                    break;

                case 'torrentRemoved':
                    const idx = this.torrents.find((val) => {
                        return val.infoHash === msg.infoHash;
                    });
                    this.torrents.splice(idx, 1);
                    break;

                case 'torrentsStatistics':
                    this.stats.downloadRate = msg.stats.downloadRate;
                    this.stats.uploadRate = msg.stats.uploadRate;
                    break;

                case 'torrentsUpdated':
                    for (const torrent of msg.torrents) {
                        const existing = this.torrents.find((val) => {
                            return val.infoHash === torrent.infoHash;
                        });

                        if (!existing) {
                            continue;
                        }

                        existing.name = torrent.name;
                        existing.progress = torrent.progress;
                        existing.savePath = torrent.savePath;
                        existing.size = torrent.size;
                    }
                    break;
            }
        };
    }
}
</script>
