// @ts-check

// Script run within the webview itself.
(function () {
	// @ts-ignore
	const vscode = acquireVsCodeApi();

	const notesContainer = /** @type {HTMLElement} */ (document.querySelector('.notes'));

	const addButtonContainer = document.querySelector('.add-button');
	addButtonContainer?.querySelector('button')?.addEventListener('click', () => {
		vscode.postMessage({
			type: 'add',
		});
	})

	function updateContent(/** @type {string} */ text) {
		notesContainer.innerHTML = 'hello';
	}

	window.addEventListener('message', event => {
		const message = event.data;
		switch (message.type) {
			case 'update':
				console.log("update");
				console.log(message.text);
				updateContent(message.text);
				return;
		}
	})

}());
