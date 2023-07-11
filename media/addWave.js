// @ts-check

// Script run within the webview itself.
(function () {
	// @ts-ignore
	const vscode = acquireVsCodeApi();

	const controlPanelContainer = /** @type {HTMLElement} */ (document.querySelector('.control-panel'));

	const addButtonContainer = document.querySelector('.add-button');
	addButtonContainer?.querySelector('button')?.addEventListener('click', () => {
		vscode.postMessage({
			type: 'add',
		});
	})

	function updateContent(/** @type {string} */ text) {
		if (addButtonContainer !== null) {
			controlPanelContainer.appendChild(addButtonContainer);
		}
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
