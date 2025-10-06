<script>
    import Note from "./Note.svelte";

    let { page, sortIndex, marked } = $props();

    let gridWidth = $state();

    let gridOffset = $derived((gridWidth - 16 * page.settings.columns) / page.settings.columns + 16);

    let cellWidth = $derived(((gridWidth ?? 0) - 16 * page.settings.columns) / page.settings.columns);

    let gridClientHeight = $state();

    let gridStyle = $derived(`background-size:${gridOffset}px ${gridOffset}px,${gridOffset}px ${gridOffset}px;`);

    let gridEle = $state();
    let gridEleInner = $state();

    let topRow = $state(12);

    let displayPreview = $state(false);

    let previewCol = $state(0);
    let previewRow = $state(0);
    let previewColSpan = $state(0);
    let previewRowSpan = $state(0);

    let maxTopRow = $derived(Math.max(topRow, Math.ceil(gridClientHeight / cellWidth) + 1));

    function checkGridScroll() {
        if (gridEle.scrollHeight < gridEle.scrollTop + gridEle.clientHeight + 300) {
            topRow++;
        }
    }

    let map = {};

    let mouseDownCol = 0;
    let mouseDownRow = 0;

    /**
     * Returns position of clicked cell of grid
     * @param clientX
     * @param clientY
     */
    function cellPosition(clientX, clientY, useInner = true, yOffset = 0) {
        let elementPos = useInner ? gridEleInner.getBoundingClientRect() : gridEle.getBoundingClientRect();
        let x = clientX - elementPos.left;
        let y = clientY - elementPos.top + yOffset;
        let colWidth = elementPos.width / page.settings.columns;
        let col = Math.floor(x / colWidth) + 1;
        let row = Math.floor(y / colWidth + 1);
        return [col, row];
    }

    let pasteHere = $state();
    let initMouseX = null;
    let initMouseY = null;

    function gridMouseDown(event) {
        pasteHere.focus();

        //note div click stops propagation to grid, only want left click to trigger
        if (event.button === 0 && event.target.id == "grid") {
            initMouseX = event.clientX;
            initMouseY = event.clientY;
            [mouseDownCol, mouseDownRow] = cellPosition(event.clientX, event.clientY);

            //add event listeners
            window.addEventListener("mouseup", gridMouseUp);
            gridEleInner.addEventListener("selectstart", disableSelect);
            gridEleInner.addEventListener("mousemove", gridMouseMove);
        }
    }

    //avoid selecting text whilst moving mouse around on grid whilst left click is depressed
    function disableSelect(event) {
        event.preventDefault();
    }

    function gridMouseMove(event) {
        let [col, row] = cellPosition(event.clientX, event.clientY);

        let colSpan = col - mouseDownCol;
        let rowSpan = row - mouseDownRow;

        let calcColSpan = Math.abs(colSpan) + 1;
        let calcRowSpan = Math.abs(rowSpan) + 1;

        let calcCol = colSpan < 0 ? mouseDownCol - calcColSpan + 1 : mouseDownCol;
        let calcRow = rowSpan < 0 ? mouseDownRow - calcRowSpan + 1 : mouseDownRow;

        updatePreview(calcCol, calcRow, calcColSpan, calcRowSpan, true);
    }

    /**
     *Create new note on mouse up from grid
     * @param {event} event
     */
    function gridMouseUp(event) {
        //note div click stops propagation to grid

        window.removeEventListener("mouseup", gridMouseUp);
        gridEleInner.removeEventListener("mousemove", gridMouseMove);
        gridEleInner.removeEventListener("selectstart", disableSelect);

        updatePreview(undefined, undefined, undefined, undefined, false);

        pasteHere.focus();

        //avoid adding note if mouse hasn't moved
        //a user may just want to click on the grid to exit the focused element and not want to add a new note
        if (event.clientX == initMouseX || event.clientY == initMouseY) {
            return;
        }

        let [col, row] = cellPosition(event.clientX, event.clientY);

        let colSpan = col - mouseDownCol;
        let rowSpan = row - mouseDownRow;

        let calcColSpan = Math.abs(colSpan) + 1;
        let calcRowSpan = Math.abs(rowSpan) + 1;

        let calcCol = colSpan < 0 ? mouseDownCol - calcColSpan + 1 : mouseDownCol;
        let calcRow = rowSpan < 0 ? mouseDownRow - calcRowSpan + 1 : mouseDownRow;

        //add note if note doesn't already occupy the position
        //store position of notes, to check against
        map = {};
        for (let note in page.notes) {
            for (let i = 0; i < page.notes[note].colSpan; i++) {
                for (let ii = 0; ii < page.notes[note].rowSpan; ii++) {
                    map[JSON.stringify([page.notes[note].col + i, page.notes[note].row + ii])] = undefined;
                }
            }
        }

        for (let i = 0; i < calcColSpan; i++) {
            for (let ii = 0; ii < calcRowSpan; ii++) {
                if (map.hasOwnProperty(JSON.stringify([calcCol + i, calcRow + ii]))) {
                    return;
                }
            }
        }
        page.addNoteMsg({ col: calcCol, row: calcRow, colSpan: calcColSpan, rowSpan: calcRowSpan });
    }

    let selectedNote = $state();

    let mvNote = $state(false);

    let mouseCol = $state();
    let mouseRow = $state();

    let newCol = $state();
    let newRow = $state();

    /**
     * store position of notes, to check against
     * @param {string} id
     */
    function initMap(id = null) {
        map = {};
        for (let note in page.notes) {
            //avoid adding this note to the map, as we still want to suggest it's current position
            if (note == id) {
                continue;
            }

            for (let i = 0; i < page.notes[note].colSpan; i++) {
                for (let ii = 0; ii < page.notes[note].rowSpan; ii++) {
                    map[JSON.stringify([page.notes[note].col + i, page.notes[note].row + ii])] = undefined;
                }
            }
        }
    }

    /**
     * Set up event listeners for updating note preview when moving mouse after clicking on move button
     * @param {string} id id of note to move
     * @param {Event} event mousemove event
     */
    function moveNote(id, event) {
        mvNote = true;
        event.preventDefault();
        event.stopPropagation();

        selectedNote = id;

        initMap(id);

        gridEle.addEventListener("pointermove", moveNoteNewPos);
        window.addEventListener("mouseup", stopMoveNote);

        //init new col and row
        newCol = page.notes[id].col;
        mouseCol = page.notes[id].col;
        newRow = page.notes[id].row;
        mouseRow = page.notes[id].row;

        updatePreview(newCol, newRow, page.notes[id].colSpan, page.notes[id].rowSpan, true);
    }

    /**
     * On mouseup event update move selected note to new position
     * @param {event} event
     */
    function stopMoveNote(event) {
        mvNote = false;
        event.preventDefault();
        event.stopPropagation();
        gridEle.removeEventListener("pointermove", moveNoteNewPos);
        window.removeEventListener("mouseup", stopMoveNote);

        //hide preview
        updatePreview(null, null, null, null, false);

        page.notes[selectedNote].col = newCol;
        page.notes[selectedNote].row = newRow;
    }

    /**
     * moves note preview to new position if required, based on cursor position
     * @param {event} event
     */
    function moveNoteNewPos(event) {
        let [newMouseCol, newMouseRow] = cellPosition(event.clientX, event.clientY, false, gridEle.scrollTop);

        newMouseCol += 1 - page.notes[selectedNote].colSpan;

        //only allow note to be moved within bounds of grid
        newMouseCol = Math.max(Math.min(newMouseCol, page.settings.columns), 1);
        newMouseRow = Math.max(newMouseRow, 1);

        //check if cursor columns have moved, don't bother recalculating if cursor hasn't moved cells
        if (mouseCol != newMouseCol || mouseRow != newMouseRow) {
            mouseCol = newMouseCol;
            mouseRow = newMouseRow;

            //calc new origin to
            [newCol, newRow] = getClosest(
                mouseCol,
                mouseRow,
                page.notes[selectedNote].colSpan,
                page.notes[selectedNote].rowSpan
            );

            console.log([newCol, newRow, page.notes[selectedNote].colSpan, page.notes[selectedNote].rowSpan]);

            updatePreview(newCol, newRow, page.notes[selectedNote].colSpan, page.notes[selectedNote].rowSpan, true);
        }
    }

    /**
     * Returns position of closest free space
     * based on https://gamedev.stackexchange.com/a/200756
     * @param {number} col
     * @param {number} row
     * @param {number} colSpan
     * @param {number} rowSpan
     * @returns {[number, number]} [col, row]
     */
    function getClosest(col, row, colSpan, rowSpan) {
        const directions = [
            [1, 1],
            [1, -1],
            [-1, 1],
            [-1, -1],
        ];
        //start at target position
        let queue = [[col, row]];
        let visited = {};
        while (queue.length) {
            let curNode = queue.shift();
            visited[JSON.stringify(curNode)] = undefined;
            //check if current cell is already occupied
            if (posOccupied(curNode[0], curNode[1], colSpan, rowSpan)) {
                return curNode;
            }

            //add adjacent cells to queue
            for (let direction of directions) {
                let nextNode = [direction[0] + curNode[0], direction[1] + curNode[1]];
                //avoid revisiting positions and going outside bounds
                if (
                    nextNode[0] > 0 &&
                    nextNode[1] > 0 &&
                    nextNode[0] <= page.settings.columns - (colSpan - 1) &&
                    !visited.hasOwnProperty(JSON.stringify(nextNode))
                ) {
                    queue.push(nextNode);
                }
            }
        }
        //return [1,1] by default, this shouldn't be required
        return [1, 1];
    }

    /**
     * Checks if position on grid is occupied by a note
     * @param {number} col
     * @param {number} row
     * @param {number} colSpan
     * @param {number} rowSpan
     */
    function posOccupied(col, row, colSpan, rowSpan) {
        for (let i = 0; i < colSpan; i++) {
            for (let ii = 0; ii < rowSpan; ii++) {
                if (map.hasOwnProperty(JSON.stringify([col + i, row + ii]))) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Update note preview
     * @param {number} col
     * @param {number} row
     * @param {number} colSpan
     * @param {number} rowSpan
     * @param {boolean} display Should preview be displayed?
     */
    function updatePreview(
        col = previewCol,
        row = previewRow,
        colSpan = previewColSpan,
        rowSpan = previewRowSpan,
        display = displayPreview
    ) {
        previewCol = col;
        previewRow = row;
        previewColSpan = colSpan;
        previewRowSpan = rowSpan;
        displayPreview = display;
    }

    /**
     * loads pasted note
     * @param {event} event
     */
    function pasteNote(event) {
        console.log(event);
        try {
            let pasteData = JSON.parse((event.clipboardData || window.clipboardData).getData("text"));

            //check if note is of valid format to avoid false positives
            if (
                pasteData &&
                pasteData.hasOwnProperty("type") &&
                pasteData.hasOwnProperty("colSpan") &&
                pasteData.hasOwnProperty("rowSpan") &&
                pasteData.hasOwnProperty("col") &&
                pasteData.hasOwnProperty("row") &&
                pasteData.hasOwnProperty("content") &&
                pasteData.hasOwnProperty("lastEdit")
            ) {
                initMap();
                [pasteData.col, pasteData.row] = getClosest(
                    pasteData.col,
                    pasteData.row,
                    pasteData.colSpan,
                    pasteData.rowSpan
                );

                page.addNoteMsg(pasteData);
            }

            //if cursor within range try to add note to mouse position
        } catch (e) {
            console.log("Failed to parse pasted data, data may not be for note");
        }
    }

    function movePasteHere(event) {
        //need to position element to cursor position, context menu paste
        //pasteHereLeft = event.clientX;
        //pasteHereTop = event.clientY;

        pasteHere.focus();
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div bind:this={gridEle} onscroll={checkGridScroll} class="grid-padding" bind:clientHeight={gridClientHeight}>
    <div
        bind:this={gridEleInner}
        id="grid"
        class="grid {displayPreview ? (mvNote ? 'moveNote' : 'resizeNote') : ''}"
        onmousedown={gridMouseDown}
        oncontextmenu={movePasteHere}
        style="grid-template-columns: repeat({page.settings.columns}, 1fr); {!sortIndex
            ? 'grid-auto-flow: row dense;'
            : ''} {gridStyle}; grid-auto-rows: {cellWidth}px;"
        bind:clientWidth={gridWidth}
    >
        <!--Notes-->
        {#each Object.keys(page.notes) as id (id)}
            <Note
                {sortIndex}
                {moveNote}
                {page}
                {id}
                note={page.notes[id]}
                {gridEle}
                {updatePreview}
                {displayPreview}
                {marked}
                {cellPosition}
            ></Note>
        {/each}
        <!--Note at end of grid-->
        <div style="grid-column:1 / 2; grid-row: {maxTopRow} / {maxTopRow + 1}; aspect-ratio: 1 / 1;"></div>
        {#if displayPreview}
            <div
                class="preview"
                style=" grid-column:{previewCol} / {previewCol + previewColSpan}; grid-row: {previewRow} / {previewRow +
                    previewRowSpan};"
            ></div>
        {/if}
    </div>
</div>
<div id="pasteHere" class="pasteHere" contenteditable="true" onpaste={pasteNote} bind:this={pasteHere}></div>

<style>
    .grid {
        width: 100%;
        display: grid;
        gap: 1rem 1rem;
        padding: 0.5rem;
        box-sizing: border-box;
        /*cursor: copy;*/
        background-color: var(--vscode-editor-background);
        border-bottom: 1px solid var(--vscode-editor-foreground);
        border-right: 1px solid var(--vscode-editor-foreground);
        background-image:
            linear-gradient(var(--vscode-editor-foreground) 1px, transparent 1px),
            linear-gradient(90deg, var(--vscode-editor-foreground) 1px, transparent 1px);
        background-position:
            0px 0px,
            0px 0px;
    }

    .grid.resizeNote {
        cursor: nw-resize;
    }

    .grid.moveNote {
        cursor: move;
    }

    .grid-padding {
        width: 100%;
        overflow-y: scroll;
        /*scrollbar-width: none;*/
    }

    .preview {
        border: 2px solid var(--vscode-editor-foreground);
        border-radius: 0.25rem;
        z-index: 1;
    }

    .pasteHere {
        width: 1px;
        height: 1px;
        text-rendering: optimizeSpeed;
        color: transparent;
        opacity: 0;
        position: absolute;
        z-index: -1;
        overflow: hidden;
        resize: none;
        display: block;
    }
</style>
