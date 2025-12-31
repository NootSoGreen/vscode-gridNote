<script>
    // @ts-ignore
    //import noteData from "../data/data.json";

    import Grid from "./lib/components/Grid.svelte";
    import { getPageState, setPageState } from "./lib/noteData.svelte";

    import SettingsMenu from "./lib/components/SettingsMenu.svelte";

    //import marked here to set base-url
    import { marked } from "marked";
    import { baseUrl } from "marked-base-url";

    const vscode = acquireVsCodeApi();

    //create notebook
    setPageState(vscode);
    const page = getPageState();

    let showSettings = $state(false);

    let sortIndex = $state(1);

    /**
     * Updates stored webview state
     * @param {String} prop
     * @param {any} update
     * @param {String} subProp
     */
    function updateState(prop, update, subProp = null) {
        let webviewState = vscode.getState();

        if (subProp !== null) {
            if (webviewState.hasOwnProperty(prop)) {
                if (typeof update == "object" || webviewState.noteDisplayTypes[prop][subProp] != update) {
                    webviewState[prop][subProp] = update;
                    vscode.setState(webviewState);
                }
            } else {
                webviewState[prop] = { [subProp]: update };
                vscode.setState(webviewState);
            }
        } else {
            if (webviewState.hasOwnProperty(prop)) {
                if (typeof update == "object" || webviewState.noteDisplayTypes[prop] != update) {
                    webviewState[prop] = update;
                    vscode.setState(webviewState);
                }
            } else {
                webviewState[prop] = update;
                vscode.setState(webviewState);
            }
        }
    }

    let paneWidth = $state(400);

    /**
     * Sets settings pane width with provided event (expected to be triggered on user adjusting pane width)
     * @param event
     */
    function adjustPane(event) {
        console.log({ pageX: event.pageX, innerWidth: window.innerWidth, width: window.innerWidth - event.pageX });
        paneWidth = Math.max(window.innerWidth - event.pageX + 2, 400);
        updateState("paneWidth", paneWidth);
    }

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", (event) => {
        console.log("message received");
        console.log(event);

        const message = event.data; // The json data that the extension sent
        const text = message.text;
        switch (message.type) {
            case "add":
                //text should be "{id: "<id>", obj: <Note_Obj>}"
                let toAdd = JSON.parse(text);
                page.addNote(toAdd.id, toAdd.obj);
                break;

            case "update":
                //text should be "{notes:[<noteId>: <Note_Obj>], settings: {columns: <+int>}}"
                let updatedPage = JSON.parse(text);

                console.log(updatedPage);

                let noteList = page.noteList();

                for (let note in updatedPage.notes) {
                    //if note already loaded, check for updated properties
                    if (noteList.includes(note)) {
                        page.notes[note].updateState(updatedPage.notes[note]);
                        //remove note from noteList, any notes left will be deleted
                        noteList.splice(noteList.indexOf(note), 1);
                    } else {
                        //new note, add it
                        page.addNote(note, updatedPage.notes[note], updateState);
                    }
                }

                for (let note of noteList) {
                    page.deleteNote(note);
                }

                // Update webview's content
                //page.initNotes(updatedPage);
                if (updatedPage.settings) {
                    page.settings.updateState(updatedPage.settings);
                }

                if (page.settings.baseUri != message.baseUri) {
                    page.settings.baseUri = message.baseUri;
                    marked.use(baseUrl(page.settings.baseUri));
                }

                let curState = vscode.getState();

                // Then persist state information.
                // This state is returned in the call to `vscode.getState` below when a webview is reloaded.
                vscode.setState({ text, baseUri: message.baseUri, noteDisplayTypes: curState?.noteDisplayTypes ?? {} });

                break;
            case "delete":
                //text should be just the id
                let toDelete = JSON.parse(text);
                page.deleteNote(toDelete);
                break;
            case "toggleSettings":
                showSettings = !showSettings;
                updateState("showSettings", showSettings);
                break;
            case "setSort":
                sortIndex = JSON.parse(text);
                updateState("sortIndex", sortIndex);
                break;
            case "image":
                let imagePath = JSON.parse(text);
                page.notes[imagePath.note].updateState({
                    filePath: imagePath.filePath,
                });
        }
    });

    // Webviews are normally torn down when not visible and re-created when they become visible again.
    // State lets us save information across these re-loads
    const st = vscode.getState();
    if (st) {
        page.initNotes(JSON.parse(st.text), st.baseUri, st.noteDisplayTypes, updateState);
        marked.use(baseUrl(st.baseUri));
        showSettings = st?.showSettings ?? false;
        sortIndex = st?.sortIndex ?? 1;
        paneWidth = st?.paneWidth ?? 400;
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<main class="full">
    <div class="content">
        <Grid {page} {sortIndex} {marked}></Grid>
        <SettingsMenu {page} {showSettings} {paneWidth} {adjustPane}></SettingsMenu>
    </div>
</main>

<style>
    .content {
        display: flex;
        width: 100vw;
        height: 100vh;
    }

    .full {
        width: 100vw;
        height: 100vh;
    }
</style>
