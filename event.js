// 設定規則，只有在 it 邦與 ithome 會激活按鈕功能
const rule = {
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: 'ithome.com.tw' }
        }),
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: 'ithelp.ithome.com.tw' }
        })
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()]
}

// 利用互相 callback 的監聽，來設計規則的新增與移除
chrome.runtime.onInstalled.addListener((details) => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([rule])
    })
})