<script>
    import DOMPurify from "dompurify";
    import Tex from "./TeX.svelte";

    let { page, showSettings, marked } = $props();

    let settingsPage = $state("settings");

    let paneWidth = $state(200);

    function disableSelect(event) {
        event.preventDefault();
    }

    function adjustPane(event) {
        console.log({ pageX: event.pageX, innerWidth: window.innerWidth, width: window.innerWidth - event.pageX });
        paneWidth = Math.max(window.innerWidth - event.pageX + 2, 200);
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<nav class="side-bar {showSettings ? '' : 'hidden'}" style:width={paneWidth + "px"}>
    <div
        class="drag-bar"
        onmousedown={() => {
            window.addEventListener("selectstart", disableSelect);

            window.addEventListener(
                "pointerup",
                () => {
                    window.removeEventListener("selectstart", disableSelect);
                    window.removeEventListener("pointermove", adjustPane);
                },
                {
                    once: true,
                }
            );

            window.addEventListener("pointermove", adjustPane);
        }}
    ></div>
    <div class="side-bar-selector">
        <button
            class="side-bar-title"
            class:selected={settingsPage == "settings"}
            onclick={() => {
                settingsPage = "settings";
            }}>SETTINGS</button
        >
        <button
            class="side-bar-title"
            class:selected={settingsPage == "markdown"}
            onclick={() => {
                settingsPage = "markdown";
            }}
            title="markdown reference"><i class="codicon codicon-markdown"></i>Ref</button
        >
        <button
            class="side-bar-title"
            class:selected={settingsPage == "tex"}
            onclick={() => {
                settingsPage = "tex";
            }}
            title="TeX reference"><Tex></Tex>Ref</button
        >
    </div>
    <div class="side-bar-content">
        {#if settingsPage == "settings"}
            <div class="input-row">
                <label for="columns">Columns</label>
                <input name="columns" type="number" bind:value={page.settings.columns} />
            </div>
            <div>
                <span>TeX Macros</span>
                <textarea bind:value={page.settings.texMacros} class="textarea-input"></textarea>
            </div>
        {:else if settingsPage == "markdown"}
            <div>
                <span
                    >Marked supports the <a href="https://marked.js.org/#specifications">majority</a> of
                    <a href="https://daringfireball.net/projects/markdown/">Markdown</a>,
                    <a href="https://spec.commonmark.org/">CommonMark</a>
                    and
                    <a
                        href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
                        >GitHub Flavored Markdown</a
                    > specifications</span
                >
            </div>

            <table>
                <thead><tr><th>Input</th><th>Output</th></tr></thead>
                <tbody>
                    <tr
                        ><td>*Italic*</td>
                        <td>
                            {#await marked.parse("*Italic*") then cont}
                                {@html DOMPurify.sanitize(cont)}
                            {/await}
                        </td></tr
                    >
                    <tr
                        ><td>**Bold**</td>
                        <td>
                            {#await marked.parse("**Bold**") then cont}
                                {@html DOMPurify.sanitize(cont)}
                            {/await}
                        </td></tr
                    >
                    <tr
                        ><td>~~Strikethrough~~</td>
                        <td>
                            {#await marked.parse("~~Strikethrough~~") then cont}
                                {@html DOMPurify.sanitize(cont)}
                            {/await}
                        </td></tr
                    >
                    <tr
                        ><td>&ltsup&gtsup&lt/super&gtscript</td>
                        <td>
                            {#await marked.parse("<sup>super</sup>script") then cont}
                                {@html DOMPurify.sanitize(cont)}
                            {/await}
                        </td></tr
                    >
                    <tr
                        ><td>&ltsub&gtsub&lt/sub&gtscript</td>
                        <td>
                            {#await marked.parse("<sub>sub</sub>script") then cont}
                                {@html DOMPurify.sanitize(cont)}
                            {/await}
                        </td></tr
                    >
                    <tr
                        ><td>&ltmark&gtHighlighted&lt/mark&gt</td>
                        <td>
                            {#await marked.parse("<mark>Highlighted</mark>") then cont}
                                {@html DOMPurify.sanitize(cont)}
                            {/await}
                        </td></tr
                    >
                    <tr
                        ><td># Heading 1</td>
                        <td>
                            {#await marked.parse("# Heading 1") then cont}
                                {@html DOMPurify.sanitize(cont)}
                            {/await}
                        </td></tr
                    >
                    <tr
                        ><td>## Heading 2</td>
                        <td>
                            {#await marked.parse("## Heading 2") then cont}
                                {@html DOMPurify.sanitize(cont)}
                            {/await}
                        </td></tr
                    >
                    <tr
                        ><td>### Heading 3</td>
                        <td>
                            {#await marked.parse("### Heading 3") then cont}
                                {@html DOMPurify.sanitize(cont)}
                            {/await}
                        </td></tr
                    >
                    <tr
                        ><td>- unordered<br />- list</td>
                        <td>
                            {#await marked.parse("- unordered \n- list") then cont}
                                {@html DOMPurify.sanitize(cont)}
                            {/await}
                        </td></tr
                    >
                    <tr
                        ><td>1. ordered<br />2. list</td>
                        <td>
                            {#await marked.parse("1. ordered\n2. list") then cont}
                                {@html DOMPurify.sanitize(cont)}
                            {/await}
                        </td></tr
                    >
                    <tr
                        ><td>&gt Blockquote</td>
                        <td>
                            {#await marked.parse("> Blockquote") then cont}
                                {@html DOMPurify.sanitize(cont)}
                            {/await}
                        </td></tr
                    >
                    <tr
                        ><td>`let someCode...`</td>
                        <td>
                            {#await marked.parse("`let someCode...`") then cont}
                                {@html DOMPurify.sanitize(cont)}
                            {/await}
                        </td></tr
                    >
                    <tr
                        ><td>```//code block<br />let someMoreCode...<br />```</td>
                        <td>
                            {#await marked.parse("```//code block\nlet someMoreCode...\n```") then cont}
                                {@html DOMPurify.sanitize(cont)}
                            {/await}
                        </td></tr
                    >
                    <tr
                        ><td>[Link](example.com)</td>
                        <td>
                            {#await marked.parse(`[Link](https://www.youtube.com/watch?v=dQw4w9WgXcQ)`) then cont}
                                {@html DOMPurify.sanitize(cont)}
                            {/await}
                        </td></tr
                    >
                    <tr
                        ><td>![Image](![Image](https://example.com/image.png))</td>
                        <td>
                            {#await marked.parse("![Image](https://example.com/image.png)") then cont}
                                {@html DOMPurify.sanitize(cont)}
                            {/await}
                        </td></tr
                    >
                </tbody>
            </table>
        {:else if settingsPage == "tex"}
            <span><a href="https://katex.org/docs/supported">KaTex Supported Functions</a></span>

            <details>
                <summary>Accents</summary>
                <table>
                    <tbody>
                        <tr>
                            <td>a'</td>
                        </tr>
                    </tbody>
                </table>
            </details>
        {/if}
    </div>
</nav>

<style>
    table,
    th,
    td {
        border: 1px solid var(--vscode-editor-foreground);
        border-collapse: collapse;
    }

    table {
        width: 100%;
        margin-right: 12px;
    }

    .side-bar-selector {
        display: flex;
        background-color: var(--vscode-editor-background);
    }

    .side-bar-selector > button {
        padding: 8px;
        background-color: var(--vscode-editor-background);
        border: 0;
        border-right: 1px solid var(--vscode-sideBar-background);
        color: var(--vscode-editor-foreground);
        cursor: pointer;
    }

    .side-bar-selector > button.selected {
        background-color: var(--vscode-sideBar-background);
    }

    .side-bar {
        position: relative;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        box-sizing: border-box;
        background-color: var(--vscode-sideBar-background);
    }

    .side-bar-content {
        padding-left: 12px;
        padding-right: 12px;
        padding-top: 12px;
    }

    .side-bar-content > div:first-child {
        margin-top: 0;
    }

    .side-bar-content > div {
        margin-top: 12px;
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

    .drag-bar {
        position: absolute;
        width: 4px;
        height: 100%;
        cursor: ew-resize;
    }

    .drag-bar:hover {
        background-color: var(--vscode-sash-hoverBorder);
    }
</style>
