import { setContext, getContext } from "svelte";

let vscode;

export class Note {
    _note = $state({});
    #id;
    #col = $state(1);
    #row = $state(1);
    #colSpan = $state(1);
    #rowSpan = $state(1);
    #color = $state("Yellow");
    #content = $state("");
    #lastEdit = $state(Date.now());
    #title = $state("");
    #type = $state("markdown");
    #displayTitle = $state(true);
    constructor(obj, id) {
        this.#id = id;
        this.#col = obj.col ?? 1;
        this.#row = obj.row ?? 1;
        this.#colSpan = obj.colSpan ?? 1;
        this.#rowSpan = obj.rowSpan ?? 1;
        this.#color = obj.color ?? "Yellow";
        this.#content = obj.content ?? "";
        this.#lastEdit = obj.lastEdit ?? Date.now();
        this.#title = obj.title ?? "";
        this.#type = obj.type ?? "markdown";
        this.#displayTitle = obj.type ?? true;
    }

    get id() {
        return this.#id;
    }

    get col() {
        return this.#col;
    }

    set col(col) {
        this._updateProp("col", col);
        this.#col = col;
    }

    get row() {
        return this.#row;
    }

    set row(row) {
        this._updateProp("row", row);
        this.#row = row;
    }

    get colSpan() {
        return this.#colSpan;
    }

    set colSpan(colSpan) {
        this._updateProp("colSpan", colSpan);
        this.#colSpan = colSpan;
    }

    get rowSpan() {
        return this.#rowSpan;
    }

    set rowSpan(rowSpan) {
        this._updateProp("rowSpan", rowSpan);
        this.#rowSpan = rowSpan;
    }

    get color() {
        return this.#color;
    }

    set color(color) {
        this._updateProp("color", color);
        this.#color = color;
    }

    get content() {
        return this.#content;
    }

    set content(content) {
        this._updateProp("content", content);
        this.#content = content;
    }

    get lastEdit() {
        return this.#lastEdit;
    }

    set lastEdit(lastEdit) {
        this._updateProp("lastEdit", lastEdit);
        this.#lastEdit = lastEdit;
    }

    get title() {
        return this.#title;
    }

    set title(title) {
        this._updateProp("title", title);
        this.#title = title;
    }

    get type() {
        return this.#type;
    }

    set type(type) {
        this._updateProp("type", type);
        this.#type = type;
    }

    get displayTitle() {
        return this.#displayTitle;
    }

    set displayTitle(displayTitle) {
        this._updateProp("displayTitle", displayTitle);
        this.#displayTitle = displayTitle;
    }

    _updateProp(prop, value) {
        console.log("updating", { prop: value });
        vscode.postMessage({
            type: "update",
            id: this.#id,
            prop: prop,
            value: value,
        });
    }

    //There must be a better way to do this :/
    updateState(newState) {
        if (newState.row != this.#row) {
            this.#row = newState.row;
        }

        if (newState.col != this.#col) {
            this.#col = newState.col;
        }

        if (newState.rowSpan != this.#rowSpan) {
            this.#rowSpan = newState.rowSpan;
        }

        if (newState.colSpan != this.#colSpan) {
            this.#colSpan = newState.colSpan;
        }

        if (newState.color != this.#color) {
            this.#color = newState.color;
        }

        if (newState.content != this.#content) {
            this.#content = newState.content;
        }

        if (newState.lastEdit != this.#lastEdit) {
            this.#lastEdit = newState.lastEdit;
        }

        if (newState.title != this.#title) {
            this.#title = newState.title;
        }

        if (newState.type != this.#type) {
            this.#type = newState.type;
        }
    }
}

export class PageSettings {
    #columns = $state(6);

    constructor(obj) {
        this.#columns = obj?.columns ?? 6;
    }

    get columns() {
        return this.#columns;
    }

    set columns(cols) {
        this.#columns = cols;
    }
}

export class Page {
    _page = $state({});
    #settings = $state();

    constructor(obj) {
        this.initNotes(obj);
    }

    get notes() {
        return this._page;
    }

    get settings() {
        return this.#settings;
    }

    addNoteMsg(col = 1, row = 1, colSpan = 1, rowSpan = 1, type = "markdown") {
        let toAdd = {
            col,
            row,
            colSpan,
            rowSpan,
            type,
            created: Date.now(),
        };

        vscode.postMessage({ type: "add", toAdd: toAdd });
    }

    addNote(id, obj) {
        this._page[id] = new Note(obj);
    }

    deleteNoteMsg(id) {
        vscode.postMessage({ type: "delete", id: id });
    }

    deleteNote(id) {
        delete this._page[id];
    }

    initNotes(obj) {
        for (let note in obj?.notes) {
            this._page[note] = new Note(obj.notes[note], note);
        }

        this.#settings = new PageSettings(obj?.settings);
    }

    noteList() {
        return Object.keys(this._page);
    }
}

const PAGE_KEY = Symbol("PAGE");

export function setPageState(vsCd) {
    vscode = vsCd;

    return setContext(PAGE_KEY, new Page());
}

export function getPageState() {
    return getContext(PAGE_KEY);
}
