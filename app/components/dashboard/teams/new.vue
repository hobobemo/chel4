<script setup lang="ts">
import EA from '@/assets/images/ea.svg'

const leagueStore = useLeagueStore()
const userStore = useUserStore()

const isOpen = ref(false)
const isLoading = ref(false)
const currentStep = ref(0)

const steps = [
  {
    title: 'EA Details',
    description: 'Find Team from EA',
    icon: 'i-simple-icons-ea',
  },
  {
    title: 'Display Details',
    description: 'Set website display info',
    icon: 'i-lucide-tv-minimal',
  },
  {
    title: 'Finalize',
    description: 'Ensure everything is correct',
    icon: 'i-lucide-check-check',
  }
]

const formData = ref({
  clubId: null,
  name: null,
  eaName: null,
  abbr: null,
  logo: null,
  divisionId: 0,
  logoType: 0,
  crestAssetId: null,
  isCustomTeam: null,
  useBaseAsset: null,
  playerRole: null,
  gmRole: null,
  agmRole: null,
  isActive: 1,
  leagueId: leagueStore.getLeagueId,
  userId: userStore.getId
})

function clearForm(){
  formData.value = {
    clubId: null,
    name: null,
    eaName: null,
    abbr: null,
    logo: null,
    divisionId: 0,
    logoType: 0,
    crestAssetId: null,
    isCustomTeam: null,
    useBaseAsset: null,
    playerRole: null,
    gmRole: null,
    agmRole: null,
    isActive: 1,
    leagueId: leagueStore.getLeagueId,
    userId: userStore.getId
  }
}

function handleEa(value: any) {
  formData.value.eaName = value.eaName
  formData.value.clubId = value.clubId
  formData.value.crestAssetId = value.crestAssetId
  formData.value.isCustomTeam = value.isCustomTeam
  formData.value.useBaseAsset = value.useBaseAsset
}

function handleDisplay(value: any){
  formData.value.name = value.name
  formData.value.abbr = value.abbr
}

async function handleSubmit() {
  console.log(formData.value);
  isLoading.value = true

  try {
    const response = await $fetch('/api/league/teams', {
      method: 'POST',
      body: formData.value,
      headers: {
        Authorization: `Bearer ${userStore.getToken}`
      }
    })

    if (response.success === true) {
      leagueStore.addTeam(response.id, formData.value)
      isOpen.value = false
      clearForm();
    } else {
      console.error('Failed to submit', response)
    }
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- Open Button -->
  <UButton icon="i-lucide-plus" size="md" class="rounded-full" @click="isOpen = true" />

  <!-- Modal -->
  <UModal v-model:open="isOpen">
    <!-- Title = Stepper -->
    <template #title>
      <UStepper :items="steps" v-model="currentStep" />
    </template>

    <!-- Step Content -->
    <template #body>
      <div class="min-h-[200px]">
        <div v-if="currentStep === 0">
          <DashboardTeamsStepperEa v-bind="formData ? { item: formData } : {}" @item="handleEa" />
        </div>

        <div v-else-if="currentStep === 1">
          <!-- Replace with real form -->
          <div class="p-4 text-gray-700 dark:text-gray-300">
            <DashboardTeamsStepperDisplay v-bind="formData ? { item: formData } : {}" @item="handleDisplay" />
          </div>
        </div>

        <div v-else-if="currentStep === 2">
          <!-- Replace with real preview/final step -->
          <div class="p-4 text-gray-700 dark:text-gray-300">
            <DashboardTeamsStepperFinal v-bind="formData ? { item: formData } : {}" />
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-6">
        <UButton
          label="Back"
          variant="ghost"
          icon="i-lucide-arrow-left"
          :disabled="currentStep === 0"
          @click="currentStep--"
        />
        <UButton
          v-if="currentStep < steps.length - 1"
          label="Next"
          icon="i-lucide-arrow-right"
          @click="currentStep++"
        />
        <UButton
          v-else
          label="Submit"
          icon="i-lucide-check"
          :loading="isLoading"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
