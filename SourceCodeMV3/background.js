// background.js
let retryCounts = new Map();

chrome.webNavigation.onErrorOccurred.addListener((details) => {
  if (details.frameId === 0) { // 仅处理主框架错误
    const tabId = details.tabId;
    
    // 获取当前重试次数
    const count = retryCounts.get(tabId) || 0;
    
    if (count < 3) {
      // 增加重试次数并保存
      retryCounts.set(tabId, count + 1);
      
      // 1秒后刷新页面
      setTimeout(() => {
        chrome.tabs.reload(tabId);
      }, 1000);
    }
  }
});

chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId === 0) {
    // 页面加载成功时重置计数器
    retryCounts.delete(details.tabId);
  }
});

// 当标签页关闭时清理内存
chrome.tabs.onRemoved.addListener((tabId) => {
  retryCounts.delete(tabId);
});
