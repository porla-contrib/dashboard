<script>
    import {
        Dropdown,
        DropdownItem,
        DropdownMenu,
        DropdownToggle
    } from 'sveltestrap';
    
    import AddMagnetLinkModal from './components/AddMagnetLinkModal.svelte';
    import AddTorrentModal from './components/AddTorrentModal.svelte';
    import TorrentList from './components/TorrentList.svelte';

    let addMagnetLinkModal;
    let addTorrentModal;
    let isOpen = false;
</script>

<main>
    <div id="container">
        <div class="title-bar">
            <span>Porla</span>
            
            <Dropdown {isOpen} size="sm" toggle={() => (isOpen = !isOpen)}>
                <DropdownToggle caret>Actions</DropdownToggle>
                <DropdownMenu>
                    <DropdownItem on:click={() => addTorrentModal.toggle()}>Add torrent</DropdownItem>
                    <DropdownItem on:click={() => addMagnetLinkModal.toggle()}>Add magnet link</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>

        <TorrentList></TorrentList>
    </div>

    <AddMagnetLinkModal bind:this={addMagnetLinkModal}></AddMagnetLinkModal>
    <AddTorrentModal bind:this={addTorrentModal}></AddTorrentModal>
</main>

<style>
#container {
    margin: 50px auto;
    max-width: 480px;
}

.title-bar {
    align-items: center;
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #ccc;
    padding-bottom: 10px;
    margin-bottom: 10px;
}
</style>
