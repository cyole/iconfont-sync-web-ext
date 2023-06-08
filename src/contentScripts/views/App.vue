<script setup lang="ts">
import { onMessage, sendMessage } from 'webext-bridge/content-script'
import { onClickOutside, useToggle } from '@vueuse/core'
import type { Project } from '../types'
import { uploadToken } from '~/logic/storage'
import { getCToken, request } from '~/logic'
import 'uno.css'

const projectInfo = ref<Project>()
const iconAddress = ref('')
const [show] = useToggle(false)
const loading = ref(false)
const message = ref('同步成功')
const button = ref<HTMLButtonElement>()

const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await request('https://api-zdms-dev.zsdx.cn/xm/upload/uploadImage', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${uploadToken.value}`,
    },
  })

  return res.data.url
}

const updateiconAddress = async () => {
  try {
    const res = await request.post('https://www.iconfont.cn/api/project/cdn.json', {
      pid: projectInfo.value?.id,
      t: Date.now(),
      ctoken: getCToken(),
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },

    })

    console.log('更新icon地址成功')
    return res
  }
  catch (error) {
    console.log('更新icon地址失败')
  }
}

const getProjectInfo = async () => {
  const url = window.location.href
  const query = url.split('?')[1]
  const match = query?.match(/projectId=(\d+)/)

  if (match) {
    const projectId = match[1]
    const query = `pid=${projectId}&t=${Date.now()}&ctoken=${getCToken()}`
    const { data } = await request(`https://www.iconfont.cn/api/project/detail.json?${query}`, {
      withCredentials: true,
    })
    const { project, font } = data

    projectInfo.value = project
    iconAddress.value = font.js_file

    // if (project.font_is_old) {
    //   // 更新icon地址
    //   await updateiconAddress()

    //   getProjectInfo()
    // }
  }
}

const handleSync = async () => {
  // const iconAddressContainer = document.querySelector('.project-code-container:not(.hide)')
  // const iconAddress = iconAddressContainer?.querySelector('.code-link')?.innerHTML
  // const iconAddress = projectInfo.value?.js_file
  if (projectInfo.value?.font_is_old === 0) {
    message.value = '该项目已经是最新的了'
    show.value = true
    return
  }

  loading.value = true

  await updateiconAddress()
  await getProjectInfo()

  const fileName = iconAddress.value?.split('/').pop()

  if (iconAddress) {
    const data = await request(iconAddress.value, {
      responseType: 'blob',
    }) as Blob

    const { type } = data
    const file = new File([data], fileName as string, { type })
    const url = await uploadFile(file)

    sendMessage('send-notify', {
      projectName: projectInfo.value?.name,
      url,
    })

    loading.value = false
  }
}

onClickOutside(button, () => {
  show.value = false
})

onMessage('notify-success', ({ data }) => {
  show.value = true

  setTimeout(() => {
    show.value = false
  }, 2000)
})

onMounted(() => {
  getProjectInfo()
})
</script>

<template>
  <div fixed right-0 top-30 m-5 z-100 flex items-end font-sans select-none leading-1em>
    <div
      bg-white text-gray-800 rounded-lg shadow w-max h-min p="x-4 y-2" m="y-auto r-2"
      transition="opacity duration-300"
      opacity-0
      :style="{ opacity: show ? 1 : 0 }"
    >
      <h1 class="text-lg">
        {{ message }}
      </h1>
    </div>
    <button
      ref="button"
      btn
      :disabled="loading"
      @click="handleSync()"
    >
      <i i-carbon:update-now mr-1 />
      同步
    </button>
  </div>
</template>
