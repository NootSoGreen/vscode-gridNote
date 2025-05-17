<script>
    import Note from "./Note.svelte";

    let { page, sortIndex } = $props();

    let gridWidth = $state();

    let gridOffset = $derived(
        (gridWidth - 16 * page.settings.columns) / page.settings.columns + 16
    );

    let cellWidth = $derived(
        ((gridWidth ?? 0) - 16 * page.settings.columns) / page.settings.columns
    );

    let gridClientHeight = $state();

    let gridStyle = $derived(
        `background-size:${gridOffset}px ${gridOffset}px,${gridOffset}px ${gridOffset}px;`
    );

    let gridEle = $state();
    let gridEleInner = $state();

    let topRow = $state(6);

    let displayPreview = $state(false);

    let previewCol = $state(0);
    let previewRow = $state(0);
    let previewColSpan = $state(0);
    let previewRowSpan = $state(0);

    let maxTopRow = $derived(
        Math.max(topRow, Math.ceil(gridClientHeight / cellWidth) + 1)
    );

    function checkGridScroll() {
        if (
            gridEle.scrollHeight <
            gridEle.scrollTop + gridEle.clientHeight + 300
        ) {
            topRow++;
        }
    }

    let map = {};

    let mouseDownCol = 0;
    let mouseDownRow = 0;

    function gridMouseDown(event) {
        //note div click stops propagation to grid
        if (event.target.id == "grid") {
            let elementPos = gridEleInner.getBoundingClientRect();
            let x = event.clientX - elementPos.left;
            let y = event.clientY - elementPos.top;
            let colWidth = elementPos.width / page.settings.columns;
            mouseDownCol = Math.floor(x / colWidth) + 1;
            mouseDownRow = Math.floor(y / colWidth + 1);

            //add event listener
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
        let elementPos = gridEleInner.getBoundingClientRect();
        let x = event.clientX - elementPos.left;
        let y = event.clientY - elementPos.top;
        let colWidth = elementPos.width / page.settings.columns;
        let col = Math.floor(x / colWidth) + 1;
        let row = Math.floor(y / colWidth + 1);

        let colSpan = col - mouseDownCol;
        let rowSpan = row - mouseDownRow;

        let calcColSpan = Math.abs(colSpan) + 1;
        let calcRowSpan = Math.abs(rowSpan) + 1;

        let calcCol =
            colSpan < 0 ? mouseDownCol - calcColSpan + 1 : mouseDownCol;
        let calcRow =
            rowSpan < 0 ? mouseDownRow - calcRowSpan + 1 : mouseDownRow;

        updatePreview(calcCol, calcRow, calcColSpan, calcRowSpan, true);
    }

    function gridMouseUp(event) {
        //note div click stops propagation to grid

        window.removeEventListener("mouseup", gridMouseUp);
        gridEleInner.removeEventListener("mousemove", gridMouseMove);
        gridEleInner.removeEventListener("selectstart", disableSelect);

        let elementPos = gridEleInner.getBoundingClientRect();
        let x = event.clientX - elementPos.left;
        let y = event.clientY - elementPos.top;
        let colWidth = elementPos.width / page.settings.columns;
        let col = Math.floor(x / colWidth) + 1;
        let row = Math.floor(y / colWidth + 1);

        let colSpan = col - mouseDownCol;
        let rowSpan = row - mouseDownRow;

        let calcColSpan = Math.abs(colSpan) + 1;
        let calcRowSpan = Math.abs(rowSpan) + 1;

        let calcCol =
            colSpan < 0 ? mouseDownCol - calcColSpan + 1 : mouseDownCol;
        let calcRow =
            rowSpan < 0 ? mouseDownRow - calcRowSpan + 1 : mouseDownRow;

        //add note if note doesn't already occupy the position
        //store position of notes, to check against
        map = {};
        for (let note in page.notes) {
            for (let i = 0; i < page.notes[note].colSpan; i++) {
                for (let ii = 0; ii < page.notes[note].rowSpan; ii++) {
                    map[
                        JSON.stringify([
                            page.notes[note].col + i,
                            page.notes[note].row + ii,
                        ])
                    ] = undefined;
                }
            }
        }

        updatePreview(undefined, undefined, undefined, undefined, false);

        for (let i = 0; i < calcColSpan; i++) {
            for (let ii = 0; ii < calcRowSpan; ii++) {
                if (
                    map.hasOwnProperty(
                        JSON.stringify([calcCol + i, calcRow + ii])
                    )
                ) {
                    return;
                }
            }
        }
        page.addNoteMsg(calcCol, calcRow, calcColSpan, calcRowSpan);
    }

    let selectedNote = $state();

    let mvNote = $state(false);

    let mouseCol = $state();
    let mouseRow = $state();

    let newCol = $state();
    let newRow = $state();

    function moveNote(id, event) {
        mvNote = true;
        event.preventDefault();
        event.stopPropagation();

        console.log("clicked move");
        console.log(id);
        selectedNote = id;

        //store position of notes, to check against
        map = {};
        for (let note in page.notes) {
            //avoid adding this note to the map, as we still want to suggest it's current position
            if (note == id) {
                continue;
            }

            for (let i = 0; i < page.notes[note].colSpan; i++) {
                for (let ii = 0; ii < page.notes[note].rowSpan; ii++) {
                    map[
                        JSON.stringify([
                            page.notes[note].col + i,
                            page.notes[note].row + ii,
                        ])
                    ] = undefined;
                }
            }
        }

        gridEle.addEventListener("pointermove", moveNoteNewPos);
        window.addEventListener("mouseup", stopMoveNote);

        //init new col and row
        newCol = page.notes[id].col;
        mouseCol = page.notes[id].col;
        newRow = page.notes[id].row;
        mouseRow = page.notes[id].row;

        updatePreview(
            newCol,
            newRow,
            page.notes[id].colSpan,
            page.notes[id].rowSpan,
            true
        );
    }

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

    function moveNoteNewPos(event) {
        let elementPos = gridEle.getBoundingClientRect();
        let x = event.clientX - elementPos.left;
        let y = event.clientY - elementPos.top + gridEle.scrollTop;

        let colWidth = elementPos.width / page.settings.columns;
        let newMouseCol =
            Math.floor(x / colWidth) + 2 - page.notes[selectedNote].colSpan;
        let newMouseRow = Math.floor(y / colWidth) + 1;
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

            updatePreview(
                newCol,
                newRow,
                page.notes[selectedNote].colSpan,
                page.notes[selectedNote].rowSpan,
                true
            );
        }
    }

    //based on https://gamedev.stackexchange.com/a/200756
    //returns [col, row] of closest free space
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
                let nextNode = [
                    direction[0] + curNode[0],
                    direction[1] + curNode[1],
                ];
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
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    bind:this={gridEle}
    onscroll={checkGridScroll}
    class="grid-padding"
    bind:clientHeight={gridClientHeight}
