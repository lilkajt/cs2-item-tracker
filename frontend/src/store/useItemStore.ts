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

type ItemState = {
  items: Item[]
  loading: boolean
  error: string | null
  pagination: Pagination
  fetchItems: (page?: number, limit?: number) => Promise<void>
  addItem: (item: Omit<Item, 'id'>) => Promise<void>
  updateItem: (id: string, updatedItem: Partial<Item>) => Promise<void>
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
  
  addItem: async (item) => {
    set({ loading: true, error: null });
    await axios.post(`${API_URL}/create`, item)
    .then( response => {
      set( state => ({
        items: [...state.items, response.data.item],
        loading: false
      }));
    })
    .catch( error => {
      set({ loading: false, error: error.response.data.message || "Failed to update item" });
    });
  },
  
  updateItem: async (id, updatedItem) => {
    set({ loading: true, error: null })
    await axios.put(`${API_URL}/update/${id}`, updatedItem)
    .then( response => {
      set({loading: false})
    })
    .catch( error => {
      set( {error: error.response.data.message || "Failed to update item", loading: false});
    });
  },
  
  deleteItem: async (id) => {
    set({ loading: true, error: null })
    await axios.delete(`${API_URL}/delete/${id}`)
    .then( response => {
      set({loading: false});
    })
    .catch( error => {
      set( {error: error.response.data.message || "Failed to delete item", loading: false});
    });
  },
}))

export default useItemStore;