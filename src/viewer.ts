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
                    vscode.window.showInformationMessage('Hello World from WaveViewer!');
                    return;
                case 'err':
                    vscode.window.showInformationMessage('Error!');
                    return;
            }
        });

        updateWebview();
    }

    private getHtmlForWebview(document: vscode.TextDocument, webview: vscode.Webview): string {

        const addWaveScriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(
                this.context.extensionUri, 'media', 'addWave.js'
            )
        );

        const nonce = getNonce();

        return `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    hello
                </head>
                <body>
                    <div class="control-bar">
                        <div class="add-wave-button">
                            <button>Add Wave</button>
                        </div>
                    </div>
                    <script nonce="${nonce}" src="${addWaveScriptUri}"></script>
                </body>
            </html>`;
    }
}