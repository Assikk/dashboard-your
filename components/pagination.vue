<template>
  <div class="flex items-center gap-4 justify-between mt-5 mx-6">
    <p class="text-sm text-[#374151]">
      {{to}} из {{total}} результатов
    </p>
    <paginate
      :value="value"
      :page-count="lastPage"
      :page-range="3"
      :margin-pages="2"
      :click-handler="(page) => $emit('click', page)"
      :prev-text="'<'"
      :next-text="'>'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    >
    </paginate>
  </div>
</template>
<script>
import Paginate from "@/node_modules/vuejs-paginate";
export default {
  name: 'PaginationComponent',
  components: {
    Paginate
  },
  props: {
    lastPage: {
      default: 0
    },
    total: {},
    to: {},
    value: ''
  },
}
</script>
