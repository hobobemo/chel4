<script setup lang="ts">
const input = ref('');
const { messages, send } = useChat();

function submit() {
  if (input.value.trim()) {
    send(input.value);
    input.value = '';
  }
}
</script>

<template>
  <div class="p-6 max-w-xl mx-auto space-y-4">
    <h1 class="text-xl font-bold">💬 Real-time Chat</h1>

    <div class="border rounded p-4 h-64 overflow-y-auto bg-gray-50">
      <div v-for="(msg, i) in messages" :key="i" class="mb-1">
        {{ msg }}
      </div>
    </div>

    <form @submit.prevent="submit" class="flex space-x-2">
      <input
        v-model="input"
        type="text"
        class="flex-1 border rounded p-2"
        placeholder="Type a message..."
      />
      <button type="submit" class="bg-blue-500 text-white px-4 rounded">Send</button>
    </form>
  </div>
</template>
