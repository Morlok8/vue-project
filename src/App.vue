<script setup>
import {onMounted} from 'vue'

onMounted(() => {
  const darkMode = document.querySelector('body');
  darkMode.setAttribute('data-bs-theme', 'dark');

});
</script>

<template>
  <nav>
    <RouterLink to="/stocks">Go to Stocks</RouterLink>
    <RouterLink to="/incomes">Go to Incomes</RouterLink>
    <RouterLink to="/sales">Go to Sales</RouterLink>
    <RouterLink to="/orders">Go to Orders</RouterLink>
  </nav>
  <main class = "container" data-bs-theme="dark">
    <RouterView/>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
