<script>
    export let torrent;

    import TorrentItemActionList from './TorrentItemActionList.svelte';

    $: name = (torrent.name || torrent.infoHash);

    $: progress = parseInt(torrent.progress * 100, 10);

    $: state = (torrent) => {
        switch (torrent.state) {
            case 1: return 'Checking files';
            case 2: return 'Downloading metadata';
            case 3: return 'Downloading';
            case 4: return 'Finished';
            case 5: return 'Seeding';
            case 6: return 'Allocating';
            case 7: return 'Checking resume data';
        }

        return 'Unknown state';
    }
</script>

<main>
    <div class="torrent-list-item">
        <div class="storage">
            <div class="name">{ name }</div>
            <span class="save-path"><strong>@</strong> { torrent.savePath }</span>
        </div>
        <div class="status">
            <div class="state">
                <div class="state-description" title={state(torrent)}>{state(torrent)}</div>
                <div class="state-progress">{progress}%</div>
            </div>
            <progress max="100" value={progress}></progress>
        </div>
        <div class="actions">
            <TorrentItemActionList {torrent}></TorrentItemActionList>
        </div>
    </div>
</main>

<style>
.torrent-list-item {
    align-items: center;
    display: flex;
    padding: 4px;
}

.torrent-list-item:hover {
    background-color: #f0f0f0;
}

.torrent-list-item .storage {
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
}

.torrent-list-item .storage .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.torrent-list-item .storage .save-path {
    font-size: 12px;
}

.torrent-list-item .status {
    margin: 0 15px;
    font-size: 12px;
    width: 130px;
}

.torrent-list-item .status .state {
    white-space: nowrap;
    display: flex;
}

.torrent-list-item .status .state .state-description {
    flex-grow: 1;
    margin-right: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.torrent-list-item .status progress {
    width: 100%;
}
</style>
