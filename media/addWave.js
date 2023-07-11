// @ts-check

// Script run within the webview itself.
(function () {
	// @ts-ignore
	const vscode = acquireVsCodeApi();

	const notesContainer = /** @type {HTMLElement} */ (document.querySelector('.notes'));

	const addButtonContainer = document.querySelector('.add-button');
	addButtonContainer?.querySelector('button')?.addEventListener('click', () => {
		vscode.postMessage({
			type: 'add'
		});
	})

}());
