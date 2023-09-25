<template>
<table class="relative w-full rounded-b-lg">
  <thead class="text-sm font-medium text-left">
    <tr>
      <th v-for="head in head" :key="head.id"
      class="px-6 py-3">
      <div class="flex items-center gap-2">
        <p>
          {{head.title}}
        </p>
        <svg v-if="head.isShowFiltr" width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" class="cursor-pointer"
        @click="$emit('filtr', head)">
          <path d="M6.875 13L10 16.125L13.125 13M6.875 8L10 4.875L13.125 8" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      </th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <slot name="body"/>
  </tbody>
</table>
</template>
<script>
export default {
  name: 'TableComponent',
  props: {
    head: {
      type: Array,
      required: true
    },
  }
}
</script>
<style scoped>
table {
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06);
  border: 1px solid #E5E7EB;
  }
table tbody tr {
  height: 52px;
  font-size: 0.875rem; /* 14px */
  line-height: 1.25rem; /* 20px */
}
td {
  padding: 0 24px;
  border-top: 1px solid #E5E7EB;
}
td .status {
  padding: 2px;
  border-radius: 10px;
  display: block;
  text-align: center;
  width: 120px;
  font-size: 12px;
  line-height: 16px;

}
.active {
  background: #D1FAE5;
  color: #065F46;
}
.inactive {
  background: #FEE2E2;
  color: #991B1B;
}
.edit-icon {
  cursor: pointer;
  width: 20px;
  height: 20px;
}
</style>
