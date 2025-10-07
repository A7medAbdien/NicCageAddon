const INTERVAL_KEY = "refresh-interval";
// default to 1s refresh window
const DEFAULT_INTERVAL = "1000";

const SOURCES_KEY = "nic-sources";
const ALLOWLIST_KEY = "nic-allowlist";

const NICS = [
    'https://cdnb.artstation.com/p/assets/images/images/018/917/287/large/-006.jpg?1561240445',
]

let runtimeSources = null;
let runtimeAllowlist = [];

function getSourcesOrDefault(item) {
    if (!item || !(SOURCES_KEY in item)) {
        return NICS;
    }
    const stored = item[SOURCES_KEY];
    if (Array.isArray(stored) && stored.length > 0) {
        return stored;
    }
    return NICS;
}

function getAllowlistOrDefault(item) {
    if (!item || !(ALLOWLIST_KEY in item)) {
        return [];
    }
    const list = item[ALLOWLIST_KEY];
    if (Array.isArray(list)) {
        return list;
    }
    return [];
}

function urlIsAllowed(url, allowlist) {
    if (!allowlist || allowlist.length === 0) {
        return true; // empty allowlist means run everywhere
    }
    for (let i = 0; i < allowlist.length; i++) {
        const pattern = allowlist[i];
        if (pattern && url.indexOf(pattern) !== -1) {
            return true;
        }
    }
    return false;
}

function getNic() {
    const sources = runtimeSources || NICS;
    let nicNum = Math.floor(Math.random() * sources.length);
    return sources[nicNum];
}

function replaceImages() {
    for (let i = 0; i < document.images.length; ++i) {
        let img = document.images[i];

        if (img.classList.contains('nicced')) {
            continue;
        }
        img.classList.add('nicced');

        // attempt to retain the original dimensions
        img.style.width = img.width + 'px';
        img.style.height = img.height + 'px';

        // nic-em
        let loc = getNic()
        img.src = loc;
        if (img.srcset) {
            img.srcset = loc;
        }
    };
}

// setup defaults
function get_interval_or_default(item) {
    if (!item || !(INTERVAL_KEY in item)) {
        browser.storage.local.set({
            INTERVAL_KEY: DEFAULT_INTERVAL
        });
        return DEFAULT_INTERVAL;
    } else {
        return item[INTERVAL_KEY];
    }
}

// start up the extension
browser.storage.local.get().then(
    (item) => {
        runtimeSources = getSourcesOrDefault(item);
        runtimeAllowlist = getAllowlistOrDefault(item);
        let interval = get_interval_or_default(item);
        if (urlIsAllowed(window.location.href, runtimeAllowlist)) {
            window.setInterval(replaceImages, interval);
        }
    },
    (_) => {
        runtimeSources = NICS;
        if (urlIsAllowed(window.location.href, [])) {
            window.setInterval(replaceImages, DEFAULT_INTERVAL);
        }
    }
);
