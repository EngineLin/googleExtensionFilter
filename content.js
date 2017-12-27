(function() {
  const href = location.href
  let banList
  let isOpen

  console.log('Injet and launch contnet script')

  // 取得 Extension storgae 中的資料
  chrome.storage.sync.get('banList', (res) => {
    banList = res.banList || []
    filterByBanList(href)
  })
  chrome.storage.sync.get('isOpen', (res) => {
    if (res.isOpen === undefined) {
      isOpen = true
    } else {
      isOpen = res.isOpen
    }
    filterByBanList(href)
  })

  // 接收 popup script 傳來的訊息
  chrome.runtime.onMessage.addListener((res, sender, sendRes) => {
    const value = res.newTag
    const status = res.status
    let listNum

    switch (status) {
      case 'add': {
        banList.push(value)
        filterByBanList(href)
        break
      }
      case 'remove': {
        listNum = banList.indexOf(value)
        banList.splice(listNum, 1)
        break
      }
    }
  })

  function filterByBanList(href) {
    let DOM

    if (href.indexOf('//ithelp.ithome.com.tw') === -1) {
      return
    }
    
    DOM = document.querySelectorAll('.qa-list')

    DOM.forEach((obj) => {
      if (banList.length > 0 && isOpen) {
        banList.forEach((tag) => {
          if (obj.innerText.indexOf(tag) !== -1) {
            obj.style.display = 'none'
          }
        })
      }
    })
  }
})()