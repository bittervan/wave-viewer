export function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

export function longestCommonPrefix(strs: Array<String>) {
    let prefix = strs[0] || '';
    for(let i = 1; i < strs.length; i++) {
        prefix = getPrefix(prefix, strs[i]);
        if(prefix.length === 0) {
            return prefix;
        }
    }
    return prefix;
};

function getPrefix(commonPrefix: String, str: String) {
    let len = Math.min(commonPrefix.length, str.length)
    let prefix = ''
    for(let i = 0; i < len; i++) {
        if (commonPrefix.charAt(i) === str.charAt(i)) {
            prefix += commonPrefix.charAt(i)
        } else {
            return prefix;
        }
    }
    return prefix;
}