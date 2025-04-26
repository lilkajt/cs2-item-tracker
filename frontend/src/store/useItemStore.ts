import { create } from 'zustand'
import axios from 'axios'

export type Item = {
  _id: string
  itemName: string
  buyPrice: number
  buyDate: number
  soldPrice: number | null
  soldDate: number | null
  imageUrl: string | null
}

export type Pagination = {
  totalItems: number,
  currentPage: number,
  totalPages: number,
  pageSize: number,
  hasNextPage: boolean,
  hasPrevPage: boolean
}

export type ServerResponse = {
  success: boolean,
  message: string
}

export type ItemStats = {
  averageROI: string,
  averagePrices: {
    buy: string,
    sell: string
  },
  highestProfitItem:{
    itemName: string,
    profit: string
  } | null,
  itemsPurchasedThisMonth: number,
  monthlyData: Array<{
    name: string,
    value: number
  }>
}

type ItemState = {
  items: Item[]
  loading: boolean
  error: string | null
  stats: ItemStats | null
  pagination: Pagination
  loadingItems: boolean
  loadingStats: boolean
  lastItemsFetch: number
  lastStatsFetch: number
  serverResponse: ServerResponse | null
  fetchItems: (page?: number, limit?: number) => Promise<void>
  fetchStats: () => Promise<void>
  updateItem: (id: string, updatedItem: Partial<Item>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  clearServerResponse: () => void
  refreshData: (page?: number) => Promise<void>
}

const API_URL = '/api/item';

const useItemStore = create<ItemState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  stats: null,
  loadingItems: false,
  loadingStats: false,
  lastItemsFetch: 0,
  lastStatsFetch: 0,
  serverResponse: null,
  pagination: {
    totalItems: 0,
    currentPage: 0,
    totalPages: 0,
    pageSize: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  
  refreshData: async (page = get().pagination.currentPage || 1) => {
    try {
      await Promise.all([
        get().fetchItems(page),
        get().fetchStats()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  },

  fetchItems: async (page = 1, limit = 10) => {
    if (get().loadingItems) return;
    const now = Date.now();
    if (now - get().lastItemsFetch < 1000 && get().items.length > 0) {
      return;
    }
    set({ loadingItems: true, error: null })
    await axios.get(`${API_URL}?page=${page}&limit=${limit}`)
    .then( response => {
      set({
        items: response.data.items,
        pagination: response.data.pagination,
        lastItemsFetch: now
      });
    })
    .catch( error => {
      set({
        error: error.response.data.message
      })
    })
    .finally( () => {
      set({
        loadingItems: false
      })
    });
  },

  fetchStats: async () => {
    if (get().loadingStats) return;
    const now = Date.now();
    if (now - get().lastStatsFetch < 1000 && get().stats) {
      return; // Skip if fetched less than 1 second ago
    }
    set({ loadingStats: true, error: null });
    await axios.get(`${API_URL}/stats`)
    .then(response => {
      set({
        stats: response.data.stats,
        lastStatsFetch: now
      });
    })
    .catch(error => {
      set({ 
        error: error.response?.data?.message || 'Failed to load statistics'
      });
    })
    .finally( () => {
      set({loadingStats: false});
    });
  },

  updateItem: async (id, updatedItem) => {
    set({ error: null, serverResponse: null })
    await axios.put(`${API_URL}/update/${id}`, updatedItem)
    .then( response => {
      set({
        serverResponse: {
          success: response.data.success,
          message: response.data.message || "Item updated successfully"
        }
      });
    })
    .catch( error => {
      set({
        error: error.response.data.message || "Failed to update item",
        serverResponse: {
          success: false,
          message: error.response.data.message
        }
      });
    });
  },
  
  deleteItem: async (id) => {
    await axios.delete(`${API_URL}/delete/${id}`)
    .then( response => {
      set({
        serverResponse: {
          success: response.data.success,
          message: response.data.message || "Item deleted successfully"
        }
      });
    })
    .catch( error => {
      set({
        error: error.response.data.message || "Failed to delete item",
        serverResponse: {
          success: false,
          message: error.response.data.message
        }
      });
    });
  },
  clearServerResponse: () => set({serverResponse: null})
}))

export default useItemStore;