>
    <div
        bind:this={gridEleInner}
        id="grid"
        class="grid {displayPreview
            ? mvNote
                ? 'moveNote'
                : 'resizeNote'
            : ''}"
        onmousedown={gridMouseDown}
        style="grid-template-columns: repeat({page.settings
            .columns}, 1fr); {!sortIndex
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
            ></Note>
        {/each}
        <!--Note at end of grid-->
        <div
            style="grid-column:1 / 2; grid-row: {maxTopRow} / {maxTopRow +
                1}; aspect-ratio: 1 / 1;"
        ></div>
        {#if displayPreview}
            <div
                class="preview"
                style=" grid-column:{previewCol} / {previewCol +
                    previewColSpan}; grid-row: {previewRow} / {previewRow +
                    previewRowSpan};"
            ></div>
        {/if}
    </div>
</div>

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
            linear-gradient(
                var(--vscode-editor-foreground) 1px,
                transparent 1px
            ),
            linear-gradient(
                90deg,
                var(--vscode-editor-foreground) 1px,
                transparent 1px
            );
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
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        width: 100%;
        overflow-y: scroll;
        /*scrollbar-width: none;*/
    }

    .preview {
        border: 2px solid var(--vscode-editor-foreground);
        border-radius: 0.25rem;
        z-index: 1;
    }
</style>
