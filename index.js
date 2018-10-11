const express = require('express');
const path = require('path');
const { Plugin, Porla } = require('@porla/porla');
const http = require('http');
const WebSocketServer = require('ws').Server;

class DashboardPlugin extends Plugin {
    /**
     * @param {Object?} options Instance options.
     * @param {Number?} options.httpPort The HTTP port to serve the dashboard on.
     */
    constructor(options) {
        super();
        this._options = options || {};
    }

    /**
     * 
     * @param {Porla} porla
     */
    load(porla) {
        this.app = express();
        this.app.use('/', express.static(path.join(__dirname, '/dist')));
        this.app.get('*', function (request, response) {
            response.sendFile(path.resolve(__dirname, 'dist/index.html'));
        });

        this.server = http.createServer(this.app);

        this.wss = new WebSocketServer({
            path: '/ws',
            server: this.server
        });

        this.wss.on('connection', (socket) => {
            const torrents = Array.from(porla.torrents);
            const data = {
                event: 'init',
                torrents: torrents.map(val => {
                    return {
                        infoHash: val.infoHash,
                        name: val.name,
                        progress: val.progress,
                        savePath: val.savePath,
                        size: val.stats.sizeWanted
                    }
                })
            };

            socket.send(JSON.stringify(data));
            socket.inited = true;
        });

        porla.subscribe('torrent.added', [
            (arg) => this.onTorrentAdded(arg.torrent)
        ]);

        porla.subscribe('torrent.removed', [
            (arg) => this.onTorrentRemoved(arg.infoHash)
        ]);

        porla.subscribe('torrents.statistics', [
            (arg) => this.onTorrentsStatistics(arg.stats)
        ])

        porla.subscribe('torrents.updated', [
            (arg) => this.onTorrentsUpdated(arg.torrents)
        ]);

        return new Promise((resolve, reject) => {
            this.server.listen(this._options.httpPort || 3000, (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });
    }

    onTorrentAdded(torrent) {
        const data = {
            event: 'torrentAdded',
            torrent: {
                infoHash: torrent.infoHash,
                name: torrent.name,
                progress: torrent.progress,
                savePath: torrent.savePath,
                size: torrent.stats.sizeWanted
            }
        };

        this._broadcast(data);
    }

    onTorrentRemoved(infoHash) {
        const data = {
            event: 'torrentRemoved',
            infoHash: infoHash
        };

        this._broadcast(data);
    }

    onTorrentsStatistics(stats) {
        const data = {
            event: 'torrentsStatistics',
            stats: {
                downloadRate: stats.downloadPayloadRate,
                uploadRate: stats.uploadPayloadRate
            }
        };

        this._broadcast(data);
    }

    onTorrentsUpdated(torrents) {
        const data = {
            event: 'torrentsUpdated',
            torrents: torrents.map(val => {
                return {
                    infoHash: val.infoHash,
                    name: val.name,
                    progress: val.progress,
                    savePath: val.savePath,
                    size: val.stats.sizeWanted
                }
            })
        };

        this._broadcast(data);
    }

    _broadcast(data) {
        for (const client of this.wss.clients) {
            if (!client.inited) {
                continue;
            }

            client.send(JSON.stringify(data));
        }
    }
}

module.exports = DashboardPlugin;
