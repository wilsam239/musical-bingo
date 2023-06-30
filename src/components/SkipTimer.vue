<template>
  <div>
    Skip timer here
  </div>
</template>

<script lang="ts">
import { Meta } from 'quasar';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { defineComponent, PropType, toRef } from 'vue';


export default defineComponent({
  name: 'ExampleComponent',
  props: {
    title: {
      type: String,
      required: true
    },
    todos: {
      type: Array as PropType<Todo[]>,
      default: () => []
    },
    meta: {
      type: Object as PropType<Meta>,
      required: true
    },
    active: {
      type: Boolean
    }
  },
  setup (props) {
    return { ...useClickCount(), ...useDisplayTodo(toRef(props, 'todos')) };
  },
});
</script>
