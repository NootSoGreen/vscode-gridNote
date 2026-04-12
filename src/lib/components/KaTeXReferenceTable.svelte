<script>
    import katex from "katex";

    let { functionsArr, noDraw = false } = $props();
</script>

<table>
    <tbody>
        {#each functionsArr as functions}
            <tr>
                {#each functions as func}
                    {#if func != ""}
                        <td>
                            {#if !noDraw}
                                {@html katex.renderToString(func, { throwOnError: false, displayMode: true })}
                            {/if}
                            <code>{func}</code>
                        </td>
                    {:else}
                        <td></td>
                    {/if}
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
