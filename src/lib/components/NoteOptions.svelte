<script>
    let { moveNote, displayType, setDisplayType, lastEdit, page, id } =
        $props();
</script>

<div class="note-options">
    <button
        title="move"
        aria-label="note move"
        class="note-move iconBtn"
        onmousedown={(event) => moveNote(id, event)}
    >
        <i class="codicon codicon-move"></i>
    </button>
    <button
        title="settings"
        aria-label="note settings"
        class="iconBtn {displayType == 'settings' ? 'selected' : ''}"
        onclick={() => setDisplayType("settings")}
    >
        <!--includes edit color, type, etc-->
        <i class="codicon codicon-settings-gear"></i>
    </button>
    <button
        title="delete"
        aria-label="delete note"
        class="iconBtn"
        onclick={() => {
            page.deleteNoteMsg(id);
        }}
    >
        <i class="codicon codicon-trash"></i>
    </button>
    <button
        aria-label="edit note iconBtn"
        title="edit"
        class="iconBtn {displayType == 'edit' ? 'selected' : ''}"
        onclick={() => setDisplayType("edit")}
    >
        <i class="codicon codicon-edit"></i>
    </button>
</div>

<style>
    .note-options {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 0;
        height: 2.1rem;
    }

    .note-options > button {
        margin-right: 0.25rem;
    }
</style>
