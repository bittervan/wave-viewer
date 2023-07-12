// @ts-check

// Script run within the webview itself.
(function () {
	// @ts-ignore
	const vscode = acquireVsCodeApi();

	const controlPanelContainer = /** @type {HTMLElement} */ (document.querySelector('.control-panel'));

	const displayPanelContainer = /** @type {HTMLElement} */ (document.querySelector('.display-panel'));

	const addButtonContainer = document.querySelector('.add-button');
	addButtonContainer?.querySelector('button')?.addEventListener('click', () => {
		vscode.postMessage({
			type: 'addSignal',
		});
	})

	function updateControl(/** @type {string} */ text) {
		if (addButtonContainer !== null) {
			controlPanelContainer.appendChild(addButtonContainer);
		}
	}

	function updateDisplay(payload) {
		console.log("ininin")
		displayPanelContainer.innerHTML = "";
		for (const signal of payload) {
			const element = document.createElement('div')
			element.className = 'text';
			element.innerText = signal.name;
			displayPanelContainer.appendChild(element);
		}	
	}

	window.addEventListener('message', event => {
		const message = event.data;
		switch (message.type) {
			case 'update':
				updateControl(message.text);
				return;
			case 'addSignal':
				console.log("***********");
				console.log(message.payload);
				console.log("***********");
				updateDisplay(message.payload);
				return;
		}
	})

}());
