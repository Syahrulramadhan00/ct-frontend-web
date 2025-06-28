<template>
  <nuxt-link @click="$emit('selected')" :to="link" class="flex flex-row items-baseline mt-3">
    <i
      :class="[
        'pi',
        icon,
        'mr-1',
        'text-sm',
        { 'text-purple-500': isActive, 'text-slate-400': !isActive },
      ]"
    ></i>
    <p
      :class="[
        'text-sm',
        'font-medium',
        { 'text-purple-500': isActive, 'text-slate-400': !isActive },
      ]"
    >
      {{ title }}
    </p>
  </nuxt-link>
</template>
  
  <script>
import { computed, defineEmits } from "vue";
import { useRoute } from "vue-router";

export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const isActive = computed(() => {
      if (!props.link || !route.path) {
        return false;
      }

      if (props.link === "/") {
        return route.path === props.link;
      }
      return route.path.includes(props.link);
    });

    return {
      isActive,
    };
  },
};


defineEmits(['selected']);
</script>
  
  <style scoped>
/* Tambahkan style tambahan jika diperlukan */
</style>
  