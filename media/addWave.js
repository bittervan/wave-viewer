(
    function() {
        // @ts-ignore
        const vscode = acquireVsCodeApi();

        const barContainer = /** @type {HTMLElement} */ (document.querySelector('.control-bar'));

        console.log("in");
        const addWaveButtonContainer = document.querySelector('.add-wave-button');
        addWaveButtonContainer.querySelector('button').addEventListener('click', () => {
            vscode.postMessage({
                type: 'add'
            });
            console.log('test')
        });
    }
)