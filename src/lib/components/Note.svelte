<script>
    import katex from "katex";
    import DOMPurify from "dompurify";
    import { untrack } from "svelte";
    import NoteButtons from "./NoteButtons.svelte";
    import NoteSettings from "./NoteSettings.svelte";

    let {
        sortIndex = 1,
        moveNote,
        page,
        id = "",
        note,
        gridEle,
        updatePreview,
        displayPreview,
        marked,
        cellPosition,
    } = $props();

    let displayOptions = $state(false);

    /**
     * Returns timestamp in format DD/MM/YYYY HH:mm
     * @param {Number|Date}date
     */
    function timestamp(date) {
        let dt = new Date(date);
        return `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()} ${dt.getHours().toString()}:${dt.getMinutes().toString().padStart(2, "0")}`;
    }

    let lastEditEnum = $derived(timestamp(note.lastEdit));

    let createdEnum = $derived(timestamp(note.created));

    function resizeNote(event) {
        event.preventDefault();
        event.stopPropagation();
        console.log("clicked resize grabber");
        //add mouseup event listener
        gridEle.addEventListener("pointermove", resizeNoteOnMouseMove);
        window.addEventListener("mouseup", stopResizeNote);
        updatePreview(note.col, note.row, note.colSpan, note.rowSpan, true);
    }

    function stopResizeNote(event) {
        event.preventDefault();
        event.stopPropagation();
        gridEle.removeEventListener("pointermove", resizeNoteOnMouseMove);
        window.removeEventListener("mouseup", stopResizeNote);
        displayPreview = false;

        let [mouseCol, mouseRow] = cellPosition(event.clientX, event.clientY, false, gridEle.scrollTop);

        note.colSpan = Math.max(mouseCol - note.col, 0) + 1;
        note.rowSpan = Math.max(mouseRow - note.row, 0) + 1;

        updatePreview(note.col, note.row, note.colSpan, note.rowSpan, false);
    }

    function resizeNoteOnMouseMove(event) {
        let [mouseCol, mouseRow] = cellPosition(event.clientX, event.clientY, false, gridEle.scrollTop);

        updatePreview(
            note.col,
            note.row,
            Math.max(mouseCol - note.col, 0) + 1,
            Math.max(mouseRow - note.row, 0) + 1,
            true
        );
    }

    let initState = null;

    /**
     * Returns relative date string
     * @param {Date} date
     * @returns {string}
     */
    function relativeDate(date) {
        let curDate = new Date();
        let dt = new Date(date);
        let dtms = dt.getTime();
        let seconds = Math.round((curDate.getTime() - dt.getTime()) / 1000);

        if (seconds == 0) {
            return [1000, false, "Now"];
        }

        let prefix = "in ";
        let suffix = " ago";

        let offSet = 1000;
        let overDue = false;
        let text = "";

        if (seconds < 0) {
            seconds = seconds * -1;
            //provided date is before now
            suffix = "";
        } else {
            //provided date is after now
            prefix = "";
            overDue = true;
        }

        if (seconds < 60) {
            //seconds (1s->60s)
            offSet = 1000 - (dtms % 1000);
            text = seconds + "s";
        } else if (seconds < 60 * 5) {
            //minutes + seconds (1m->5m)
            offSet = 1000 - (dtms % 1000);
            text = Math.floor(seconds / 60) + "m " + (seconds % 60) + "s";
        } else if (seconds < 60 * 60) {
            //minutes (5m->60m)
            offSet = 1000 * 60 - (dtms % 1000) * 60;
            text = Math.floor(seconds / 60) + "m";
        } else if (seconds < 60 * 60 * 24) {
            //hours + minutes(1h->24h)
            offSet = 1000 * 60 - (dtms % 1000) * 60;
            text = Math.floor(seconds / (60 * 60)) + "h " + (Math.floor(seconds / 60) % 60) + "m";
        } else if (seconds < 60 * 60 * 24 * 7) {
            //days + hours (1d->7d)
            offSet = 1000 * 60 * 60 - (dtms % 1000) * 60 * 60;
            text = Math.floor(seconds / (60 * 60 * 24)) + "d " + (Math.floor(seconds / (60 * 60)) % 24) + "h";
        } else if (seconds < 60 * 60 * 24 * 365) {
            //days (7d->365d)
            offSet = 1000 * 60 * 60 * 24 - (dtms % 1000) * 60 * 60 * 24;
            text = Math.floor(seconds / (60 * 60 * 24)) + "d";
        } else {
            //years + days - ignores leap years
            offSet = 1000 * 60 * 60 * 24 - (dtms % 1000) * 60 * 60 * 24;
            text =
                Math.floor(seconds / (60 * 60 * 24 * 365)) + "y " + (Math.floor(seconds / (60 * 60 * 24)) % 365) + "d";
        }

        return [offSet, overDue, prefix + text + suffix];
    }

    let interval = $state();
    let offset = $state();
    let dueDateRelative = $state("");
    let overdue = $state(false);

    $effect(() => {
        if (note.dueDate) {
            [offset, overdue, dueDateRelative] = relativeDate(note.dueDate);
            untrack(() => {
                clearInterval(interval);
                updateInterval();
            });
        }
    });

    function updateInterval() {
        clearInterval(interval);
        interval = setInterval(() => {
            if (!note.dueDate) {
                clearInterval(interval);
                return;
            }

            let newOffset;
            [newOffset, overdue, dueDateRelative] = relativeDate(note.dueDate);
            if (offset != newOffset) {
                clearInterval(interval);
                offset = newOffset;
                updateInterval();
            }
        }, offset);
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
    onclick={(event) => {
        event.stopPropagation();
    }}
    role="note"
    class="note"
    style="border: 1px solid var(--vscode-terminal-ansi{note.color}); grid-column:{!sortIndex
        ? 'auto'
        : note.col} / {!sortIndex ? 'span ' + note.colSpan : note.col + note.colSpan}; grid-row: {!sortIndex
        ? 'auto'
        : note.row} / {!sortIndex ? 'span ' + note.rowSpan : note.row + note.rowSpan};"
    onmouseover={() => (displayOptions = true)}
    onfocus={() => (displayOptions = true)}
    onmouseout={() => (displayOptions = false)}
    onblur={() => (displayOptions = false)}
