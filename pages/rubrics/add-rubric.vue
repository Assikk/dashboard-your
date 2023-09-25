<template>
  <div>
    <head-grid>
      <head-title head_title="Рубрики" />
    </head-grid>
    <main-bg>
      <add-posts-form-slot>
        <p>Название</p>
        <input
          type="text"
          name=""
          id=""
          placeholder="Введите название рубрики"
        />
        <p>Описание</p>
        <textarea name="" id="" cols="30" rows="5"></textarea>
        <div class="flex gap-5">
          <button class="_blue-button">Сохранить</button>
          <link-to-back/>
        </div>
      </add-posts-form-slot>
    </main-bg>
  </div>
</template>

<script>
export default {
  name: "add-rubric",
  components: { },
};
</script>
