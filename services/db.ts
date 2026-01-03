
import { Listing, User, RecentSearch, UserPreferences, UserNotification } from '../types';
import { MOCK_LISTINGS, MOCK_USERS } from '../constants';

class DatabaseService {
  private STORAGE_KEYS = {
    LISTINGS: 'nikjoo_listings',
    USERS: 'nikjoo_users',
    BOOKMARKS: 'nikjoo_bookmarks',
    HISTORY: 'nikjoo_search_history',
    PREFS: 'nikjoo_user_preferences',
    CURRENT_USER: 'nikjoo_user'
  };

  async getUsers(): Promise<User[]> {
    const data = localStorage.getItem(this.STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : MOCK_USERS;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
      // If it's the current user not in mock users (new user)
      const currentUserData = localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER);
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData);
        if (currentUser.id === userId) {
          const updated = { ...currentUser, ...updates };
          localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
          return updated;
        }
      }
      return null;
    }
    
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
    
    // Also update current session if it's the same user
    const currentUserData = localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER);
    if (currentUserData) {
      const currentUser = JSON.parse(currentUserData);
      if (currentUser.id === userId) {
        localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[index]));
      }
    }
    
    return users[index];
  }

  async deleteUser(userId: string): Promise<void> {
    const users = await this.getUsers();
    const updatedUsers = users.filter(u => u.id !== userId);
    localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    
    const listings = await this.getListings();
    const updatedListings = listings.filter(l => l.seller.id !== userId);
    localStorage.setItem(this.STORAGE_KEYS.LISTINGS, JSON.stringify(updatedListings));
  }

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

  async getSearchHistory(): Promise<RecentSearch[]> {
    const data = localStorage.getItem(this.STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  }

  // Fix: Add deleteHistoryItem method to satisfy usage in Bookmarks.tsx (Error line 38)
  async deleteHistoryItem(id: string): Promise<void> {
    const history = await this.getSearchHistory();
    const updated = history.filter(h => h.id !== id);
    localStorage.setItem(this.STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  }

  // Fix: Add clearHistory method to satisfy usage in Bookmarks.tsx (Error line 43)
  async clearHistory(): Promise<void> {
    localStorage.setItem(this.STORAGE_KEYS.HISTORY, JSON.stringify([]));
  }

  async addSearchQuery(query: string): Promise<void> {
    if (!query || query.trim().length < 2) return;
    const history = await this.getSearchHistory();
    const filtered = history.filter(h => h.query !== query);
    const newEntry: RecentSearch = { id: Date.now().toString(), query, timestamp: Date.now() };
    localStorage.setItem(this.STORAGE_KEYS.HISTORY, JSON.stringify([newEntry, ...filtered].slice(0, 15)));
  }

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

  async getNotifications(): Promise<UserNotification[]> {
    return [
      { id: '1', title: 'به نیکجو خوش آمدید!', message: 'از اینکه نیکجو را برای معاملات خود انتخاب کردید سپاسگزاریم.', timestamp: '۱ ساعت پیش', isRead: false, type: 'info' },
      { id: '2', title: 'آگهی تایید شد', message: 'آگهی شما با موفقیت بررسی و در لیست انتشار قرار گرفت.', timestamp: '۲ ساعت پیش', isRead: true, type: 'success' },
      { id: '3', title: 'پیام جدید', message: 'شما یک پیام جدید در بخش چت دارید.', timestamp: 'دیروز', isRead: true, type: 'info' }
    ];
  }
}

export const db = new DatabaseService();
