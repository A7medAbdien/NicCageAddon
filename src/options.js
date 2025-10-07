const INTERVAL_KEY = "refresh-interval";
// default to 1s refresh window
const DEFAULT_INTERVAL = "1000";

const MIN_INTERVAL = 500;
const MAX_INTERVAL = 5000;

const SOURCES_KEY = "nic-sources";
const DEFAULT_SOURCES = [
    "https://images.wired.it/gallery/131607/Big/37493d96-2b60-4164-b730-cc0717c36f18.jpeg",
    "https://i0.wp.com/www.cinezapping.com/wp-content/uploads/2011/01/nicolas-cage_06.jpg",
    "https://3.bp.blogspot.com/-JQqV60o8x0A/Wzexrjx2UKI/AAAAAAAABE4/EwrkZFh0wQ4-LXassGyOZsiWFDgEY9brACLcBGAs/w1200-h630-p-k-no-nu/Nic-Cage.jpg",
    "https://live.staticflickr.com/3242/5818160547_9d1bb744d4.jpg",
    "https://live.staticflickr.com/1461/25524427682_c3757f7989_z.jpg",
    "https://c4.wallpaperflare.com/wallpaper/400/158/569/nicolas-cage-actor-man-face-wallpaper-preview.jpg",
    "http://www.slicktiger.co.za/wp-content/uploads/2011/11/nic_cage_faceoff11.jpg",
    "http://4.bp.blogspot.com/_N91xwP-lKvw/TFjSKU-ETZI/AAAAAAAABlc/-mAlrcPNZeI/s400/nickcagevampkiss.jpg",
    "https://i1.wp.com/fortworthreport.org/wp-content/uploads/2021/07/PIG001.jpeg",
    "https://upload.wikimedia.org/wikipedia/commons/c/c0/Nicolas_Cage_Deauville_2013.jpg"
];

const ALLOWLIST_KEY = "nic-allowlist";

function save_interval() {
    let interval_setting = document.getElementById("interval-setting");
    let interval = interval_setting.value;
    let interval_num = Number(interval);

    if (interval_num < 500 || interval_num > 5000) {
        // revert to old storage
        browser.storage.local.get().then(
            (item) => {
                let interval = get_interval_or_default(item);
                document.getElementById("interval-setting").value = interval;
            },
            (_) => {
                document.getElementById("interval-setting").value = DEFAULT_INTERVAL;
            }
        );
        return;
    }

    // all clear, update the storage
    browser.storage.local.set({
        INTERVAL_KEY: interval
    });
}

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

function get_sources_or_default(item) {
    if (!item || !(SOURCES_KEY in item)) {
        browser.storage.local.set({
            [SOURCES_KEY]: DEFAULT_SOURCES
        });
        return DEFAULT_SOURCES;
    } else {
        const stored = item[SOURCES_KEY];
        if (Array.isArray(stored) && stored.length > 0) {
            return stored;
        }
        return DEFAULT_SOURCES;
    }
}

function save_sources() {
    const textarea = document.getElementById("sources-setting");
    const lines = textarea.value
        .split("\n")
        .map(s => s.trim())
        .filter(s => s.length > 0);
    if (lines.length === 0) {
        // ignore empty save, keep current values in UI
        return;
    }
    browser.storage.local.set({
        [SOURCES_KEY]: lines
    });
}

function reset_sources() {
    browser.storage.local.set({
        [SOURCES_KEY]: DEFAULT_SOURCES
    });
    document.getElementById("sources-setting").value = DEFAULT_SOURCES.join("\n");
}

function get_allowlist_or_default(item) {
    if (!item || !(ALLOWLIST_KEY in item)) {
        browser.storage.local.set({
            [ALLOWLIST_KEY]: []
        });
        return [];
    }
    const list = item[ALLOWLIST_KEY];
    if (Array.isArray(list)) {
        return list;
    }
    return [];
}

function save_allowlist() {
    const textarea = document.getElementById("allowlist-setting");
    const lines = textarea.value
        .split("\n")
        .map(s => s.trim())
        .filter(s => s.length > 0);
    browser.storage.local.set({
        [ALLOWLIST_KEY]: lines
    });
}

function reset_allowlist() {
    browser.storage.local.set({
        [ALLOWLIST_KEY]: []
    });
    const textarea = document.getElementById("allowlist-setting");
    textarea.value = "";
}

// hook save button
document.getElementById("save-button").addEventListener("click", save_interval);
const saveSourcesBtn = document.getElementById("save-sources-button");
if (saveSourcesBtn) {
    saveSourcesBtn.addEventListener("click", save_sources);
}
const resetSourcesBtn = document.getElementById("reset-sources-button");
if (resetSourcesBtn) {
    resetSourcesBtn.addEventListener("click", reset_sources);
}
const saveAllowBtn = document.getElementById("save-allowlist-button");
if (saveAllowBtn) {
    saveAllowBtn.addEventListener("click", save_allowlist);
}
const resetAllowBtn = document.getElementById("reset-allowlist-button");
if (resetAllowBtn) {
    resetAllowBtn.addEventListener("click", reset_allowlist);
}

// setup defaults
browser.storage.local.get().then(
    (item) => {
        let interval = get_interval_or_default(item);
        document.getElementById("interval-setting").value = interval;
        const sources = get_sources_or_default(item);
        const textarea = document.getElementById("sources-setting");
        if (textarea) {
            textarea.value = sources.join("\n");
        }
        const allowlist = get_allowlist_or_default(item);
        const allowArea = document.getElementById("allowlist-setting");
        if (allowArea) {
            allowArea.value = allowlist.join("\n");
        }
    },
    (_) => {
        document.getElementById("interval-setting").value = DEFAULT_INTERVAL;
        const textarea = document.getElementById("sources-setting");
        if (textarea) {
            textarea.value = DEFAULT_SOURCES.join("\n");
        }
        const allowArea = document.getElementById("allowlist-setting");
        if (allowArea) {
            allowArea.value = "";
        }
    }
);