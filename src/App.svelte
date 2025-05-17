<script>
    // @ts-ignore
    //import noteData from "../data/data.json";

    import Grid from "./lib/components/Grid.svelte";
    import { getPageState, setPageState } from "./lib/noteData.svelte";

    import { sharedState } from "./lib/shared.svelte";
    import SettingsMenu from "./lib/components/SettingsMenu.svelte";

    const vscode = acquireVsCodeApi();

    //create notebook
    setPageState(vscode);
    const page = getPageState();

    let showSettings = $state(false);

    let sortTypes = [
        { label: "gravity", icon: "fold-up" },
        { label: "position", icon: "move" },
    ];

    let sortIndex = $state(1);

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", (event) => {
        const message = event.data; // The json data that the extension sent
        const text = message.text;
        switch (message.type) {
            case "add":
                //text should be "{id: "<id>", obj: <Note_Obj>}"
                let toAdd = JSON.parse(text);
                page.addNote(toAdd.id, toAdd.obj);
                break;

            case "update":
                console.log("message received");

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
                        page.addNote(note, updatedPage.notes[note]);
                    }
                }

                for (let note of noteList) {
                    page.deleteNote(note);
                }

                //console.log(text);
                // Update our webview's content
                page.initNotes(updatedPage);

                // Then persist state information.
                // This state is returned in the call to `vscode.getState` below when a webview is reloaded.
                vscode.setState({ text });

                break;
            case "delete":
                //text should be just the id
                let toDelete = JSON.parse(text);
                page.deleteNote(toDelete);
                break;
        }
    });

    // Webviews are normally torn down when not visible and re-created when they become visible again.
    // State lets us save information across these re-loads
    const st = vscode.getState();
    if (st) {
        page.initNotes(JSON.parse(st.text));
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<main class="full">
    <header class="header">
        <span class="header-inner">
            <div>
                <!--<span class="title">Grid Note</span>-->
            </div>
        </span>
        <span class="header-inner">
            <button
                title={sortTypes[sortIndex].label}
                aria-label="sort"
                class="iconBtn"
                onclick={() =>
                    (sortIndex =
                        sortIndex++ >= sortTypes.length - 1 ? 0 : sortIndex)}
            >
                <i class="codicon codicon-{sortTypes[sortIndex].icon}"></i>
            </button>
            <button
                title="settings"
                aria-label="page settings"
                class="iconBtn {showSettings ? 'active' : ''}"
                onclick={() => (showSettings = !showSettings)}
            >
                <i class="codicon codicon-settings-gear"></i>
            </button>
        </span>
    </header>
    <div class="content">
        <Grid {page} {sortIndex}></Grid>
        <SettingsMenu {page} {showSettings}></SettingsMenu>
    </div>
</main>

<style>
    .title {
        color: var(--content-color-secondary);
    }

    .content {
        display: flex;
        width: 100vw;
        height: calc(100vh - 2rem);
    }

    .header {
        height: 2rem;
        padding: 0.5rem;
        width: 100%;
        box-sizing: border-box;
        /*border-bottom: 1px solid var(--vscode-editor-foreground);*/
        display: flex;
        justify-content: space-between;
    }

    .header-inner {
        display: flex;
        align-items: center;
        margin-left: 0.5rem;
    }

    .header-inner > * {
        margin-right: 0.5rem;
    }

    .full {
        width: 100vw;
        height: 100vh;
    }
</style>
