export function getCurrentTabId() {
  return new Promise((resolve, reject) => {
    chrome.tabs?.query({ active: true, currentWindow: true }, function ([tab]) {
      if (tab.id) {
        resolve(tab.id);
      } else {
        reject();
      }
    })
  })
}