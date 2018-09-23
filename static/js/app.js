document.addEventListener('DOMContentLoaded', () => {
    new Vue({
        data: {
            stats: {
                downloadRate: 0,
                uploadRate: 0
            },
            torrents: [],
            ws: null
        },
        filters: {
            toFileSize: function (val) {
                if (isNaN(val)) {
                    return '-';
                }

                return filesize(val);
            },
            toSpeed: function (val) {
                if (isNaN(val) || val <= 0) {
                    return '-';
                }

                return `${filesize(val)}/s`;
            }
        },
        el: '#dash',
        created: function () {
            this.ws = new WebSocket(((window.location.protocol === 'https:') ? 'wss://' : 'ws://') + window.location.host + '/ws');

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
                        const idx = this.torrents.find(val => {
                            return val.infoHash === msg.infoHash
                        });
                        this.torrents.splice(idx, 1);
                        break;

                    case 'torrentsStatistics':
                        this.stats.downloadRate = msg.stats.downloadRate;
                        this.stats.uploadRate = msg.stats.uploadRate;
                        break;

                    case 'torrentsUpdated':
                        for (const torrent of msg.torrents) {
                            const existing = this.torrents.find(val => {
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
    });
});
