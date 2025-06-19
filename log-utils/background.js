let targetTab = null;
let caseId = "";
let activeStartTime = null;

// chrome-extension://eimadpbcbfnmbkopoojfekhnkhdbieeh/background/index.js

// Get stored time (returns { [caseId]: seconds, total: seconds })
const getStoredTime = async () => {
  return await chrome.storage.local.get(["trackingData"]);
};

const logTrackingData = async () => {
  const { trackingData = {} } = await chrome.storage.local.get("trackingData");
  Object.entries(trackingData).forEach(([key, value]) => {
    console.log(`${key === "total" ? "🧮 Total" : `📁 ${key}`}: ${formatDuration(value)}`);
  });
};

const logDailyCaseIdBreakdown = async () => {
  const { timelog = {} } = await chrome.storage.local.get("timelog");

  const caseIds = Object.keys(timelog).filter((id) => id !== "total");

  // Create a map: date => { caseId1: seconds, caseId2: seconds, ... }
  const dateMap = {};

  for (const caseId of caseIds) {
    const logs = timelog[caseId];
    for (const [date, seconds] of Object.entries(logs)) {
      if (!dateMap[date]) dateMap[date] = {};
      dateMap[date][caseId] = (dateMap[date][caseId] || 0) + seconds;
    }
  }

  const sortedDates = Object.keys(dateMap).sort();

  for (const date of sortedDates) {
    console.log(`📅 ${date}`);
    let dailyTotal = 0;

    for (const [caseId, seconds] of Object.entries(dateMap[date])) {
      console.log(`  📁 ${caseId}: ${formatDuration(seconds)}`);
      dailyTotal += seconds;
    }

    console.log(`  ➕ Total: ${formatDuration(dailyTotal)}\n`);
  }
};

// Save updated time
const saveTime = async (caseId, seconds) => {
  const { trackingData = {}, timelog = {} } = await chrome.storage.local.get(["trackingData", "timelog"]);
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  // Save total accumulated time
  trackingData[caseId] = (trackingData[caseId] || 0) + seconds;
  trackingData.total = (trackingData.total || 0) + seconds;

  // Save per-day per-case
  timelog[caseId] = timelog[caseId] || {};
  timelog[caseId][today] = (timelog[caseId][today] || 0) + seconds;

  // Save global per-day total
  timelog.total = timelog.total || {};
  timelog.total[today] = (timelog.total[today] || 0) + seconds;

  await chrome.storage.local.set({ trackingData, timelog });

  // const { trackingData = {} } = await getStoredTime();

  // trackingData[caseId] = (trackingData[caseId] || 0) + seconds;
  // trackingData.total = (trackingData.total || 0) + seconds;

  // await chrome.storage.local.set({ trackingData });
};

