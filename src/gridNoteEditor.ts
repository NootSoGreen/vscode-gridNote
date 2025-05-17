import * as vscode from "vscode";
import { getNonce } from "./util";

interface Note {
    row: number;
    col: number;
    rowSpan: number;
    colSpan: number;
    color: string;
    content: string;
    lastEdit: number;
    title: string;
    type: string;
    displayTitle: boolean;
}

/**Based on https://github.com/microsoft/vscode-extension-samples/tree/main/custom-editor-sample
 * Provider for grid note editors.
 *
 * Grid note editors are used for `.gdNote` files, which are just json files.
 * To get started, run this extension and open an empty `.gdNote` file in VS Code.
 *
 * This provider demonstrates:
 *
 * - Setting up the initial webview for a custom editor.
 * - Loading scripts and styles in a custom editor.
 * - Synchronizing changes between a text document and a custom editor.
 */
export class GridNoteEditorProvider implements vscode.CustomTextEditorProvider {
    public static register(
        context: vscode.ExtensionContext
    ): vscode.Disposable {
        const provider = new GridNoteEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(
            GridNoteEditorProvider.viewType,
            provider
        );
        return providerRegistration;
    }

    private static readonly viewType = "gridNote.gdNote";

    private documentState = "";

    constructor(private readonly context: vscode.ExtensionContext) {}

    /**
     * Called when our custom editor is opened.
     *
     *
     */
    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        // Setup initial content for the webview
        webviewPanel.webview.options = {
            enableScripts: true,
        };
        webviewPanel.webview.html = this.getHtmlForWebview(
            webviewPanel.webview
        );

        const updateWebview = () => {
            let curDocState = document.getText();
            if (document.getText() != this.documentState) {
                webviewPanel.webview.postMessage({
                    type: "update",
                    text: curDocState,
                });
                this.documentState = curDocState;
                console.log("sent updated state");
            }
        };

        // Hook up event handlers so that we can synchronize the webview with the text document.
        //
        // The text document acts as our model, so we have to sync change in the document to our
        // editor and sync changes in the editor back to the document.
        //
        // Remember that a single text document can also be shared between multiple custom
        // editors (this happens for example when you split a custom editor)

        const changeDocumentSubscription =
            vscode.workspace.onDidChangeTextDocument((e) => {
                if (e.document.uri.toString() === document.uri.toString()) {
                    updateWebview();
                }
            });

        // Make sure we get rid of the listener when our editor is closed.
        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });

        // Receive message from the webview.
        webviewPanel.webview.onDidReceiveMessage((e) => {
            //Create, Read, Update, Delete
            console.log(e);
            switch (e.type) {
                case "add":
                    this.addNote(document, e.toAdd);
                    return;
                case "update":
                    console.log("updating note...");
                    this.updateNote(document, e.id, e.prop, e.value);
                    return;

                case "delete":
                    this.deleteNote(document, e.id);
                    return;
            }
        });

        updateWebview();
    }

    /**
     * Get the static html used for the editor webviews.
     */
    private getHtmlForWebview(webview: vscode.Webview): string {
        // Local path to script and css for the webview
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(
                this.context.extensionUri,
                "out",
                "assets/index.js"
            )
        );
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(
                this.context.extensionUri,
                "out",
                "assets/index.css"
            )
        );

        //https://github.com/microsoft/vscode-extension-samples/tree/main/webview-codicons-sample
        const codiconsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(
                this.context.extensionUri,
                "node_modules",
                "@vscode/codicons",
                "dist",
                "codicon.css"
            )
        );

        // Use a nonce to whitelist which scripts can be run
        const nonce = getNonce();

        return /* html */ `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
				Use a content security policy to only allow loading images from https or from our extension directory,
				and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; font-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleUri}" rel="stylesheet" />
                <link href="${codiconsUri}" rel="stylesheet" />

				<title>Grid Note</title>
			</head>
			<body>
                <div id="app"></div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
                
			</body>
			</html>`;
    }

    /**
     * Add a new scratch to the current document.
     */
    private addNote(document: vscode.TextDocument, props: Note) {
        const json = this.getDocumentAsJson(document);

        let id = crypto.randomUUID();

        let toAdd = {
            row: props.row ?? 1,
            col: props.col ?? 1,
            rowSpan: props.rowSpan ?? 1,
            colSpan: props.colSpan ?? 1,
            color: props.color ?? "Yellow",
            content: props.content ?? "",
            lastEdit: props.lastEdit ?? Date.now(),
            title: props.title ?? "",
            type: props.type ?? "markdown",
            displayTitle: props.type ?? true,
        };

        if (json.hasOwnProperty("notes")) {
            json.notes[id] = toAdd;
        } else {
            json.notes = { id: toAdd };
        }

        return this.updateTextDocument(document, json);
    }

    /**
     * Update a note in the current document.
     */
    private updateNote(
        document: vscode.TextDocument,
        id: string,
        prop: string,
        value: any
        //toUpdate: object
    ) {
        const json = this.getDocumentAsJson(document);
        if (!json.notes.hasOwnProperty(id)) {
            return;
        }

        json.notes[id][prop] = value;

        //store state to check when document updates
        this.documentState = JSON.stringify(json);

        return this.updateTextDocument(document, json);
    }

    /**
     * Delete an existing note from the current document.
     */
    private deleteNote(document: vscode.TextDocument, id: string) {
        const json = this.getDocumentAsJson(document);
        console.log("test");
        if (!json.notes.hasOwnProperty(id)) {
            console.log("failed to find ID to delete");
            return;
        }

        delete json.notes[id];

        console.log(json.notes[id]);

        return this.updateTextDocument(document, json);
    }

    /**
     * Try to get a current document as json text.
     */
    private getDocumentAsJson(document: vscode.TextDocument): any {
        const text = document.getText();
        if (text.trim().length === 0) {
            return {};
        }

        try {
            return JSON.parse(text);
        } catch {
            throw new Error(
                "Could not get document as json. Content is not valid json"
            );
        }
    }

    /**
     * Write out the json to a given document.
     */
    private updateTextDocument(document: vscode.TextDocument, json: any) {
        const edit = new vscode.WorkspaceEdit();

        // Just replace the entire document every time for this example extension.
        // A more complete extension should compute minimal edits instead.
        edit.replace(
            document.uri,
            new vscode.Range(0, 0, document.lineCount, 0),
            JSON.stringify(json, null, 2)
        );

        return vscode.workspace.applyEdit(edit);
    }
}
