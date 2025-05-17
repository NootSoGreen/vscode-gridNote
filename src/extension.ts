import * as vscode from "vscode";
import { GridNoteEditorProvider } from "./gridNoteEditor";

export function activate(context: vscode.ExtensionContext) {
    // Register our custom editor providers
    context.subscriptions.push(GridNoteEditorProvider.register(context));
}
