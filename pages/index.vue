<template>
  <div>
    <h1 class="font-bold text-2xl">
      Консоль
    </h1>
    <div class="mt-4 mb-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[44px]">
      <div class="item">
        <div class="item-title">
          <h2>
            Публикации
          </h2>
          <h3>
            1 637 записей
          </h3>
        </div>
        <Select class="w-24" :list="publicationsList" textList="text" valueList="value" active="Всего" id="publications"/>
      </div>
      <div class="item">
        <div class="item-title">
          <h2>
            Просмотров
          </h2>
          <h3>
            798 просмотров
          </h3>
        </div>
        <Select class="w-28" :list="viewsList" textList="text" valueList="value" active="Неделя" id="views"/>
      </div>
      <div class="item">
        <div class="item-title">
          <h2>
            Комментарии
          </h2>
          <h3>
            0 комментариев
          </h3>
        </div>
        <Select class="w-28" :list="commentsList" textList="text" valueList="value" active="Сегодня" id="comment"/>
      </div>
    </div>
    <div class="bg-white rounded-lg py-10 px-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-4">
        <h2 class="flex-1 text-lg font-bold">
          История публикаций
        </h2>
        <p class="font-medium text-[#0048B7] text-sm cursor-pointer"
        @click="$router.push('/publications')">
          Посмотреть все
        </p>
      </div>
      <div class="flex flex-col">
        <div v-for="num in 5" :key="num" class="py-2.5 flex flex-col gap-2">
          <p class="text-xs text-[#4B5563]">
            Сегодня, 12:01
          </p>
          <p class="text-sm font-medium">
            “Бароям бисёр нигаронкунанда аст”. Вокуниши Оғохони IV ба ҳодисаҳои охири Бадахшон
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Select from '@/components/selects/default.vue'
export default {
  name: "consolePage",
  head: {
    title: 'Главная',
  },
  components: {
    Select
  },
  data() {
    return {
      publicationsList: [
        {
          id: 1,
          value: 'Всего',
          text: 'Всего'
        },
        {
          id: 2,
          value: 'Всего 2',
          text: 'Всего 2'
        },
        {
          id: 3,
          value: 'Всего 3',
          text: 'Всего 3'
        },
        {
          id: 4,
          value: 'Всего 4',
          text: 'Всего 4'
        },
      ],
      viewsList: [
        {
          id: 1,
          value: 'Неделя',
          text: 'Неделя'
        },
        {
          id: 2,
          value: 'Неделя 2',
          text: 'Неделя 2'
        },
        {
          id: 3,
          value: 'Неделя 3',
          text: 'Неделя 3'
        },
        {
          id: 4,
          value: 'Неделя 4',
          text: 'Неделя 4'
        },
      ],
      commentsList: [
        {
          id: 1,
          value: 'Сегодня',
          text: 'Сегодня'
        },
        {
          id: 2,
          value: 'Сегодня 2',
          text: 'Сегодня 2'
        },
        {
          id: 3,
          value: 'Сегодня 3',
          text: 'Сегодня 3'
        },
        {
          id: 4,
          value: 'Сегодня 4',
          text: 'Сегодня 4'
        },
      ]
    }
  }
};
</script>
<style scoped>
.item {
  background: white;
  padding: 20px 16px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.item-title {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.item-title h2 {
  font-size: 16px;
  font-weight: 600;
}
.item-title h3 {
  font-size: 20px;
  font-weight: 600;
  color: #0048B7;
}
</style>
