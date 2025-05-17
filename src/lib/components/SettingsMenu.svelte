<script>
    import { sharedState } from "../shared.svelte";

    let { page, showSettings } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<nav class="side-bar {showSettings ? '' : 'hidden'}">
    <span class="side-bar-title">
        <span class="title">Settings</span>
    </span>
    <div class="content">
        <span
            >Columns:<input
                type="number"
                bind:value={page.settings.columns}
            /></span
        >
    </div>
</nav>

<style>
    .content {
        padding: 0.5rem;
    }

    .side-bar {
        display: flex;
        flex-direction: column;
        width: 20vw;
        height: calc(100vh - 4rem);
        overflow-y: auto;
        box-sizing: border-box;
        border-left: 1px solid var(--vscode-editor-foreground);
    }

    .side-bar-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 4rem;
    }

    .side-bar-title > .title {
        margin-left: 1rem;
    }

    .side-bar-title > * {
        margin-right: 0.5rem;
    }
</style>
