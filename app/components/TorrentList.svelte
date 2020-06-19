<script>
    import TorrentListItem from './TorrentListItem.svelte';

    const scheme = location.protocol == 'https'
        ? 'wss'
        : 'ws';

    const path = location.pathname.replace(/\/$/g, '');
    const url = `${scheme}://${location.host}${path}/api/events`;

    const ws = new WebSocket(url);
    ws.onmessage = function message(message) {
        if (!('data' in message)) {
            // TODO: what to do?
            return;
        }

        const data = JSON.parse(message.data);

        switch (data.event) {
            case 'init':
                torrents = [...torrents, ...data.torrents ]
                break;

            case 'torrent.added':
                torrents = [ ...torrents, data.torrent ];
                break;

            case 'torrent.removed':
                torrents = torrents.filter(t => t.infoHash !== data.torrent.infoHash);
                break;

            case 'torrents.updated':
                for (const torrent of data.torrents) {
                    const idx = torrents.findIndex(t => t.infoHash == torrent.infoHash);
                    if (idx > -1) {
                        torrents[idx] = torrent;
                    }
                }
                break;
        }
    }

    let torrents = [];
</script>

<main>
    <div id="torrent-list">
        <ul>
        {#each torrents as torrent}
            <li>
                <TorrentListItem torrent={torrent}></TorrentListItem>
            </li>
        {/each}
        </ul>
    </div>
</main>

<style>
#torrent-list ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
</style>
