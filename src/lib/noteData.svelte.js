import { setContext, getContext } from "svelte";

let vscode;

/**
 * Class representing note
 */
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
    #created = $state(null);
    #title = $state("");
    #type = $state("markdown");
    #displayTitle = $state(true);
    #countUpdates = 0;
    #updates = {};
    #dueDate = $state(null);
    #imageSizing;

    /**
     * Create note
     * @param {Object} obj
     * @param {String} id
     */
    constructor(obj, id) {
        this.#id = id;
        this.#type = obj.type ?? "markdown";
        this.#col = obj.col ?? 1;
        this.#row = obj.row ?? 1;
        this.#colSpan = obj.colSpan ?? 1;
        this.#rowSpan = obj.rowSpan ?? 1;
        this.#color = obj.color ?? "Yellow";
        this.#content = obj.content ?? "";
        this.#lastEdit = obj.lastEdit ?? Date.now();
        this.#created = obj.created ?? Date.now();
        this.#title = obj.title ?? "";
        this.#displayTitle = obj.displayTitle ?? true;
        this.#imageSizing = obj.imageSizing ?? "contain";
        if (obj.dueDate) {
            this.#dueDate = new Date(obj.dueDate);
        }
    }

    /**
     * Id of note
     * @type {String}
     */
    get id() {
        return this.#id;
    }

    /**
     * x position of note (top left)
     * @type {Number}
     */
    get col() {
        return this.#col;
    }

    /**
     * x position of note (top left)
     * @param {Number} col
     */
    set col(col) {
        if (this.#col != col) {
            this._updateProp("col", col);
            this.#col = col;
        }
    }

    /**
     * y position of note (top left)
     * @type {Number}
     */
    get row() {
        return this.#row;
    }

    /**
     * y position of note (top left)
     * @param {Number} row
     */
    set row(row) {
        if (this.#row != row) {
            this._updateProp("row", row);
            this.#row = row;
        }
    }

    /**
     * Col Span of Note
     * @type {Number}
     */
    get colSpan() {
        return this.#colSpan;
    }

    /**
     * Row Span of Note
     * @param {Number} colSpan
     */
    set colSpan(colSpan) {
        if (this.#colSpan != colSpan) {
            this._updateProp("colSpan", colSpan);
            this.#colSpan = colSpan;
        }
    }

    /**
     * Row Span of Note
     * @type {Number}
     */
    get rowSpan() {
        return this.#rowSpan;
    }

    /**
     * Row Span of Note
     * @param {Number} rowSpan
     */
    set rowSpan(rowSpan) {
        if (this.#rowSpan != rowSpan) {
            this._updateProp("rowSpan", rowSpan);
            this.#rowSpan = rowSpan;
        }
    }

    /**
     * Note accent color
     * @type {String}
     */
    get color() {
        return this.#color;
    }

    /**
     * Note accent color
     * @param {String} color
     */
    set color(color) {
        if (this.#color != color) {
            this._updateProp("color", color);
            this.#color = color;
        }
    }

    /**
     * Main content of note
     * @type {String}
     */
    get content() {
        return this.#content;
    }

    /**
     * Main content of note
     * @param {String} content
     */
    set content(content) {
        if (this.#content != content) {
            this._updateProp("content", content);
            this.#content = content;
        }
    }

    /**
     * Timestamp of last edit
     * @type {Number}
     */
    get lastEdit() {
        return this.#lastEdit;
    }

    /**
     * Timestamp of last edit
     * @param {Number} lastEdit
     */
    set lastEdit(lastEdit) {
        if (this.#lastEdit != lastEdit) {
            this._updateProp("lastEdit", lastEdit);
            this.#lastEdit = lastEdit;
        }
    }

    /**
     * Timestamp of last edit
     * @type {Date}
     */
    get created() {
        return this.#created;
    }

    /**
     * Get title of note
     * @type {String}
     */
    get title() {
        return this.#title;
    }

    /**
     * Set Note's title
     * @param {String} title
     */
    set title(title) {
        if (this.#title != title) {
            this._updateProp("title", title);
            this.#title = title;
        }
    }

    /**
     * Get type of note
     * @type {String}
     */
    get type() {
        return this.#type;
    }

    /**
     * Set type of note, current expected types are markdown, tex, image
     * @param {String} type
     */
    set type(type) {
        console.log("set type to " + type);
        if (this.#type != type) {
            this._updateProp("type", type);
            this.#type = type;
        }
    }

    /**
     * Display title?
     * @type {Boolean}
     */
    get displayTitle() {
        return this.#displayTitle;
    }

    /**
     * Display title?
     * @param {Boolean} displayTitle
     */
    set displayTitle(displayTitle) {
        if (this.#displayTitle != displayTitle) {
            this._updateProp("displayTitle", displayTitle);
            this.#displayTitle = displayTitle;
        }
    }

    /**
     * Returns due date of note
     * @type {Date}
     */
    get dueDate() {
        return this.#dueDate;
    }

    /**
     * Sets due date
     * @param {Date} dueDate
     */
    set dueDate(dueDate) {
        if (this.#dueDate != dueDate) {
            this._updateProp("dueDate", dueDate);
            this.#dueDate = dueDate;
        }
    }

    /**
     * Returns image sizing
     * @type {String}
     */
    get imageSizing() {
        return this.#imageSizing;
    }

    /**
     * Sets image sizing
     * @param {String} imageSizing
     */
    set imageSizing(imageSizing) {
        if (this.#imageSizing != imageSizing) {
            this._updateProp("imageSizing", imageSizing);
            this.#imageSizing = imageSizing;
        }
    }

    /**
     * Send message to update property
     * @param {String} prop - property/key to update
     * @param {any} value
     */
    async _updateProp(prop, value) {
        console.log("updating", { prop, value });
        this.#updates[prop] = { path: ["notes", this.#id, prop], value: value };
        this.#countUpdates++;
        //'queue' updates
        setTimeout(() => {
            this.#countUpdates--;
            if (this.#countUpdates == 0) {
                vscode.postMessage({
                    type: "update",
                    data: Object.values(this.#updates),
                });
                this.#updates = {};
            }
        }, 500);
    }

    /**
     * Updates note - there must be a better way to do this :/
     * Can't just use setter as setter triggers update message, which we would want to avoid here
     * @param {Object} newState - object with updated properties of note
     */
    updateState(newState) {
        if (this.#row != newState.row) {
            this.#row = newState.row;
        }

        if (this.#col != newState.col) {
            this.#col = newState.col;
        }

        if (this.#rowSpan != newState.rowSpan) {
            this.#rowSpan = newState.rowSpan;
        }

        if (this.#colSpan != newState.colSpan) {
            this.#colSpan = newState.colSpan;
        }

        if (this.#color != newState.color) {
            this.#color = newState.color;
        }

        if (this.#content != newState.content) {
            this.#content = newState.content;
        }

        if (this.#lastEdit != newState.lastEdit) {
            this.#lastEdit = newState.lastEdit;
        }

        if (this.#title != newState.title) {
            this.#title = newState.title;
        }

        if (this.#type != newState.type) {
            this.#type = newState.type;
        }
    }
}

