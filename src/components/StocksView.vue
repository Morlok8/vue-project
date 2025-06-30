<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://109.73.206.144:6969/api/stocks';
const API_KEY = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie';

// formating date 
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + "-" + month + "-" + day;
};

// variables
const stocks = ref([]);


const loading = ref(false);
const error = ref(null);
const totalItems = ref(0);
const page = ref(1);
const limit = ref(100);

const dateFrom = ref(formatDate(new Date()));
const dateTo = ref('2025-06-20');

const sortField = ref(null);
const sortDirection = ref('asc');

const inStock = ref();
// table columns 
const columns = ref([
  { key: 'nm_id', title: 'ID' },
  { key: 'warehouse_name', title: 'Название склада' },
  { key: 'category', title: 'Категория'},
  { key: 'date', title: 'Дата' },
  { key: 'price', title: 'Цена' },
  { key: 'quantity', title: 'Количество' },
  { key: 'is_supply', title: 'В наличии' }
]);

// total pages computed property
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / limit.value);
});

// fetching data method
const fetchData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    //api params 
    const params = {
      dateFrom: dateFrom.value,
      dateTo: dateTo.value,
      page: page.value,
      limit: limit.value,
      key: API_KEY
    };
    
    // sorting values
    if (sortField.value) {
      params.sortBy = sortField.value;
      params.sortDirection = sortDirection.value;
    }
    
    const response = await axios.get(API_URL, { params });
    
    stocks.value = response.data.data; // Предполагаем, что данные в поле data
    totalItems.value = response.data.meta.total; // Предполагаем, что общее количество в поле total

    stocks.value.sort((a, b) => {
        if (sortDirection.value === 'asc') {
            return a[sortField.value] > b[sortField.value] ? 1 : -1;
        } else {
            return a[sortField.value] < b[sortField.value] ? 1 : -1;
        }
    });
    if(inStock.value){
      console.log(inStock.value);
      stocks.value = stocks.value.filter((stock) =>  stock.is_supply === true);
    }
  } catch (err) {
    error.value = err.message || 'Ошибка загрузки данных';
    console.error('Ошибка при загрузке данных:', err);
  } finally {
    loading.value = false;
  }
};
//sorting function
const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
  fetchData();
};

//pagination
const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
    fetchData();
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    fetchData();
  }
};

// loading data on page load
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div>
    <div class="d-flex justify-content-between p-3">
      <div>
        <label>Дата с:</label>
        <input type="date" v-model="dateTo" v-on:change="fetchData" class = "form-control"/>
      </div>
      <div>
        <label>Дата по:</label>
        <input type="date" v-model="dateFrom" v-on:change="fetchData" class = "form-control"/>
      </div>
      <div>
        <label>Элементов на странице:</label>
        <select v-model="limit" v-on:change="fetchData" class = "form-control">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="250">250</option>
          <option value="500">500</option>
        </select>
      </div>
      <label class="d-flex align-items-center gap-3">
        <span class = "pl-3">Показать только в наличии: </span>
        <input type="checkbox" v-model="inStock" v-on:change="fetchData"></label>
      
    </div>

    <div v-if="loading" class="text-light">Загрузка...</div>
    <div v-else>
      <table class="table table-dark table-hover">
        <thead>
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.key"
              @click="sortBy(column.key)"
              :class="{ 'sorted': sortField === column.key }"
            >
              {{ column.title }}
              <span v-if="sortField === column.key">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in stocks" :key="item.id">
            <template v-for="column in columns" :key="column.key">
                <template v-if="column.key === 'is_supply'">
                    <td v-if = "item[column.key] === true ">
                        В наличии
                    </td>
                    <td v-else>
                        Не наличии
                    </td>
                </template>
                <td v-else>
                    {{ item[column.key] }}
                </td>
            </template>
            
          </tr>
        </tbody>
      </table>

      <div class = "d-flex justify-content-center align-items-center">
        <button 
          @click="prevPage" 
          :disabled="page === 1 || loading"
          class = "btn btn-primary"
        >
          Назад
        </button>
        <span class = "p-3">Страница {{ page }} из {{ totalPages }}</span>
        <button 
          @click="nextPage" 
          :disabled="page === totalPages || loading"
          class = "btn btn-primary"
        >
          Вперед
        </button>
      </div>
    </div>
  </div>
</template>
