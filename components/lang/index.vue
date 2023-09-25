<template>
  <div class="flex items-centre gap-5">
    <div class="py-2 px-3 rounded-md shadow cursor-pointer border transition ease-linear font-bold"
    :class="language === lang.code ? 'border-[#4B5563]' : 'hover:border-[#4B5563]'"
    v-for="lang in $store.state.langList.slice(1, 4)" :key="lang.id"
    @click="changeLanguage(lang.code)">
      {{lang.title}}
    </div>
  </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
export default {
  name: 'LangComponent',
  computed: {
    ...mapState({
      language: state => state.language.language
    })
  },
  methods: {
    ...mapMutations({
      change_language: 'language/CHANGE_LANGUAGE' /* Мутация меняющая язык */
    }),
    changeLanguage(lang) {
      this.change_language(lang)
      this.$emit('change', lang)
    }
  },
  mounted() {
    this.change_language('ru')
  },
  destroyed() {
    this.change_language('') /* Возвращаем в версию по умолчанию */
  },
}
</script>
<style scoped>
.shadow {
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.10);
}
</style>
