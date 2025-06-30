import { createMemoryHistory, createRouter } from 'vue-router'

import StocksView from './components/StocksView.vue'
import IncomesView from './components/IncomesView.vue'
import SalesView from './components/SalesView.vue'
import OrdersView from './components/OrdersView.vue'



const routes = [
  { path: '/', component: StocksView },
  { path: '/stocks', component: StocksView },
  { path: '/incomes', component: IncomesView },
  { path: '/sales', component: SalesView },
  { path: '/orders', component: OrdersView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router