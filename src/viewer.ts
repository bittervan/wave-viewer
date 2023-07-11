import * as vscode from "vscode"

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
		webviewPanel.webview.html = this.getHtmlForWebview(document);
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

        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
            vscode.window.showInformationMessage('dispose!');
        });

        webviewPanel.onDidChangeViewState(() => {
            vscode.window.showInformationMessage('change!');
        });

        webviewPanel.webview.onDidReceiveMessage(() => {
            vscode.window.showInformationMessage('message!');
        })

        updateWebview();
    }

    private getHtmlForWebview(document: vscode.TextDocument): string {
        // return `
        //     <!DOCTYPE html>
        //     <html lang="en">
        //         <head>
        //             hello
        //         </head>
        //     </html>`;
        return document.getText(); 
    }
}