<script>
    export const toggle = () => { isOpen = !isOpen; };

    import {
        Button,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader
    } from 'sveltestrap';

    let isOpen = false;
    let magnetLink = null;
    $: isValidMagnetLink = (magnetLink && magnetLink.startsWith('magnet:?'))

    async function addMagnetLink() {
        const opts = {
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'addMagnetLink',
                params: [ magnetLink ]
            }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST'
        };

        await fetch('/api/jsonrpc', opts);

        magnetLink = null;
        isOpen = false;

    }
</script>

<main>
    <Modal {isOpen} {toggle}>
        <ModalHeader {toggle}>Add torrent</ModalHeader>
        <ModalBody>
            <input type="text" class="form-control form-control-sm magnet-link-input" placeholder="magnet:?xt=urn:btih:abc" bind:value={magnetLink}>
        </ModalBody>
        <ModalFooter>
            <Button disabled={!isValidMagnetLink} on:click={addMagnetLink}>Add magnet link</Button>
        </ModalFooter>
    </Modal>
</main>

<style>
.magnet-link-input {
    font-family: monospace;
}
</style>
