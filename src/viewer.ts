import * as vscode from "vscode"
import { getNonce } from "./util";

export class WaveViewerEditorProvider implements vscode.CustomTextEditorProvider {

	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new WaveViewerEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(WaveViewerEditorProvider.viewType, provider);
		return providerRegistration;
	}

    private static readonly viewType = 'wave-viewer.viewer';

    constructor(
        private readonly context: vscode.ExtensionContext
    ) { }

    public async resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Promise<void> {

		webviewPanel.webview.html = this.getHtmlForWebview(document, webviewPanel.webview);

		webviewPanel.webview.options = {
			enableScripts: true,
		};

        function updateWebview() {
            webviewPanel.webview.postMessage({
                type: 'update',
                text: document.getText(),
            });
        }

        // Start watching file change
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument( e => {
            if (e.document === document) {
                updateWebview();
            }
        });

        webviewPanel.webview.onDidReceiveMessage(e => {
            switch (e.type) {
                case 'add':
                    this.addWave();
                    updateWebview();
                    return;
            }
        });

        updateWebview();
    }

    private getHtmlForWebview(document: vscode.TextDocument, webview: vscode.Webview): string {

		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'media', 'addWave.js'));

		const nonce = getNonce();

		return /* html */`
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<title>WaveViewer</title>
			</head>
			<body>
				<div class="notes">
					<div class="add-button">
						<button>Add Signal</button>
					</div>
				</div>
				
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }

    private addWave() {
        vscode.window.showInformationMessage('Adding wave.');
    }
}