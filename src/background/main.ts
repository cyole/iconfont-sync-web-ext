import { onMessage, sendMessage } from 'webext-bridge/background'
import type { Tabs } from 'webextension-polyfill'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {
  console.log('Extension installed')
})

let previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId
    return
  }

  let tab: Tabs.Tab

  try {
    tab = await browser.tabs.get(previousTabId)
    previousTabId = tabId
  }
  catch {
    return
  }

  console.log('previous tab', tab)
  sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
})

onMessage('get-current-tab', async () => {
  try {
    const tab = await browser.tabs.get(previousTabId)
    return {
      title: tab?.title,
    }
  }
  catch {
    return {
      title: undefined,
    }
  }
})

onMessage('send-notify', async ({ sender, data }) => {
  const { projectName, url } = data as any

  const content = `${projectName} 图标库已同步，地址：${url}`
  const dingtalkWebhook = 'https://oapi.dingtalk.com/robot/send?access_token=70cd08844135dbc6ffa50a3f01bdd141884f6a587391b68656b960f4a29a51ce'
  const params = {
    msgtype: 'text',
    text: { content },
  }

  console.log('send-notify', data)

  const res = await fetch(dingtalkWebhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  const result = await res.json()
  if (result.errcode === 0)
    sendMessage('notify-success', { title: '发送成功' }, { context: 'content-script', tabId: sender.tabId })
})