// Convert seconds to readable string
const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}h ${mins}m ${secs}s`;
};

// Timer start
const startTimer = () => {
  activeStartTime = Date.now();
};

// Timer stop & save
const stopTimer = async () => {
  if (!activeStartTime) return;

  const elapsed = Math.floor((Date.now() - activeStartTime) / 1000);
  await saveTime(caseId, elapsed);

  const { trackingData = {} } = await getStoredTime();
  const total = trackingData[caseId] || 0;

  console.log(`[⏱️] Tracked this session: ${formatDuration(elapsed)} | Total: ${formatDuration(total)} for caseId "${caseId}"`);

  activeStartTime = null;
};

// 🔍 Search all windows for the tab containing the target caseId
const findTargetTab = async () => {
  const windows = await chrome.windows.getAll({ populate: true });

  for (const win of windows) {
    if (win.type !== "normal" || win.incognito) continue;

    for (const tab of win.tabs) {
      if (tab.url?.includes(`rgdmprmd-manga.vercel.app/manga/${caseId}`)) {
        return { targetTabId: tab.id, targetWindowId: win.id };
      }
    }
  }

  return null;
};

// 🚨 Bring the target tab into focus
const activateTarget = () => {
  if (!targetTab) {
    console.warn("No target tab found for caseId:", caseId);
    return;
  }

  setTimeout(() => {
    console.log(`[${new Date().toLocaleTimeString()}] Target locked`);
    chrome.windows.update(targetTab.targetWindowId, { focused: true });
    chrome.tabs.update(targetTab.targetTabId, { active: true });
  }, 3000);
};

// 🎯 Handle tab change
const handleTabChange = (activeInfo) => {
  if (!targetTab) return;

  if (activeInfo.windowId === targetTab.targetWindowId) {
    if (activeInfo.tabId !== targetTab.targetTabId) {
      stopTimer();
      console.log(`[${new Date().toLocaleTimeString()}] Target is inactive: CHANGE_TAB`);
      activateTarget();
    } else {
      startTimer(); // switched back
    }
  } else {
    stopTimer();
  }

  /*if (targetTab && activeInfo.windowId === targetTab.targetWindowId && activeInfo.tabId !== targetTab.targetTabId) {
    console.log(`[${new Date().toLocaleTimeString()}] Target is inactive: CHANGE_TAB`);
    activateTarget();
  }*/
};

// 🎯 Handle window change
const handleWindowChange = (windowId) => {
  if (!targetTab) return;

  if (windowId === targetTab.targetWindowId) {
    startTimer();
  } else {
    stopTimer();
    console.log(`[${new Date().toLocaleTimeString()}] Target is inactive: CHANGE_FOCUS`);
    activateTarget();
  }

  /*if (targetTab && windowId !== targetTab.targetWindowId) {
    console.log(`[${new Date().toLocaleTimeString()}] Target is inactive: CHANGE_FOCUS`);
    activateTarget();
  }*/
};

// 🏁 Start tracking
const startTracking = async () => {
  targetTab = null;
  activeStartTime = null;

  console.log(`▶️ Start tracking caseId: ${caseId}`);

  targetTab = await findTargetTab();

  if (!targetTab) {
    console.warn("❌ No matching tab found. Check the caseId and URL.");
    return;
  }

  chrome.tabs.onActivated.addListener(handleTabChange);
  chrome.windows.onFocusChanged.addListener(handleWindowChange);

  startTimer();
  activateTarget();
};

// 🛑 Stop tracking
const stopTracking = async () => {
  await stopTimer();

  console.log(`⏹️ Stop tracking caseId: ${caseId}`);
  chrome.tabs.onActivated.removeListener(handleTabChange);
  chrome.windows.onFocusChanged.removeListener(handleWindowChange);

  targetTab = null;
  caseId = "";
  activeStartTime = null;
};

const handleShortcut = (event) => {
  event.preventDefault();

  if (event.key === "`") {
    caseId = prompt("Insert a case ID");
    if (caseId) startTracking();
  } else if (event.key === "Escape") {
    stopTracking();
  } else if (event.key === "t") {
    chrome.storage.local.get("trackingData", ({ trackingData = {} }) => {
      console.log("🗃️ Time spent on all cases:");
      Object.entries(trackingData).forEach(([key, seconds]) => {
        console.log(`${key}: ${formatDuration(seconds)}`);
      });
    });
  } else if (event.key === "d") {
    logDailyCaseIdBreakdown();
  }
};

document.addEventListener("keydown", handleShortcut);

/* const getAllOpenWindows = (winData) => {
  for (const w of winData) {
    if (w.type === "normal" && !w.incognito) {
      for (const tab of w.tabs) {
        if (tab.url?.includes(`rgdmprmd-manga.vercel.app/manga/${caseId}`)) {
          targetTab = { targetTabId: tab.id, targetWindowId: tab.windowId };
          return; // exits early
        }
      }
    }
  }
};*/

/* const getActiveTab = (activeInfo) => {
  if (activeInfo.windowId === targetTab.targetWindowId) {
    if (activeInfo.tabId !== targetTab.targetTabId) {
      console.log(new Date().toLocaleTimeString(), "Target is inactive: CHANGE_TAB");

      activateTarget();
    }
  }
}; */

/* const getActiveWindow = (windowId) => {
  if (windowId !== targetTab.targetWindowId) {
    console.log(new Date().toLocaleTimeString(), "Target is inactive: CHANGE_FOCUS");

    activateTarget();
  }
}; */

/* const getToWork = () => {
  targetTab = null;
  console.log("Starget targeting a case ID: " + caseId);

  chrome.windows.getAll({ populate: true }, getAllOpenWindows);
  chrome.tabs.onActivated.addListener(getActiveTab);
  chrome.windows.onFocusChanged.addListener(getActiveWindow);

  console.log(targetTab);

  activateTarget();
}; */

/* const stopWork = () => {
  console.log("Stop targeting a case ID: " + caseId);

  targetTab = null;
  caseId = "";

  chrome.tabs.onActivated.removeListener(getActiveTab);
  chrome.windows.onFocusChanged.removeListener(getActiveWindow);
}; */
