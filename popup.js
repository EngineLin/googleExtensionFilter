const tabObj = {
  active: true,
  currentWindow: true,
  url: [
    '*://ithelp.ithome.com.tw/*'
  ]
}
let isOpen
let banList = []

document.addEventListener('DOMContentLoaded', () => {
  const sentButton = document.getElementById('sendButton')
  const checkbox = document.getElementById('switch')

  chrome.storage.sync.get('banList', (res) => {
    banList = res.banList || []
    setTagsZoom()
  })

  chrome.storage.sync.get('isOpen', (res) => {
    if (res.isOpen === undefined) {
      isOpen = true
    } else {
      isOpen = res.isOpen
    }
    checkbox.checked = isOpen
  })

  sentButton.addEventListener('click', () => {
    const input = document.getElementById('input')
    const value = input.value

    // 判斷 1.輸入框有值 2.值沒有重複
    if (value && banList.indexOf(value) === -1) {
      banList.push(value)
      chrome.storage.sync.set({ 'banList': banList })
      setTagsZoom()
      chrome.tabs.query(tabObj, (tabs) => {
        const msg = {
          newTag: value,
          status: 'add'
        }

        // 將新建立的 tag 丟給 content script
        chrome.tabs.sendMessage(tabs[0].id, msg)
      })
    }
  })

  // 開啟或關閉過濾功能
  checkbox.addEventListener('change', (e) => {
    const value = e.target.checked
    chrome.storage.sync.set({ 'isOpen': value })
  })
})

function setTagsZoom() {
  const tagsZoom = document.getElementById('tagsZoom')
  let tempHTML = ''
  let jsBtn
  let i

  if (banList.length > 0) {
    banList.forEach((tag, index) => {
      tempHTML += `<button class="btn btn-danger btn-style js-btn">${tag}</button>`
    })
  } else {
    tempHTML += `<button class="btn btn-info btn-style">目前沒有標籤</button>`
  }

  tagsZoom.innerHTML = tempHTML
  jsBtn = document.getElementsByClassName('js-btn')

  for (i = 0; i < jsBtn.length; i += 1) {
    jsBtn[i].addEventListener('click', removeTag)
  }
}

function removeTag(e) {
  const value = e.target.textContent
  const listNum = banList.indexOf(value)

  banList.splice(listNum, 1)
  chrome.storage.sync.set({ 'banList': banList })
  setTagsZoom()

  chrome.tabs.query(tabObj, (tabs) => {
    const msg = {
      newTag: value,
      status: 'remove'
    }

    chrome.tabs.sendMessage(tabs[0].id, msg)
  })
}
