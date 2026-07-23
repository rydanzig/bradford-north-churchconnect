<script setup lang="ts">
defineProps<{
  open: boolean
  message: string
  loading?: boolean
}>()

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()
</script>

<template>
  <Teleport to="body">
    <div
      class="modal-overlay confirm-delete-overlay"
      :class="{ open }"
      @click.self="emit('cancel')"
    >
      <div class="modal-box confirm-delete-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-delete-title">
        <button type="button" class="modal-close" aria-label="Close" @click="emit('cancel')">
          ✕
        </button>

        <div id="confirm-delete-title" class="modal-title">Confirm Deletion</div>
        <p class="confirm-delete-modal__message">{{ message }}</p>

        <div class="confirm-delete-modal__actions">
          <button
            type="button"
            class="confirm-delete-modal__cancel"
            :disabled="loading"
            @click="emit('cancel')"
          >
            Cancel
          </button>
          <button
            type="button"
            class="confirm-delete-modal__confirm"
            :disabled="loading"
            @click="emit('confirm')"
          >
            {{ loading ? 'Deleting…' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.confirm-delete-overlay {
  z-index: 650;
}

.confirm-delete-modal {
  max-width: 420px;
}

.confirm-delete-modal__message {
  font-size: 14px;
  line-height: 1.55;
  color: var(--gray-800);
  margin: 0 0 24px;
}

.confirm-delete-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.confirm-delete-modal__cancel,
.confirm-delete-modal__confirm {
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.confirm-delete-modal__cancel {
  border: 1.5px solid rgba(26, 39, 68, 0.12);
  background: var(--white);
  color: var(--navy);
}

.confirm-delete-modal__cancel:hover:not(:disabled) {
  background: #f5f5f5;
}

.confirm-delete-modal__confirm {
  border: 1.5px solid rgba(224, 85, 85, 0.35);
  background: #e05555;
  color: var(--white);
}

.confirm-delete-modal__confirm:hover:not(:disabled) {
  background: #c94545;
  border-color: #c94545;
}

.confirm-delete-modal__cancel:disabled,
.confirm-delete-modal__confirm:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>
