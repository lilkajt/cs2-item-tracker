import { create } from 'zustand'
import axios from 'axios'

export type Item = {
  _id: string
  itemName: string
  buyPrice: number
  buyDate: number
  soldPrice?: number
  soldDate?: number
  imageUrl?: string
}

export type Pagination = {
  totalItems: number,
  currentPage: number,
  totalPages: number,
  pageSize: number,
  hasNextPage: boolean,
  hasPrevPage: boolean
}

type ItemState = {
  items: Item[]
  loading: boolean
  error: string | null
  pagination: Pagination
  fetchItems: () => Promise<void>
  addItem: (item: Omit<Item, 'id'>) => Promise<void>
  updateItem: (id: string, updates: Partial<Item>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
}

const API_URL = '/api/item';

const useItemStore = create<ItemState>((set) => ({
  items: [],
  loading: false,
  error: null,
  pagination: {
    totalItems: 0,
    currentPage: 0,
    totalPages: 0,
    pageSize: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  
  fetchItems: async () => {
    set({ loading: true, error: null })
    await axios.get(API_URL)
    .then( response => {
      set({ items: response.data.items, pagination:response.data.pagination, loading: false });
    })
    .catch( error => {
      set({ loading: false, error: error.response.data.message })
    });
  },
  
  addItem: async (item) => {
    set({ loading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/create`, item)
      set(state => ({ 
        items: [...state.items, response.data],
        loading: false
      }))
    } catch (error) {
      set({ 
        error: axios.isAxiosError(error) && error.response?.data?.message 
          ? error.response.data.message 
          : 'Failed to add item',
        loading: false 
      })
    }
  },
  
  updateItem: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, updates)
      set(state => ({
        items: state.items.map(item => 
          item._id === id ? response.data : item
        ),
        loading: false
      }))
    } catch (error) {
      set({ 
        error: axios.isAxiosError(error) && error.response?.data?.message 
          ? error.response.data.message 
          : 'Failed to update item',
        loading: false 
      })
    }
  },
  
  deleteItem: async (id) => {
    set({ loading: true, error: null })
    try {
      await axios.delete(`${API_URL}/delete/${id}`)
      set(state => ({
        items: state.items.filter(item => item._id !== id),
        loading: false
      }))
    } catch (error) {
      set({ 
        error: axios.isAxiosError(error) && error.response?.data?.message 
          ? error.response.data.message 
          : 'Failed to delete item',
        loading: false 
      })
    }
  },
}))

export default useItemStore