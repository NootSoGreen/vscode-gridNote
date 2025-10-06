<script>
    let { note } = $props();

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

    /**
     * converts timestamp from local date to Date object format
     * @param {string} timestamp format YYYY-MM-DDTHH:MM
     */
    function timestampToDate(timestamp) {
        if (!timestamp) {
            return null;
        }

        let timestampArr = timestamp.split("T");
        let dateArr = timestampArr[0].split("-");
        let timeArr = timestampArr[1].split(":");
        let dateObj = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], timeArr[0], timeArr[1]);
        return dateObj;
    }

    /**
     * Converts date to timestamp format used by datetime-local
     * @param {Date} date
     */
    function dateToTimestamp(date) {
        //if date isn't yet set return null
        if (date === undefined || date === "") {
            return null;
        }
        let dateObj = new Date(date);
        return `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, "0")}-${dateObj.getDate().toString().padStart(2, "0")}T${dateObj.getHours().toString().padStart(2, "0")}:${dateObj.getMinutes().toString().padStart(2, "0")}`;
    }

    let dueDateTimestamp = $state(dateToTimestamp(note.dueDate));

    $effect(() => {
        let newTimestamp = timestampToDate(dueDateTimestamp);

        if (dateToTimestamp(note.dueDate) != dueDateTimestamp) {
            note.dueDate = newTimestamp;
        }
    });
</script>

{#if !note.displayTitle}
    <div style="height: 2.1rem;"></div>
{/if}
<div class="note-colors">
    {#each colors as selColor}
        <button
            aria-label="note color {note.color}"
            class="btn-color"
            class:selected={selColor == note.color}
            style="background-color: var(--vscode-terminal-ansi{selColor})"
            onclick={() => (note.color = selColor)}
        ></button>
    {/each}
</div>
<div class="note-settings-input">
    <label for="noteWidth">Width</label><input name="noteWidth" type="number" bind:value={note.colSpan} />
</div>
<div class="note-settings-input">
    <label for="noteHeight">Height</label><input name="noteHeight" type="number" bind:value={note.rowSpan} />
</div>
<div style="margin-bottom: 10px;">
    <label for="displayTitle"> Display Title Bar</label>
    <input type="checkbox" id="displayTitle" name="displayTitle" bind:checked={note.displayTitle} />
</div>
<div class="note-settings-input">
    <label for="displayTitle">Due Date</label>
    <!--calendar icon doesn't respect color style (╯°□°)╯︵ ┻━┻-->
    <!--It will respect "color-scheme: dark;" tho-->
    <input class="tableInput" type="datetime-local" bind:value={dueDateTimestamp} />
</div>

<style>
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

    button {
        padding: 0.25rem;
    }
</style>