/**
 * Page Settings
 */
export class PageSettings {
    #columns = $state(6);
    #texMacros = $state("");
    #baseUri = $state("");
    #updates = {};
    #countUpdates = 0;

    /**
     * Init page settings
     * @param {Object} obj - object providing no. columns for page
     */
    constructor(obj) {
        this.#columns = obj?.columns ?? 6;
        this.#texMacros = obj?.texMacros ?? "";
    }

    /**
     * Get no. columns of page
     * @type {Number}
     */
    get columns() {
        return this.#columns;
    }

    /**
     * Set no. columns of page
     * @param {Number} cols
     */
    set columns(cols) {
        if (this.#columns != cols) {
            this._updateProp("columns", cols);
            this.#columns = cols;
        }
    }

    /**
     * Returns texMacros as a string
     * @type {String}
     */
    get texMacros() {
        return this.#texMacros;
    }

    /**
     * Sets texMacros
     * @param {String} texMacros
     */
    set texMacros(texMacros) {
        console.log({
            new: texMacros,
            old: this.#texMacros,
            same: this.#texMacros == texMacros,
        });

        if (this.#texMacros != texMacros) {
            this._updateProp("texMacros", texMacros);
            this.#texMacros = texMacros;
        }
    }

    /**
     * Returns baseUri to use with images
     * @type {String}
     */
    get baseUri() {
        return this.#baseUri;
    }

    /**
     * Sets baseUri, no need to store this
     * @param {String} baseUri
     */
    set baseUri(baseUri) {
        this.#baseUri = baseUri;
    }

    //consider moving this function to Page, then you could pass the function to the constructor of PageSettings and Note
    /**
     * Send message to update property
     * @param {String} prop - property/key to update
     * @param {any} value
     */
    async _updateProp(prop, value) {
        console.log("updating", { prop, value });
        this.#updates[prop] = { path: ["settings", prop], value: value };
        this.#countUpdates++;
        //'queue' updates
        setTimeout(() => {
            this.#countUpdates--;
            if (this.#countUpdates == 0) {
                vscode.postMessage({
                    type: "update",
                    data: Object.values(this.#updates),
                });
                this.#updates = {};
            }
        }, 500);
    }

    /**
     * Updates note - there must be a better way to do this :/
     * Can't just use setter as setter triggers update message, which we would want to avoid here
     * @param {Object} newState - object with updated properties of note
     */
    updateState(newState) {
        if (this.#columns != (newState.columns ?? 6)) {
            this.#columns = newState.columns;
        }

        if (this.#texMacros != (newState.texMacros ?? "")) {
            this.#texMacros = newState.texMacros;
        }
    }
}

/**
 * Page
 */
export class Page {
    _page = $state({});
    #settings = $state();

    /**
     * Init page - object can be passed when
     * @param {Object} obj - object providing notes of page
     */
    constructor(obj) {
        console.log("init_page");
        this.initNotes(obj);
    }

    /**
     * Notes Object
     * @type {Object}
     */
    get notes() {
        return this._page;
    }

    get settings() {
        return this.#settings;
    }

    /**
     * Adds new note
     *
     * @param {Number} [col=1] col
     * @param {Number} [row=1] row
     * @param {Number} [colSpan=1] colSpan
     * @param {Number} [rowSpan=1] rowSpan
     * @param {String} [type="markdown"] type
     */
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

    /**
     * Adds new note
     *
     * @param {String} id
     * @param {Object} obj
     */
    addNote(id, obj) {
        this._page[id] = new Note(obj, id);
    }

    /**
     * Sends message of note deletion
     *
     * @param {String} id
     */
    deleteNoteMsg(id) {
        vscode.postMessage({ type: "delete", id: id });
    }

    /**
     * Deletes note
     *
     * @param {String} id
     */
    deleteNote(id) {
        delete this._page[id];
    }

    /**
     * Initialises note
     *
     * @param {Object} obj
     */
    initNotes(obj) {
        console.log("notes init");
        for (let note in obj?.notes) {
            this._page[note] = new Note(obj.notes[note], note);
        }

        this.#settings = new PageSettings(obj?.settings);
    }

    /**
     * Returns notes in an array
     *
     * @returns {Array}
     */
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
