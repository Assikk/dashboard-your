<template>
  <div
    @click="modalClose"
    class="_layoul-positions grid grid-rows-[repeat(28,_1fr)] max-w-[520px] max-h-[2317px] mx-auto gap-2 my-10 absolute w-full top-0 z-10 bg-white px-5 py-10 shadow-md"
  >
    <span class="absolute top-2 flex justify-between w-full border-b px-5 pb-1"
      ><p class="font-bold">Позиции на сайте</p>
      <img
        @click="modalClose"
        class="w-[16px] cursor-pointer"
        src="../assets/images/close-layoult.svg"
        alt=""
    /></span>
    <div @click="choose1" class="bg-[#6B7280] row-span-1">
      <h2 class="text-white">ADVERTISIMENT</h2>
      <h2 class="text-white">1920x200</h2>
    </div>
    <main class="grid grid-flow-col gap-2 text-black row-span-3">
      <div class="bg-[#D1D5DB]">
        <h2>A1 (10$)</h2>
      </div>
      <div class="bg-[#D1D5DB]">
        <h2>A2 (10$)</h2>
      </div>
      <div class="bg-[#D1D5DB]">
        <h2>A3 (10$)</h2>
      </div>
    </main>
    <div class="bg-[#D1D5DB] row-span-1">
      <h2>A4 (10$)</h2>
    </div>
    <div class="bg-[#D1D5DB] row-span-3">
      <h2>A5 (10$)</h2>
    </div>
    <div class="bg-[#D1D5DB] row-span-1">
      <h2>A6 (10$)</h2>
    </div>
    <main class="grid grid-flow-col gap-2 text-black row-span-3">
      <div class="bg-[#D1D5DB]">
        <h2>A7 (10$)</h2>
      </div>
      <div class="bg-[#D1D5DB]">
        <h2>A8 (10$)</h2>
      </div>
    </main>
    <main class="grid grid-flow-col gap-2 text-black row-span-3">
      <div class="bg-[#4B5563]">
        <h2 class="text-white">PARTNERS PLACE</h2>
      </div>
      <div class="bg-[#4B5563]">
        <h2 class="text-white">PARTNERS PLACE</h2>
      </div>
      <div class="bg-[#4B5563]">
        <h2 class="text-white">NEWSLETTER</h2>
      </div>
    </main>
    <div class="bg-[#4B5563] row-span-3">
      <h2 class="text-white">AFFICHE</h2>
    </div>
    <div class="bg-[#6B7280] row-span-1">
      <h2 class="text-white">ADVERTISIMENT</h2>
      <h2 class="text-white">1280x200</h2>
    </div>
    <div class="bg-[#4B5563] row-span-3">
      <h2 class="text-white">SPECIAL PROJECTS</h2>
    </div>
    <main class="grid grid-flow-col gap-2 text-black row-span-3">
      <div class="bg-[#4B5563]">
        <h2 class="text-white">PARTNERS PLACE</h2>
      </div>
      <div class="bg-[#6B7280]">
        <h2 class="text-white">ADVERTISIMENT</h2>
        <h2 class="text-white">410x440</h2>
      </div>
      <div class="bg-[#4B5563]">
        <h2 class="text-white">PARTNERS PLACE</h2>
      </div>
    </main>
    <main class="grid grid-flow-col gap-2 text-black row-span-2">
      <div class="bg-[#D1D5DB]">
        <h2>A9 (10$)</h2>
      </div>
      <div class="bg-[#D1D5DB]">
        <h2>A10 (10$)</h2>
      </div>
      <div class="bg-[#D1D5DB]">
        <h2>A11 (10$)</h2>
      </div>
      <div class="bg-[#D1D5DB]">
        <h2>A12 (10$)</h2>
      </div>
    </main>
    <div class="bg-[#6B7280] row-span-1">
      <h2 class="text-white">ADVERTISIMENT</h2>
      <h2 class="text-white">1280x200</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "layoult-positions",
  methods: {
    modalClose() {
      this.$emit("modalClose");
    },
    choose1() {
      this.$emit("choose1");
    },
  },
};
</script>
