<template>
  <div
    v-if="show"
    class="modal fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4"
    @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">예약 취소 확인</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-500">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="p-6">
        <p class="text-sm text-gray-900">
          정말로 이 예약을 취소하시겠습니까?
        </p>
        <p class="text-sm text-gray-500 mt-1">
          취소된 예약은 복구할 수 없습니다.
        </p>
      </div>
      <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
          아니오
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700">
          예, 취소합니다
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["close", "confirm"]);
</script>

