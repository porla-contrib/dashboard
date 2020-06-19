<script>
    export const toggle = () => { isOpen = !isOpen; };

    import {
        Button,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader
    } from 'sveltestrap';

    let addFiles = [];
    let isOpen = false;

    async function dropFileAsync(files) {
        for (const file of files) {
            const buffer = await file.arrayBuffer();
            addFiles = [ ...addFiles, { name: file.name, buffer: new Uint8Array(buffer) } ];
        }
    }

    const dropFile = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const files = Object.values(event.dataTransfer.items)
            .filter(itm => itm.kind === 'file')
            .map(itm => itm.getAsFile());

        dropFileAsync(files)
            .catch(err => console.error(err));
    }

    function dragOver(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    async function addTorrent() {
        for (const addFile of addFiles) {
            const tempBuffer = Array.prototype.map.call(addFile.buffer, function (ch) {
                return String.fromCharCode(ch);
            }).join('');

            const opts = {
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'addTorrentFile',
                    params: [ btoa(tempBuffer) ]
                }),
                headers: { 'Content-Type': 'application/json' },
                method: 'POST'
            };

            await fetch('/api/jsonrpc', opts);
        }

        addFiles = [];
        isOpen = false;
    }
</script>

<main>
    <Modal {isOpen} {toggle}>
        <ModalHeader {toggle}>Add torrent</ModalHeader>
        <ModalBody>
            {#if addFiles.length == 0}
            <div class="torrent-drop-zone" on:drop={dropFile} on:dragover={dragOver}>
                Drop .torrent(s) here
            </div>
            {:else}
            <ul class="torrent-file-list">
                {#each addFiles as addFile}
                    <li>{addFile.name}</li>
                {/each}
            </ul>
            {/if}
        </ModalBody>
        <ModalFooter>
            <Button disabled={addFiles.length === 0} on:click={addTorrent}>Add torrent</Button>
        </ModalFooter>
    </Modal>
</main>

<style>
.torrent-drop-zone {
    height: 100px;
    border: 5px dashed #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
}
</style>
