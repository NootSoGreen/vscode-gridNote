import * as vscode from "vscode";
import { GridNoteEditorProvider } from "./gridNoteEditor";

export function activate(context: vscode.ExtensionContext) {
    // Register custom editor provider and commands
    context.subscriptions.push(...GridNoteEditorProvider.register(context));
}
