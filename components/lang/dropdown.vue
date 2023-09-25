<template>
  <select name="lang" id="lang"
  class="px-3 py-2 focus:outline-none"
  @input="changeLanguage">
    <option :value="item.code" v-for="item in $store.state.langList" :key="item.id"
    :selected="language == item.code">
      {{item.text}}
    </option>
  </select>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
export default {
  name: 'selectComponent',
  computed: {
    ...mapState({
      language: state => state.language.language
    })
  },
  methods: {
    ...mapMutations({
      change_language: 'language/CHANGE_LANGUAGE' /* Мутация меняющая язык */
    }),
    changeLanguage(value) {
      this.change_language(value.target.value)
    }
  }
}
</script>
