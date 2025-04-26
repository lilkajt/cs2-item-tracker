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
  serverResponse: ServerResponse | null
  fetchItems: (page?: number, limit?: number) => Promise<void>
  fetchStats: () => Promise<void>
  updateItem: (id: string, updatedItem: Partial<Item>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  clearServerResponse: () => void
}

const API_URL = '/api/item';

const useItemStore = create<ItemState>((set) => ({
  items: [],
  loading: false,
  error: null,
  stats: null,
  serverResponse: null,
  pagination: {
    totalItems: 0,
    currentPage: 0,
    totalPages: 0,
    pageSize: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  
  fetchItems: async (page = 1, limit = 10) => {
    set({ loading: true, error: null })
    await axios.get(`${API_URL}?page=${page}&limit=${limit}`)
    .then( response => {
      set({ items: response.data.items, pagination:response.data.pagination, loading: false });
    })
    .catch( error => {
      set({ loading: false, error: error.response.data.message })
    });
  },

  fetchStats: async () => {
    set({ loading: true, error: null });
    await axios.get(`${API_URL}/stats`)
      .then(response => {
        set({ stats: response.data.stats, loading: false });
      })
      .catch(error => {
        set({ 
          loading: false, 
          error: error.response?.data?.message || 'Failed to load statistics'
        });
      });
  },

  updateItem: async (id, updatedItem) => {
    set({ loading: true, error: null, serverResponse: null })
    await axios.put(`${API_URL}/update/${id}`, updatedItem)
    .then( response => {
      set({
        loading: false,
        serverResponse: {
          success: response.data.success,
          message: response.data.message || "Item updated successfully"
        }
      });
    })
    .catch( error => {
      set({
        error: error.response.data.message || "Failed to update item",
        loading: false,
        serverResponse: {
          success: false,
          message: error.response.data.message
        }
      });
    });
  },
  
  deleteItem: async (id) => {
    set({ loading: true, error: null })
    await axios.delete(`${API_URL}/delete/${id}`)
    .then( response => {
      set({
        loading: false,
        serverResponse: {
          success: response.data.success,
          message: response.data.message || "Item deleted successfully"
        }
      });
    })
    .catch( error => {
      set({
        error: error.response.data.message || "Failed to delete item",
        loading: false,
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