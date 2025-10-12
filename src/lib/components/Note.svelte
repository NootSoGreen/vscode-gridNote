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
    let displayType = $state("");

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

    let scrollLeft = $state(false);
    let scrollWidth = $state(0);
    let noteTitleWidth = $state();
    let noteTitleSpanWidth = $state();
    let transitionTime = $state(1);

    function scrollTitle() {
        //scrollWidth = span width / note width
        scrollWidth = noteTitleSpanWidth - noteTitleWidth;
        if (scrollWidth > 0) {
            //1s + 1s for every 100px
            transitionTime = 1 + scrollWidth / 100;
            //increase scroll width by width of 118px to account for note options
            scrollWidth += 118;
            scrollLeft = true;
        }
    }

    function setDisplayType(input) {
        displayType = displayType == input ? "" : input;
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
    {#if note.displayTitle}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            bind:clientWidth={noteTitleWidth}
            class="note-title"
            style="grid-template-columns: 1fr {displayOptions
                ? '118px'
                : ''}; border-bottom: 1px solid var(--vscode-terminal-ansi{note.color});"
            onmouseenter={() => {
                scrollTitle();
            }}
            onmouseleave={() => {
                scrollLeft = false;
            }}
        >
            <div class="titleText">
                <span
                    bind:clientWidth={noteTitleSpanWidth}
                    bind:innerHTML={note.title}
                    contenteditable="true"
                    style="{'transition:' + transitionTime + 's;'}{scrollLeft
                        ? 'transform: translateX(-' + scrollWidth + 'px);'
                        : ''}"
                ></span>
            </div>
            <div class="note-buttons" class:hidden={!displayOptions}>
                <NoteButtons {moveNote} {displayType} {setDisplayType} {note} {page} {id}></NoteButtons>
            </div>
        </div>
    {/if}
    <div
        class="note-content"
        class:margin-right={displayType == "settings" || (displayType == "edit" && note.type == "image")}
        class:edit={displayType == "edit"}
        class:full-height={!note.displayTitle}
        class:center-content={note.type == "image" && displayType == ""}
    >
        {#if displayType == "edit"}
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
                >
                </textarea>
            {/if}
        {:else if displayType == "settings"}
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
        class:edit={displayType == "edit" || displayType == "settings"}
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
    {#if !note.displayTitle}
        <div
            class="note-buttons"
            style="background-color: var(--vscode-terminal-ansi{note.color});"
            class:hidden={!displayOptions}
        >
            <NoteButtons {moveNote} {displayType} {setDisplayType} {note} {page} {id}></NoteButtons>
        </div>
    {/if}
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

    .note-content.full-height > textarea {
        padding-top: 2.1rem;
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
        display: grid;
        align-items: center;
        height: 2.1rem;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
        padding-left: 0.5rem;
        overflow: hidden;
        box-sizing: border-box;
    }

    /*note title place holder*/
    .note-title > div > span[contenteditable]:empty::before {
        content: "Title";
        color: #505050;
        /*TODO define a color to show that text can be updated*/
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
        position: relative;
        overflow-x: hidden;
        height: 2.1rem;
    }

    .note-title > div.titleText > span {
        position: absolute;
        white-space: nowrap;
        transform: translateX(0);
        cursor: text;
    }
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
