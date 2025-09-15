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
                        page.addNote(note, updatedPage.notes[note]);
                    }
                }

                for (let note of noteList) {
                    page.deleteNote(note);
                }

                //console.log(text);
                // Update our webview's content
                //page.initNotes(updatedPage);
                if (updatedPage.settings.columns != page.settings.columns) {
                    page.settings.columns = updatedPage.settings.columns;
                }

                // Then persist state information.
                // This state is returned in the call to `vscode.getState` below when a webview is reloaded.
                vscode.setState({ text });

                break;
            case "delete":
                //text should be just the id
                let toDelete = JSON.parse(text);
                page.deleteNote(toDelete);
                break;
            case "toggleSettings":
                showSettings = !showSettings;
                break;
            case "setSort":
                console.log(JSON.parse(text));
                sortIndex = JSON.parse(text);
                break;
        }
    });

    // Webviews are normally torn down when not visible and re-created when they become visible again.
    // State lets us save information across these re-loads
    const st = vscode.getState();
    if (st) {
        console.log(JSON.parse(st.text));
        page.initNotes(JSON.parse(st.text));
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<main class="full">
    <div class="content">
        <Grid {page} {sortIndex}></Grid>
        <SettingsMenu {page} {showSettings}></SettingsMenu>
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
