<script>
    import Tex from "./TeX.svelte";

    let { page, showSettings, paneWidth, adjustPane } = $props();

    let settingsPage = $state("settings");

    function disableSelect(event) {
        event.preventDefault();
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
                <textarea bind:value={page.settings.texMacros} class="textarea-input" style="width: calc(100% - 4px)"
                ></textarea>
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
            <div style="overflow:auto">
                <table>
                    <thead><tr><th>Input</th><th>Output</th></tr></thead>
                    <tbody>
                        <tr
                            ><td>*Italic*</td>
                            <td>
                                <p><em>Italic</em></p>
                            </td></tr
                        >
                        <tr
                            ><td>**Bold**</td>
                            <td>
                                <p><strong>Bold</strong></p>
                            </td></tr
                        >
                        <tr
                            ><td>~~Strikethrough~~</td>
                            <td>
                                <p><del>Strikethrough</del></p>
                            </td></tr
                        >
                        <tr
                            ><td>&ltsup&gtsup&lt/super&gtscript</td>
                            <td>
                                <p><sup>super</sup>script</p>
                            </td></tr
                        >
                        <tr
                            ><td>&ltsub&gtsub&lt/sub&gtscript</td>
                            <td>
                                <p><sup>super</sup>script</p>
                            </td></tr
                        >
                        <tr
                            ><td>&ltmark&gtHighlighted&lt/mark&gt</td>
                            <td>
                                <p><mark>Highlighted</mark></p>
                            </td></tr
                        >
                        <tr
                            ><td># Heading 1</td>
                            <td>
                                <h1>Heading 1</h1>
                            </td></tr
                        >
                        <tr
                            ><td>## Heading 2</td>
                            <td>
                                <h2>Heading 2</h2>
                            </td></tr
                        >
                        <tr
                            ><td>### Heading 3</td>
                            <td>
                                <h3>Heading 3</h3>
                            </td></tr
                        >
                        <tr
                            ><td>- unordered<br />- list</td>
                            <td>
                                <ul>
                                    <li>unordered</li>
                                    <li>list</li>
                                </ul>
                            </td></tr
                        >
                        <tr
                            ><td>1. ordered<br />2. list</td>
                            <td>
                                <ol>
                                    <li>ordered</li>
                                    <li>list</li>
                                </ol>
                            </td></tr
                        >
                        <tr
                            ><td>&gt Blockquote</td>
                            <td>
                                <blockquote>
                                    <p>Blockquote</p>
                                </blockquote>
                            </td></tr
                        >
                        <tr
                            ><td>`let someCode...`</td>
                            <td>
                                <p><code>let someCode...</code></p>
                            </td></tr
                        >
                        <tr
                            ><td>```<br />//code block<br />let someMoreCode...<br />```</td>
                            <td>
                                <pre><code
                                        >//code block
let someMoreCode...
</code></pre>
                            </td></tr
                        >
                        <tr
                            ><td>[Link](example.com)</td>
                            <td>
                                <p><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Link</a></p>
                            </td></tr
                        >
                        <tr
                            ><td>![Image](![Image](https://example.com/image.png))</td>
                            <td>
                                <p><img src="https://example.com/image.png" alt="Example" /></p>
                            </td></tr
                        >
                    </tbody>
                </table>
            </div>
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
