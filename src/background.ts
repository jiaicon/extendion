import { getCurrentTabId } from './utils';
// import type { Color } from './typings';
// import {
//   red,
//   volcano,
//   gold,
//   yellow,
//   lime,
//   green,
//   cyan,
//   blue,
//   geekblue,
//   purple,
//   magenta,
//   grey,
// } from '@ant-design/colors';

// const colors_box = [
//   red,
//   volcano,
//   gold,
//   yellow,
//   lime,
//   green,
//   cyan,
//   blue,
//   geekblue,
//   purple,
//   magenta,
//   grey,
// ]
// /**
//  * 正常n-m间的随机数，包含n和m
//  * @param n 
//  * @param m 
//  * @returns 
//  */
// function random(n: number, m: number): number {
//   return Math.floor(Math.random() * (m - n + 1)) + n;
// }

function changeTheme(color: string): void {
  console.log(color);
  document.body.style.backgroundColor = color;
}

// chrome.action.onClicked.addListener((tab) => {
//   if (tab.url === 'chrome://extensions/') return; // 在扩展程序页面
//   const colors = colors_box[random(0, colors_box.length - 1)];
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id ? tab.id : -1 },
//     func: changeTheme,
//     args: [colors[random(0, colors.length - 1)]]
//   }).then();
// });

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const { type, value } = message;
  console.log(sender);
  switch (type) {
    case 'change-color':
      chrome.tabs.query({ active: true, currentWindow: true }, function ([tab]) {
        console.log('id', tab);
      })
      const tabId = await getCurrentTabId();
      console.log(tabId);
      chrome.scripting.executeScript({
        target: { tabId: tabId as number },
        func: changeTheme,
        args: [`rgba(${value.r}, ${value.g}, ${value.b}, ${value.a || 1})`],
      })
      sendResponse({ status: true });
      break;
    default:
  }
})

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'popup-port') {
    port.onMessage.addListener(message => {
      const { tabId, value } = message;
      if (tabId) {
        chrome.scripting.executeScript({
          target: { tabId },
          func: changeTheme,
          args: [`rgba(${value.r}, ${value.g}, ${value.b}, ${value.a || 1})`],
        })
      }
    });

    // 向popup发送消息
    port.postMessage("你好，popup！");
  }
});


// chrome.runtime.sendMessage({ type: "checkFlag" }, (response) => {
//     if (response && response.hasOwnProperty("runtime")) {
//         if (response.runtime) {
//             console.log("send message success!");
//         }
//     }
// });
