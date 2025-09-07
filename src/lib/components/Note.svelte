<script>
    import { marked } from "marked";
    import DOMPurify from "dompurify";
    import NoteOptions from "./NoteOptions.svelte";

    const options = ["markdown", "latex", "file-input"];

    let {
        sortIndex = 1,
        moveNote,
        page,
        id = "",
        note,
        gridEle,
        updatePreview,
        displayPreview,
    } = $props();

    let displayOptions = $state(false);
    let displayType = $state("");
    //DD/MM/YYYY HH:mm
    let lastEditEnum = $derived.by(() => {
        let lastEditDt = new Date(note.lastEdit);
        return `${lastEditDt.getDate()}/${lastEditDt.getMonth() + 1}/${lastEditDt.getFullYear()} ${lastEditDt.getHours().toString()}:${lastEditDt.getMinutes().toString().padStart(2, "0")}`;
    });

    let colors = ["Red", "Green", "Yellow", "Blue", "Magenta", "Cyan"];

    /*--vscode-terminal-ansiBlack: #073642;
    --vscode-terminal-ansiRed: #dc322f;
    --vscode-terminal-ansiGreen: #859900;
    --vscode-terminal-ansiYellow: #b58900;
    --vscode-terminal-ansiBlue: #268bd2;
    --vscode-terminal-ansiMagenta: #d33682;
    --vscode-terminal-ansiCyan: #2aa198;
    --vscode-terminal-ansiWhite: #eee8d5;
    --vscode-terminal-ansiBrightBlack: #002b36;
    --vscode-terminal-ansiBrightRed: #cb4b16;
    --vscode-terminal-ansiBrightGreen: #586e75;
    --vscode-terminal-ansiBrightYellow: #657b83;
    --vscode-terminal-ansiBrightBlue: #839496;
    --vscode-terminal-ansiBrightMagenta: #6c71c4;
    --vscode-terminal-ansiBrightCyan: #93a1a1;
    --vscode-terminal-ansiBrightWhite: #fdf6e3;*/

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

        let elementPos = gridEle.getBoundingClientRect();
        let x = event.clientX - elementPos.left;
        let y = event.clientY - elementPos.top + gridEle.scrollTop;

        let colWidth = elementPos.width / page.settings.columns;
        let mouseCol = Math.floor(x / colWidth) + 1;
        let mouseRow = Math.floor(y / colWidth + 1);

        note.colSpan = Math.max(mouseCol - note.col, 0) + 1;
        note.rowSpan = Math.max(mouseRow - note.row, 0) + 1;

        updatePreview(note.col, note.row, note.colSpan, note.rowSpan, false);
    }

    function resizeNoteOnMouseMove(event) {
        let elementPos = gridEle.getBoundingClientRect();
        let x = event.clientX - elementPos.left;
        let y = event.clientY - elementPos.top + gridEle.scrollTop;

        let colWidth = elementPos.width / page.settings.columns;
        let mouseCol = Math.floor(x / colWidth) + 1;
        let mouseRow = Math.floor(y / colWidth + 1);
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
        : note.col} / {!sortIndex
        ? 'span ' + note.colSpan
        : note.col + note.colSpan}; grid-row: {!sortIndex
        ? 'auto'
        : note.row} / {!sortIndex
        ? 'span ' + note.rowSpan
        : note.row + note.rowSpan};"
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
            <div class="note-options {displayOptions ? '' : 'hidden'}">
                <NoteOptions
                    {moveNote}
                    {displayType}
                    {setDisplayType}
                    lastEdit={note.lastEdit}
                    {page}
                    {id}
                ></NoteOptions>
            </div>
        </div>
    {/if}
    <div
        class="note-content {displayType == 'settings'
            ? 'margin-right'
            : ''}{displayType == 'edit' ? 'edit' : ''}"
    >
        {#if displayType == "edit"}
            <textarea
                style={note.displayTitle ? "" : "padding-top: 2.1rem;"}
                class="textbox"
                bind:value={note.content}
                onchange={() => (note.lastEdit = Date.now())}
            >
                {DOMPurify.sanitize(note.content)}
            </textarea>
        {:else if displayType == "settings"}
            {#if !note.displayTitle}
                <div style="height: 2.1rem;"></div>
            {/if}
            <div class="note-colors">
                {#each colors as selColor}
                    <button
                        aria-label="note color {note.color}"
                        class="btn-color {selColor == note.color
                            ? 'selected'
                            : ''}"
                        style="background-color: var(--vscode-terminal-ansi{selColor})"
                        onclick={() => (note.color = selColor)}
                    ></button>
                {/each}
            </div>
            <div class="note-settings-input">
                <label for="noteWidth">Width</label><input
                    name="noteWidth"
                    type="number"
                    bind:value={note.colSpan}
                />
            </div>
            <div class="note-settings-input">
                <label for="noteHeight">Height</label><input
                    name="noteHeight"
                    type="number"
                    bind:value={note.rowSpan}
                />
            </div>
            <div style="margin-bottom: 10px;">
                <label for="displayTitle"> Display Title Bar</label>
                <input
                    type="checkbox"
                    id="displayTitle"
                    name="displayTitle"
                    bind:checked={note.displayTitle}
                />
            </div>
        {:else}
            {#await marked.parse(note.content) then cont}
                {@html DOMPurify.sanitize(cont)}
            {/await}
        {/if}
    </div>
    <!--local string likely to break, it's likely a good idea to use a derived rune here-->
    <span class="note-date">{lastEditEnum}</span>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        aria-label="resize note"
        class="resize-grab"
        onmousedown={(event) => resizeNote(event)}
    ></div>
    {#if !note.displayTitle}
        <div
            class="note-options {displayOptions ? '' : 'hidden'}"
            style="background-color: var(--vscode-terminal-ansi{note.color});"
        >
            <NoteOptions
                {moveNote}
                {displayType}
                {setDisplayType}
                lastEdit={note.lastEdit}
                {page}
                {id}
            ></NoteOptions>
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

    .note-colors {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem;
        border-radius: 0.25rem;
        margin-top: 0.5rem;
        background-color: var(--vscode-input-background);
        margin-bottom: 10px;
    }

    .btn-color {
        border: 2px solid white;
    }

    .btn-color.selected {
        border: 2px solid black;
    }

    .note-settings-input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .note-settings-input > input {
        color: var(--vscode-input-foreground);
        background-color: var(--vscode-input-background);
        outline-color: var(--vscode-focusBorder);
        height: 24px;
        padding: 3px 6px 3px 6px;
        box-sizing: border-box;
        border: 0;
        border-radius: 2px;
        width: 100%;
        flex: 1;
    }

    .note-settings-input > label {
        padding-right: 6px;
    }

    .note-content {
        padding-left: 0.5rem;
        width: calc(100% - 0.5rem);
        height: calc(100% - 2.1rem);
        overflow-y: auto;
    }

    .note-content.edit {
        background-color: var(--vscode-notebook-cellEditorBackground);
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

    button {
        padding: 0.25rem;
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
        width: calc(100% - 1.6rem);
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
</style>
