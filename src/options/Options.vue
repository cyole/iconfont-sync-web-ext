<script setup lang="ts">
import { uploadToken } from '~/logic/storage'
</script>

<template>
  <main class="max-w-200 m-auto py-10 text-gray-700 dark:text-gray-200">
    <div text-xl>
      配置
    </div>

    <div flex="~" items-center gap-2 py-4>
      <div shrink-0 text-sm>
        上传用token
      </div>
      <input v-model="uploadToken" border border-gray-400 rounded p-2 w-full>
    </div>

    <div class="mt-4">
      Powered by Vite <pixelarticons-zap class="align-middle inline-block" />
    </div>
  </main>
</template>
