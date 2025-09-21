<script>
    import { sharedState } from "../shared.svelte";

    let { page, showSettings } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<nav class="side-bar {showSettings ? '' : 'hidden'}">
    <h2 class="side-bar-title">SETTINGS</h2>
    <div class="content">
        <p class="input-row">
            <label for="columns">Columns</label>
            <input
                name="columns"
                type="number"
                bind:value={page.settings.columns}
            />
        </p>
        <p>
            <span>TeX Macros</span>
            <textarea
                bind:value={page.settings.texMacros}
                class="textarea-input"
            ></textarea>
        </p>
    </div>
</nav>

<style>
    .side-bar {
        display: flex;
        flex-direction: column;
        width: 20vw;
        overflow-y: auto;
        box-sizing: border-box;
        background-color: var(--vscode-sideBar-background);
        padding-left: 12px;
        padding-right: 12px;
    }

    .side-bar-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
        font-weight: 400;
    }

    input {
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

    .textarea-input {
        color: var(--vscode-input-foreground);
        background-color: var(--vscode-input-background);
        outline-color: var(--vscode-focusBorder);
        border: 0;
        border-radius: 2px;
        field-sizing: content;
        resize: vertical;
        width: 100%;
        margin-right: 12px;
    }

    label {
        padding-right: 6px;
    }

    .input-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
