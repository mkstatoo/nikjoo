
import { Listing, User, RecentSearch, UserPreferences } from '../types';
import { MOCK_LISTINGS, MOCK_USERS } from '../constants';

/**
 * Nikjoo Advanced Database Service
 * این کلاس نقش بک‌اِند را ایفا می‌کند و تمام عملیات‌ها را به صورت Async انجام می‌دهد.
 */
class DatabaseService {
  private STORAGE_KEYS = {
    LISTINGS: 'nikjoo_listings',
    USERS: 'nikjoo_users',
    BOOKMARKS: 'nikjoo_bookmarks',
    HISTORY: 'nikjoo_search_history',
    PREFS: 'nikjoo_user_preferences'
  };

  // --- Users Management ---
  async getUsers(): Promise<User[]> {
    const data = localStorage.getItem(this.STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : MOCK_USERS;
  }

  async deleteUser(userId: string): Promise<void> {
    const users = await this.getUsers();
    const updatedUsers = users.filter(u => u.id !== userId);
    localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    
    // پاکسازی آگهی‌های کاربر حذف شده (Integrity Check)
    const listings = await this.getListings();
    const updatedListings = listings.filter(l => l.seller.id !== userId);
    localStorage.setItem(this.STORAGE_KEYS.LISTINGS, JSON.stringify(updatedListings));
  }

  // --- Listings Management ---
  async getListings(): Promise<Listing[]> {
    const data = localStorage.getItem(this.STORAGE_KEYS.LISTINGS);
    return data ? JSON.parse(data) : MOCK_LISTINGS;
  }

  async saveListing(listing: Listing): Promise<void> {
    const listings = await this.getListings();
    localStorage.setItem(this.STORAGE_KEYS.LISTINGS, JSON.stringify([listing, ...listings]));
  }

  async deleteListing(id: string): Promise<void> {
    const listings = await this.getListings();
    const updatedListings = listings.filter(l => l.id !== id);
    localStorage.setItem(this.STORAGE_KEYS.LISTINGS, JSON.stringify(updatedListings));
  }

  async incrementView(id: string): Promise<void> {
    const listings = await this.getListings();
    const updated = listings.map(l => l.id === id ? { ...l, views: (l.views || 0) + 1 } : l);
    localStorage.setItem(this.STORAGE_KEYS.LISTINGS, JSON.stringify(updated));
  }

  async updateListingStatus(id: string, status: Listing['status']): Promise<void> {
    const listings = await this.getListings();
    const updated = listings.map(l => l.id === id ? { ...l, status } : l);
    localStorage.setItem(this.STORAGE_KEYS.LISTINGS, JSON.stringify(updated));
  }

  // --- Search History ---
  async getSearchHistory(): Promise<RecentSearch[]> {
    const data = localStorage.getItem(this.STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  }

  async addSearchQuery(query: string): Promise<void> {
    if (!query || query.trim().length < 2) return;
    const history = await this.getSearchHistory();
    const filtered = history.filter(h => h.query !== query);
    const newEntry: RecentSearch = { id: Date.now().toString(), query, timestamp: Date.now() };
    localStorage.setItem(this.STORAGE_KEYS.HISTORY, JSON.stringify([newEntry, ...filtered].slice(0, 15)));
  }

  async deleteHistoryItem(id: string): Promise<void> {
    const history = await this.getSearchHistory();
    localStorage.setItem(this.STORAGE_KEYS.HISTORY, JSON.stringify(history.filter(h => h.id !== id)));
  }

  async clearHistory(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEYS.HISTORY);
  }

  // --- User Preferences & Bookmarks ---
  async getBookmarks(): Promise<string[]> {
    const data = localStorage.getItem(this.STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  }

  async toggleBookmark(id: string): Promise<string[]> {
    const current = await this.getBookmarks();
    const updated = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    localStorage.setItem(this.STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  }

  getUserPreferences(): UserPreferences {
    const data = localStorage.getItem(this.STORAGE_KEYS.PREFS);
    return data ? JSON.parse(data) : { viewMode: 'list', theme: 'light', notifications: true };
  }

  setUserPreferences(prefs: Partial<UserPreferences>): void {
    const current = this.getUserPreferences();
    localStorage.setItem(this.STORAGE_KEYS.PREFS, JSON.stringify({ ...current, ...prefs }));
  }
}

export const db = new DatabaseService();