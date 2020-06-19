const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');
const WebSocketServer = require('ws').Server;

function mapTorrent(torrent) {
    return {
        infoHash: torrent.infoHash,
        name: torrent.name,
        savePath: torrent.savePath,
        progress: torrent.progress,
        state: torrent.state,
    }
}

module.exports = function dashboard(options) {
    options = options || {};

    const port = options.port || 3000;

    return function impl(porla) {
        const app = express();
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(bodyParser.json({ limit: '50mb' }));
        app.post('/api/jsonrpc', (req, res) => {
            const { method, params } = req.body;

            // TODO: Validate JSONRPC call

            switch (method) {
                case 'addMagnetLink':
                    if (Array.isArray(params)) {
                        porla.addMagnetLink(params[0], params[1] || {});
                    } else {
                        porla.addMagnetLink(params);
                    }
                    break;

                case 'addTorrentFile':
                    const buf = Buffer.from(params[0], 'base64');
                    const options = params[1] || {};
                    porla.addTorrent(buf, options);
                    break;

                case 'removeTorrent':
                    const infoHash = params[0];
                    const removeFiles = !!params[1];
                    porla.removeTorrent(infoHash, removeFiles);
                    break;
            }

            res.send('OK');
        });
        const server = http.createServer(app);
        
        const wss = new WebSocketServer({ server, path: '/api/events' });
        wss.on('connection', (socket) => {
            const torrents = Array.from(porla.torrents());

            const init = {
                event: 'init',
                torrents: torrents.map(mapTorrent)
            }

            socket.send(JSON.stringify(init));
        });

        porla.on('torrent.added', ({ torrent }) => {
            for (const client of wss.clients) {
                client.send(JSON.stringify({
                    event: 'torrent.added',
                    torrent: mapTorrent(torrent)
                }));
            }
        });

        porla.on('torrent.removed', ({ torrent }) => {
            for (const client of wss.clients) {
                client.send(JSON.stringify({
                    event: 'torrent.removed',
                    torrent: { infoHash: torrent.infoHash }
                }));
            }
        })

        porla.on('torrents.updated', ({ torrents }) => {
            const data = {
                event: 'torrents.updated',
                torrents: torrents.map(mapTorrent)
            }

            for (const socket of wss.clients) {
                socket.send(JSON.stringify(data));
            }
        });

        return new Promise((resolve, reject) => {
            server.listen(port || 3000, (err) => {
                if (err) return reject(err);
                porla.log.info(`Dashboard available at http://localhost:${port || 3000}`);
                resolve();
            });
        })
    }
}
