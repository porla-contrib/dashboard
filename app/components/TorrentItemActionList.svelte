<script>
    export let torrent;

    import {
        Dropdown,
        DropdownItem,
        DropdownMenu,
        DropdownToggle
    } from 'sveltestrap';

    let isOpen = false;

    function removeTorrent() {
        const rpc = {
            jsonrpc: '2.0',
            id: 1,
            method: 'removeTorrent',
            params: [ torrent.infoHash ]
        };

        fetch('/api/jsonrpc', {
            body: JSON.stringify(rpc),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST'
        });
    }
</script>

<main>
    <Dropdown {isOpen} toggle={() => (isOpen = !isOpen)} size="sm">
        <DropdownToggle caret color="primary"></DropdownToggle>
        <DropdownMenu>
            <DropdownItem on:click={removeTorrent}>Remove</DropdownItem>
        </DropdownMenu>
    </Dropdown>
</main>