<script setup lang="ts">
import PlusIcon from "~/components/icons/PlusIcon.vue";
import MinusIcon from "~/components/icons/MinusIcon.vue";

const { length = 10, value = 0 } = defineProps<{ length?: Number, value?: Number }>();
const emit = defineEmits()

const count = ref(value);

watch(count, () => emit('change', count.value))

</script>

<template>
  <div class="flex items-center gap-2">
    <button
      class="w-7 h-7 p-2 bg-green-400 flex items-center justify-center rounded-md shadow"
      @click="
        () => {
          if (count > 0) count--;
        }
      "
    >
      <MinusIcon class="fill-white" />
    </button>
    <div class="flex gap-[2px]">
      <button
        v-for="(i, j) in length"
        class="w-5 h-2 first:rounded-l-full last:rounded-r-full border shadow transition-colors"
        :class="{ 'bg-neutral-200': j < count }"
        @click="count = i"
      ></button>
    </div>
    <button
      class="w-7 h-7 p-2 bg-green-400 flex items-center justify-center rounded-md shadow"
      @click="
        () => {
          if (count < 10) count++;
        }
      "
    >
      <PlusIcon class="fill-white" />
    </button>
  </div>
</template>
