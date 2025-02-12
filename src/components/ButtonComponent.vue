<script setup lang="ts">
import { computed } from 'vue'

type ButtonHierarchy = '' | 'primary' | 'secondary' | 'tertiary' | 'tertiaryPlain' | 'destructive'
type ButtonSize = 'medium' | 'large' | 'xl' | 'xl2' | 'iconSize' | 'linkSize'

interface ButtonProps {
  hierarchy?: ButtonHierarchy
  size?: ButtonSize
  iconLeft?: boolean
  iconRight?: boolean
  iconOnly?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  hierarchy: '',
  size: 'large',
  iconLeft: false,
  iconRight: false,
  iconOnly: false,
  disabled: false,
})

// Dynamic Object Syntax for Classes
const buttonClasses = computed(() => {
  return {
    button: true,
    [`button--${props.hierarchy}`]: true,
    [`button--${props.size}`]: true,
    'button--icon-only': props.iconOnly,
  }
})
</script>

<template>
  <button v-if="!props.disabled" :class="buttonClasses" v-bind="$attrs" type="submit">
    <span v-if="!iconOnly" class="button__content">
      <span v-if="iconLeft" class="button__icon">
        <slot name="icon-left">
          <!--          this is the default svg-->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26ZM12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502L9.96214 9.69434L5.12921 10.2674L8.70231 13.5717L7.75383 18.3451L12.0006 15.968Z"
            />
          </svg>
        </slot>
      </span>
      <slot />
      <span v-if="iconRight" class="button__icon">
        <slot name="icon-right">
          <!--          this is the default svg-->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26ZM12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502L9.96214 9.69434L5.12921 10.2674L8.70231 13.5717L7.75383 18.3451L12.0006 15.968Z"
            />
          </svg>
        </slot>
      </span>
    </span>
    <span v-else class="button__icon button__icon--only">
      <slot name="icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26ZM12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502L9.96214 9.69434L5.12921 10.2674L8.70231 13.5717L7.75383 18.3451L12.0006 15.968Z"
          />
        </svg>
      </slot>
    </span>
  </button>
  <button v-else disabled :class="buttonClasses" class="bg-gray-500">Please Wait...</button>
</template>

<style scoped>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  box-shadow:
    0 1px 2px 0 rgb(0 0 0 / 0.06),
    0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.button:hover {
  opacity: 0.9;
}

.button:active {
  transform: scale(0.98);
}

/* Content wrapper */
.button__content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Icon styling */
.button__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.button__icon svg {
  width: 100%;
  height: 100%;
}

.button__icon--only {
  width: 24px;
  height: 24px;
}

/* Hierarchy variants */
.button--primary {
  background-color: #4338ca;
  color: #ffffff;
}

.button--secondary {
  background-color: #ffffff;
  color: #171717;
  border: 1px solid #e5e7eb;
}

.button--tertiary {
  background-color: transparent;
  color: #4338ca;
  box-shadow: none;
}

.button--tertiaryPlain {
  background-color: transparent;
  color: #171717;
  box-shadow: none;
}

.button--destructive {
  background-color: #ef4444;
  color: #ffffff;
}

/* Size variants */
.button--medium {
  min-width: 107px;
  height: 40px;
  font-size: 14px;
  line-height: 20px;
}

.button--large {
  min-width: 148px;
  height: 44px;
  font-size: 16px;
  line-height: 24px;
}

.button--xl {
  min-width: 156px;
  height: 48px;
  font-size: 16px;
  line-height: 24px;
}

.button--xl2 {
  min-width: 148px;
  height: 60px;
  font-size: 18px;
  line-height: 28px;
}

.button--iconSize {
  min-width: 56px;
  height: 56px;
}

.button--linkSize {
  /* No sizing. Just the size of the content */
}
</style>
