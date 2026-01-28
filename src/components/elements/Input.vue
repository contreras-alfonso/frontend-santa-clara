<template>
  <q-input
    :label="label"
    :outlined="outlined"
    v-model="inputVal"
    @update:model-value="onInput"
    color="grey-10"
    :label-color="labelColor ? labelColor : 'grey-7'"
    :bg-color="bgColor ? bgColor : 'white'"
    :input-class="[
      'text-grey-10 text-subtitle1',
      {
        'text-center': textCenter,
      },
    ]"
    :readonly="localReadOnly"
    :maxlength="maxLength ? maxLength : undefined"
    :rounded="isRounded ? true : false"
    :square="isSquare ? true : false"
    :type="localIsPwd ? 'password' : isMail ? 'email' : isTextArea ? 'textarea' : 'text'"
    :rules="computedRules"
    :debounce="time"
    hide-bottom-space
    :prefix="prefix"
    no-error-icon
    :loading="localIsLoading"
    :style="props.inputHeight ? { '--input-height': props.inputHeight } : {}"
  >
    <template v-slot:label>
      <div>
        {{ label }} <span class="text-red" v-if="props.rulesConfig?.includes('isRequired')">*</span>
      </div>
    </template>
    <template v-slot:loading>
      <q-spinner color="primary" />
    </template>

    <template v-slot:append>
      <q-icon
        v-if="isColor"
        name="colorize"
        :color="iconColor ? iconColor : 'primary'"
        class="cursor-pointer"
      >
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-color v-model="colorValue" />
        </q-popup-proxy>
      </q-icon>
      <q-icon
        v-if="isPwd"
        :name="localIsPwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        :color="iconColor ? iconColor : 'grey'"
        @click="localIsPwd = !localIsPwd"
      />
    </template>

    <template v-if="icon" v-slot:prepend>
      <q-icon :color="iconColor ? iconColor : 'grey-5'" :name="icon" />
    </template>
    <slot />
  </q-input>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    isReadOnly?: boolean;
    rulesConfig?: unknown[];

    isPwd?: boolean;
    outlined?: boolean;
    isColor?: boolean;

    bgColor?: string;
    maxLength?: string;
    icon?: string;

    isRequired?: boolean;
    isNumber?: boolean;
    isText?: boolean;
    isMail?: boolean;
    isTextArea?: boolean;

    modelValue?: string | number | null;

    time?: string;
    lengthRequired?: number;

    mask?: string;
    prefix?: string;
    color?: string;

    isPositive?: boolean;
    isInteger?: boolean;

    maxValue?: number;
    minValue?: number | string;

    iconColor?: string;
    labelColor?: string;

    isLoading?: boolean;
    isRounded?: boolean;
    noBorder?: boolean;

    inputXl?: boolean;
    textCenter?: boolean;
    isSquare?: boolean;
    borderBlack?: boolean;

    inputHeight?: string;
  }>(),
  {
    outlined: true,
  },
);

const emit = defineEmits(['update:modelValue']);

const localReadOnly = ref(props.isReadOnly);
const localIsPwd = ref(props.isPwd);
const localIsLoading = ref(props.isLoading);

const inputVal = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const colorValue = computed<string | null>({
  get: () => (typeof inputVal.value === 'string' ? inputVal.value : null),
  set: (val) => {
    inputVal.value = val;
  },
});

const onInput = (val: string | number | null) => {
  if (!props.rulesConfig?.includes('isNumber')) {
    inputVal.value = val;
    return;
  }
  const onlyNumbers = String(val).replace(/[^0-9]/g, '');

  inputVal.value = onlyNumbers;
};

const computedRules = computed(() => {
  const rules = [];

  const isRequired = props?.rulesConfig?.includes('isRequired');
  const isEmail = props.rulesConfig?.includes('isEmail');
  const isNumber = props.rulesConfig?.includes('isNumber');
  const lengthRequired = props.lengthRequired;

  const isEmpty = (val: string) => val === null || val === undefined || val === '';

  if (isRequired) {
    rules.push((val: string) => !isEmpty(val) || 'Completa este campo');
  }

  if (isEmail) {
    rules.push((val: string) => {
      if (isEmpty(val)) return true;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return emailRegex.test(val) || 'Correo inválido';
    });
  }

  if (isNumber) {
    rules.push((val: string) => {
      if (isEmpty(val)) return true;

      const numberRegex = /^[0-9]+$/;
      return numberRegex.test(String(val)) || 'Solo se permiten números';
    });
  }

  if (lengthRequired) {
    rules.push((val: string) => {
      if (isEmpty(val)) return true;

      const length = String(val).length;

      if (length !== lengthRequired) {
        const label = isNumber ? 'dígitos' : 'caracteres';
        return `Debe ingresar ${lengthRequired} ${label}`;
      }

      return true;
    });
  }

  return rules;
});

watch(
  () => props.isReadOnly,
  (newValue) => {
    localReadOnly.value = newValue;
  },
);

watch(
  () => props.isLoading,
  (newValue) => {
    localIsLoading.value = newValue;
  },
);
</script>

<style lang="scss"></style>
