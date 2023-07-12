import * as vscode from "vscode"
import { getNonce } from "./util";
const VCDParser = require('vcd-parser');

export class WaveViewerEditorProvider implements vscode.CustomTextEditorProvider {

	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new WaveViewerEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(WaveViewerEditorProvider.viewType, provider);
		return providerRegistration;
	}

    private static readonly viewType = 'wave-viewer.viewer';

    private signals = new Array();
    private signalsToDisplay = new Array();

    constructor(
        private readonly context: vscode.ExtensionContext
    ) { }

    public async resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Promise<void> {

        let parsedData = await VCDParser.parse(document.getText());
        this.signals = parsedData.signal;

        console.log(this.signals);

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

        function addSignalToWebview(signalsToDisplay: any) {
            webviewPanel.webview.postMessage({
                type: 'addSignal',
                payload: signalsToDisplay,
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
                case 'addSignal':
                    this.addWave(addSignalToWebview);
                    return;
            }
        });

        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });

        updateWebview();
    }

    private getHtmlForWebview(document: vscode.TextDocument, webview: vscode.Webview): string {

        const applicationScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'media', 'application.js'));

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
                <div class="control-panel">
					<div class="add-button">
						<button>Add Signal</button>
					</div>
                </div>
                <div class="display-panel">
                    <div> test </div>
                </div>
				<script nonce="${nonce}" src="${applicationScriptUri}"></script>
			</body>
			</html>`;
    }

    private addWave(addSignalToWebview: Function) {
        // vscode.window.showInformationMessage('Adding wave.');
        let addWavePick = vscode.window.createQuickPick();
        addWavePick.placeholder = 'Type to search for signals';

        // initialize items
        addWavePick.items = [];
        this.signals.forEach(v => {
            console.log(v);
            if (!this.signalsToDisplay.includes(v.name)) {
                addWavePick.items = addWavePick.items.concat(new SignalItem(v.name, v.module));
            }
        })

        addWavePick.onDidChangeSelection(items => {
            const item = items[0];
            if (item instanceof SignalItem) {
                for (let signal of this.signals) {
                    if (signal.name == item.label) {
                        this.signalsToDisplay.push(signal);
                    }
                }
                addWavePick.hide();
            }
            addSignalToWebview(this.signalsToDisplay);
        });

        addWavePick.onDidHide(() => {
            addWavePick.dispose();
        });
        
        addWavePick.show();
    }
}

class SignalItem implements vscode.QuickPickItem {

	label: string;
	description: string;

	constructor(name: String, description: String) {
        this.label = name.toString();
        this.description = description.toString();
	}
}