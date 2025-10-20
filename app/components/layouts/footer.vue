<script setup lang="ts">
import Icon from '~/assets/images/chelgg.svg';
const columns = [
  {
    label: 'Resources',
    children: [
      {
        label: 'Help center'
      }, {
        label: 'Docs'
      }, {
        label: 'Roadmap'
      }, {
        label: 'Changelog'
      }
    ]
  }, {
    label: 'Features',
    children: [
      {
        label: 'Affiliates'
      }, {
        label: 'Portal'
      }, {
        label: 'Jobs'
      }, {
        label: 'Sponsors'
      }
    ]
  }, {
    label: 'Company',
    children: [
        {
        label: 'About'
      }, {
        label: 'Pricing'
      }, {
        label: 'Careers'
      }, {
        label: 'Blog'
      }
    ]
  }
]

const toast = useToast()

const email = ref('')
const loading = ref(false)

function onSubmit() {
  loading.value = true

  toast.add({
    title: 'Subscribed!',
    description: 'You\'ve been subscribed to our newsletter.'
  })
}
</script>

<template>
  <USeparator class="h-px">
    <template>
      <Logo class="w-6 h-6"/>
    </template>
  </USeparator>

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>

    </template>

    <template #left>
      <p class="text-muted text-sm">
        Copyright © {{ new Date().getFullYear() }}. All rights reserved.
      </p>
    </template>

    <template #right>

    </template>
  </UFooter>
</template>
