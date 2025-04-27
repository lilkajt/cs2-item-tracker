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

export type SortField = 'buyDate' | 'soldDate' | 'buyPrice' | 'soldPrice' | 'profit' | null;
export type SortDirection = 'asc' | 'desc';

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
  yearlyData: {
    [year: string]: Array<{
      name: string,
      value: string
    }>
  }
}

type ItemState = {
  allItems: Item[]
  displayItems: Item[]
  loading: boolean
  error: string | null
  stats: ItemStats | null
  pagination: Pagination
  loadingItems: boolean
  loadingStats: boolean
  lastItemsFetch: number
  lastStatsFetch: number
  serverResponse: ServerResponse | null

  sortField: SortField
  sortDirection: SortDirection

  fetchAllItems: () => Promise<void>
  fetchItems: (page?: number, limit?: number) => Promise<void>
  fetchStats: () => Promise<void>
  updateItem: (id: string, updatedItem: Partial<Item>) => Promise<void>
  updateDisplayItems: () => void
  deleteItem: (id: string) => Promise<void>
  clearServerResponse: () => void
  refreshData: (page?: number) => Promise<void>

  setPage: (page: number) => void
  setSorting: (field: SortField, direction?: SortDirection) => void
  addItem: (item: Item) => void
}

const API_URL = '/api/items';
const PAGE_SIZE = 10;

const useItemStore = create<ItemState>((set, get) => ({
  allItems: [],
  displayItems: [],
  loading: false,
  error: null,
  stats: null,
  loadingItems: false,
  loadingStats: false,
  lastItemsFetch: 0,
  lastStatsFetch: 0,
  serverResponse: null,
  sortField: null,
  sortDirection: 'desc',
  pagination: {
    totalItems: 0,
    currentPage: 1,
    totalPages: 0,
    pageSize: PAGE_SIZE,
    hasNextPage: false,
    hasPrevPage: false
  },

  updateDisplayItems: () => {
    const { allItems, pagination, sortField, sortDirection } = get();
    const { currentPage, pageSize } = pagination;
    
    const sortedItems = [...allItems].sort((a, b) => {
      if (!sortField) return 0;
      
      if (sortField === 'profit') {
        const profitA = a.soldPrice !== null ? a.soldPrice - a.buyPrice : -a.buyPrice;
        const profitB = b.soldPrice !== null ? b.soldPrice - b.buyPrice : -b.buyPrice;
        return sortDirection === 'asc' ? profitA - profitB : profitB - profitA;
      }
      
      if (sortField === 'soldDate' || sortField === 'soldPrice') {
        const valueA = a[sortField] !== null ? a[sortField] : -Infinity;
        const valueB = b[sortField] !== null ? b[sortField] : -Infinity;
        return sortDirection === 'asc' ? 
          (valueA || 0) - (valueB || 0) : 
          (valueB || 0) - (valueA || 0);
      }
      
      return sortDirection === 'asc' ? 
        (a[sortField] || 0) - (b[sortField] || 0) : 
        (b[sortField] || 0) - (a[sortField] || 0);
    });
    
    const startIndex = (currentPage - 1) * pageSize;
    const displayItems = sortedItems.slice(startIndex, startIndex + pageSize);
    
    const totalItems = allItems.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    set({
      displayItems,
      pagination: {
        ...get().pagination,
        totalItems,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
      }
    });
  },
  
  fetchAllItems: async () => {
    if (get().loadingItems) return;
    const now = Date.now();
    
    if (now - get().lastItemsFetch < 2000 && get().allItems.length > 0) {
      return;
    }
    
    set({ loadingItems: true, error: null });
    await axios.get(`${API_URL}/all`)
    .then( response => {
      set({
        allItems: response.data.items,
        lastItemsFetch: now
      });
      get().updateDisplayItems();
    })
    .catch( error => {
      set({
        error: error.response?.data?.message || 'Failed to load items'
      });
    })
    .finally( () => {
      set({ loadingItems: false });
    });
  },

  refreshData: async (page = get().pagination.currentPage) => {
    try {
      await Promise.all([
        get().fetchAllItems(),
        get().fetchStats()
      ]);
      get().setPage(page);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  },

  fetchItems: async (page = 1, limit = PAGE_SIZE) => {
    await get().fetchAllItems();
    get().setPage(page);
  },

  fetchStats: async () => {
    if (get().loadingStats) return;
    const now = Date.now();
    if (now - get().lastStatsFetch < 2000 && get().stats) {
      return;
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

  setPage: (page: number) => {
    set(state => ({
      pagination: {
        ...state.pagination,
        currentPage: page
      }
    }));
    get().updateDisplayItems();
  },

  setSorting: (field: SortField, direction?: SortDirection) => {
    const newDirection = direction || 
      (field === get().sortField && get().sortDirection === 'desc' ? 'asc' : 'desc');
    
    set({
      sortField: field,
      sortDirection: newDirection
    });
    
    get().updateDisplayItems();
  },

  updateItem: async (id, updatedItem) => {
    set({ error: null, serverResponse: null })
    await axios.put(`${API_URL}/update/${id}`, updatedItem)
    .then( response => {
      const updatedItems = get().allItems.map(item =>
        item._id === id ? {...item, ...updatedItem} : item
      );

      set({
        allItems: updatedItems,
        serverResponse: {
          success: response.data.success,
          message: response.data.message || "Item updated successfully"
        }
      });
      get().updateDisplayItems();
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
      const updatedItems = get().allItems.filter(item => item._id !== id);
      set({
        allItems: updatedItems,
        serverResponse: {
          success: response.data.success,
          message: response.data.message || "Item deleted successfully"
        }
      });
      get().updateDisplayItems();
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

  addItem: (item: Item) => {
    const updatedItems = [item, ...get().allItems];
    
    set({ allItems: updatedItems });
    get().updateDisplayItems();
  },

  clearServerResponse: () => set({serverResponse: null})
}))

export default useItemStore;