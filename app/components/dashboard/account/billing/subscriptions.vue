<script setup>
const stripeStore = useStripeStore();

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
});
</script>

<template>
    <UCard class="mb-2">
        <template #header>
            <div class="flex items-center justify-between">
                <span class="font-semibold text-lg">
                    {{ stripeStore.getProduct(props.item.plan.product).name }}
                </span>
                <span class="text-gray-600">
                    <UBadge color="neutral" variant="outline" :label="`$${getTotal(stripeStore.getProduct(props.item.plan.product).prices[0].unit_amount)}${getPaymentType(stripeStore.getProduct(props.item.plan.product).prices[0].type)}`" />
                </span>
            </div>
        </template>

        <template #default>
            <ul>
                <li class="flex items-center justify-between py-1">
                    <span>Created Date</span>
                    <UBadge variant="outline">{{ formatTimestamp(props.item.start_date) }}</UBadge>
                </li>
                <li class="flex items-center justify-between py-1">
                    <span>Status</span>
                    <UBadge variant="outline">{{ props.item.status }}</UBadge>
                </li>
                <li class="flex items-center justify-between py-1">
                    <span>Current Start</span>
                    <UBadge variant="outline">{{ formatTimestamp(props.item.current_period_start) }}</UBadge>
                </li>
                <li class="flex items-center justify-between py-1">
                    <span>Current End</span>
                    <UBadge variant="outline">{{ formatTimestamp(props.item.current_period_end) }}</UBadge>
                </li>
            </ul>
        </template>

        <template #footer>
            <DashboardAccountBillingCancel :item="props.item" />
        </template>
    </UCard>
</template>