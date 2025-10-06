<script>
    let { moveNote, displayType, setDisplayType, note, page, id } = $props();

    import Tex from "./TeX.svelte";

    let displayTypes = $state(false);
</script>

<div class="note-buttons">
    <button title="move" aria-label="note move" class="note-move iconBtn" onmousedown={(event) => moveNote(id, event)}>
        <i class="codicon codicon-move"></i>
    </button>
    <button
        title="settings"
        aria-label="note settings"
        class="iconBtn"
        class:selected={displayType == "settings"}
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
        aria-label="copy note iconBtn"
        title="copy"
        class="iconBtn"
        onclick={() => {
            //copy note to clipboard
            navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
                if (result.state === "granted" || result.state === "prompt") {
                    navigator.clipboard.writeText(note.toString());
                }
            });
            console.log("copy");
        }}
    >
        <i class="codicon codicon-copy"></i>
    </button>
    <button
        aria-label="edit note iconBtn"
        title="edit"
        class="iconBtn"
        class:selected={displayType == "edit"}
        onclick={() => setDisplayType("edit")}
    >
        <i class="codicon codicon-edit"></i>
    </button>
    <span class="note-type-selector">
        <button
            title="Markdown"
            aria-label="note type markdown"
            class="iconBtn"
            class:hidden={!displayTypes && note.type != "markdown"}
            class:selected={note.type == "markdown" && displayTypes}
            onclick={() => {
                displayTypes = !displayTypes;
                note.type = "markdown";
                console.log({ displayTypes, type: note.type });
            }}
        >
            <i class="codicon codicon-markdown"></i>
        </button>
        <button
            title="TeX"
            aria-label="note type TeX"
            class="iconBtn"
            class:hidden={!displayTypes && note.type != "tex"}
            class:selected={note.type == "tex" && displayTypes}
            onclick={() => {
                displayTypes = !displayTypes;
                note.type = "tex";
                console.log({ displayTypes, type: note.type });
            }}
        >
            <Tex></Tex>
        </button>
        <button
            title="Image"
            aria-label="note type image"
            class="iconBtn"
            class:hidden={!displayTypes && note.type != "image"}
            class:selected={note.type == "image" && displayTypes}
            onclick={() => {
                displayTypes = !displayTypes;
                note.type = "image";
                console.log({ displayTypes, type: note.type });
            }}
        >
            <i class="codicon codicon-file-media"></i>
        </button>
    </span>
</div>

<style>
    .note-buttons {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 0;
        height: 2.1rem;
    }

    .note-buttons > button {
        margin-right: 0.25rem;
    }

    .note-type-selector {
        display: flex;
    }
</style>