>
    <!-- aspect-ratio: {colSpan + (colSpan - rowSpan) * (16 / cellWidth)}} / {rowSpan + (rowSpan - colSpan) * (16 / cellWidth)}; -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="note-title"
        class:title-float={!note.displayTitle}
        style:border-bottom={note.displayTitle ? "1px solid var(--vscode-terminal-ansi" + note.color + ")" : ""}
    >
        <div class="titleText" style:min-width={note.displayTitle ? "3rem" : "0"}>
            {#if note.displayTitle}
                <input class="title-input" bind:value={note.title} placeholder="Title" />
            {/if}
        </div>

        <NoteButtons {moveNote} {note} {page} {id} {displayOptions}></NoteButtons>
    </div>
    {#if !note.displayTitle && (note.displayType == "edit" || note.displayType == "settings")}
        <div style="height:2.1rem; background-color: var(--vscode-notebook-cellEditorBackground);"></div>
    {/if}
    <div
        class="note-content"
        class:margin-right={note.displayType == "settings" || (note.displayType == "edit" && note.type == "image")}
        class:edit={note.displayType == "edit"}
        class:full-height={!note.displayTitle}
        class:center-content={note.type == "image" && note.displayType == ""}
    >
        {#if note.displayType == "edit"}
            {#if note.type == "image"}
                <input
                    class="input-field file-path full-width"
                    title="image filepath"
                    placeholder="images/image.png"
                    bind:value={note.content}
                />
                <p>
                    <label for="imageSizing">Columns</label>
                    <select name="imageSizing" bind:value={note.imageSizing} class="input-field">
                        <option value="contain">Contain</option><option value="center">Center</option>
                    </select>
                </p>

                <!--<div class="drop-zone" ondragover={() => {}}></div>-->
            {:else}
                <textarea
                    class="textbox"
                    bind:value={note.content}
                    spellcheck="true"
                    onfocus={() => {
                        initState = note.content;
                    }}
                    onfocusout={() => {
                        if (note.content != initState) {
                            note.lastEdit = Date.now();
                        }
                    }}
                    onkeydown={(e) => {
                        //if user presses tab insert 4 spaces rather than focusing next focusable element
                        if (e.key == "z" && (e.ctrlKey || e.metaKey)) {
                            console.log(e.key);
                            note.postUpdatesNow(true);
                        }

                        if (e.key == "Tab") {
                            e.preventDefault();
                            e.target.setRangeText("    ", e.target.selectionStart, e.target.selectionStart, "end");
                        }
                    }}
                >
                </textarea>
            {/if}
        {:else if note.displayType == "settings"}
            <NoteSettings {note}></NoteSettings>
        {:else if note.type == "tex"}
            {#await katex.renderToString( note.content, { throwOnError: false, displayMode: true, macros: page.settings.texMacros ? JSON.parse(page.settings.texMacros) : undefined } ) then cont}
                {@html DOMPurify.sanitize(cont)}
            {/await}
        {:else if note.type == "image"}
            {#if !note.content.length}
                <span>No image defined</span>
            {:else}
                <img
                    class="image"
                    class:contain-image={note.imageSizing == "contain"}
                    src={page.settings.baseUri + note.content}
                    alt="provided"
                />
            {/if}
        {:else}
            {#await marked.parse(note.content) then cont}
                {@html DOMPurify.sanitize(cont)}
            {/await}
        {/if}
    </div>
    <!--local string likely to break, it's likely a good idea to use a derived rune here-->
    <span
        class="note-date"
        title={"Created: " + createdEnum}
        class:edit={note.displayType == "edit" || note.displayType == "settings"}
        >{note.dueDate ? lastEditEnum + " | " : lastEditEnum}<span class:red={overdue}
            >{note.dueDate ? "Due " + dueDateRelative : ""}</span
        >
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            aria-label="resize note"
            class="resize-grab"
            class:hidden={!displayOptions}
            onmousedown={(event) => resizeNote(event)}
        ></div>
    </span>
</div>

<style>
    .textbox {
        box-sizing: border-box;
        border: 0;
        outline: 2px solid transparent;
        outline-offset: 2px;
        user-select: text;
        white-space: pre-wrap;
        word-break: break-word;
        width: 100%;
        height: 100%;
        background-color: transparent;
        resize: none;
        color: var(--vscode-editor-foreground);
    }

    .note-content {
        padding-left: 0.5rem;
        width: calc(100% - 0.5rem);
        height: calc(100% - 3.6rem);
        overflow-y: auto;
    }

    .note-content.edit {
        background-color: var(--vscode-notebook-cellEditorBackground);
    }

    .note-content.full-height {
        height: calc(100% - 1.5rem);
    }

    .note-content.margin-right {
        width: calc(100% - 1rem);
        padding-right: 0.5rem;
        background-color: var(--vscode-notebook-cellEditorBackground);
    }

    .note-content > textarea {
        padding: 0;
        display: block;
        padding-right: 0.5rem;
    }

    :root {
        --note-yellow: #fae96d;
        --note-green: #019b53;
        --note-blue: #0a5baa;
        --note-pink: #7a3f58;
        --note-grey: #8c8784;
    }

    .note {
        overflow: hidden;
        min-width: 0;
        position: relative;
        cursor: default;
        border-radius: 0.25rem;
        box-sizing: border-box;
        background-color: var(--vscode-editor-background);
    }

    .note:hover {
        z-index: 1;
    }

    .note-title {
        display: flex;
        /*justify-content: flex-end;*/
        align-items: center;
        height: 2.1rem;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
        padding-left: 0.5rem;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: thin;
        box-sizing: border-box;
    }

    .title-float {
        position: absolute;
        width: 100%;
    }

    .note-date {
        position: absolute;
        font-size: 0.75rem;
        bottom: 0;
        padding: 0.25rem;
        width: calc(100% - 0.5rem);
    }

    .note-date.edit {
        background-color: var(--vscode-notebook-cellEditorBackground);
    }

    .title-input {
        background: none;
        border: 0;
        border-radius: 2px;
        color: var(--vscode-editor-foreground);
        outline: 0;
        border: 1px solid transparent;
        height: 1.25rem;
        box-sizing: border-box;
        text-overflow: ellipsis;
        width: 100%;
    }

    .title-input:focus {
        color: var(--vscode-input-foreground);
        background-color: var(--vscode-input-background);
        border: 1px solid var(--vscode-focusBorder);
    }

    .resize-grab {
        position: absolute;
        bottom: -0.5rem;
        right: -0.5rem;
        height: 2rem;
        width: 2rem;
        cursor: nwse-resize;
        background: linear-gradient(
            -45deg,
            #0000 0 35%,
            var(--vscode-editor-foreground) 35% 38%,
            #0000 38% 43%,
            var(--vscode-editor-foreground) 43% 46%,
            #0000 46% 100%
        );
    }

    .note-title > div.titleText {
        display: flex;
        align-items: center;
        overflow-x: hidden;
        height: 2.1rem;
        width: calc(100% - 0.5rem);
        max-width: calc(100% - 0.5rem);
        justify-self: flex-start;
    }

    /*.note-title > div.titleText > span {
        position: absolute;
        white-space: nowrap;
        transform: translateX(0);
        cursor: text;
    }*/
    /*need to scroll to cursor position when user clicks on title input
    .note-title > div.titleText > span:focus {
        transform: translateX(0) !important;
        transition: none !important;
    }*/

    /*.drop-zone {
        color: var(--vscode-input-foreground);
        background-color: var(--vscode-input-background);
        outline-color: var(--vscode-focusBorder);
    }*/

    .image {
        padding-top: 1.5rem;
        box-sizing: border-box;
        object-fit: none;
    }

    .contain-image {
        width: calc(100% - 3px);
        height: calc(100% - 3px);
        object-fit: contain;
    }

    .input-field {
        color: var(--vscode-input-foreground);
        background-color: var(--vscode-input-background);
        outline-color: var(--vscode-focusBorder);
        height: 24px;
        padding: 3px 6px 3px 6px;
        box-sizing: border-box;
        border: 0;
        border-radius: 2px;
        flex: 1;
    }

    .full-width {
        width: 100%;
    }

    .file-path {
        margin-top: 0.5rem;
    }

    .center-content {
        display: flex;
        align-content: center;
    }

    .red {
        color: var(--vscode-terminal-ansiRed);
    }
</style>
