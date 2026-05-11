import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp, where } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { NewsItem } from '../types';

const NEWS_COLLECTION = 'news';
const CACHE_KEY = 'horizon_news_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheData {
  data: NewsItem[];
  timestamp: number;
}

export const newsService = {
  async getLatestNews(pageSize: number = 6): Promise<NewsItem[]> {
    try {
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const cacheData: CacheData = JSON.parse(cached);
        if (Date.now() - cacheData.timestamp < CACHE_DURATION && cacheData.data.length >= pageSize) {
          return cacheData.data.slice(0, pageSize);
        }
      }

      // For general public feed, we explicitly fetch published news.
      const q = query(
        collection(db, NEWS_COLLECTION),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        limit(Math.max(pageSize, 20)) // Fetch a bit more to cache
      );
      
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsItem[];

      // Save to cache
      const cacheToSave: CacheData = {
        data: results,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheToSave));

      return results.slice(0, pageSize);
    } catch (error) {
      // If quota exceeded or error occurs, try to return stale cache or mock data
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const cacheData: CacheData = JSON.parse(cached);
          if (cacheData.data && cacheData.data.length > 0) {
            return cacheData.data.slice(0, pageSize);
          }
        } catch (e) {
          console.error("Cache parse error", e);
        }
      }
      
      try {
        // Fallback to mock news
        const { MOCK_NEWS } = await import('../constants/mockNews');
        return MOCK_NEWS.slice(0, pageSize);
      } catch (mockErr) {
        console.error("Mock news failed to load", mockErr);
        // Last resort, if not already handled or if it's a critical firestore error we want to report
        if (error && error instanceof Error && !error.message.includes('Quota exceeded')) {
          handleFirestoreError(error, OperationType.LIST, NEWS_COLLECTION);
        }
        return [];
      }
    }
  },

  async getArticleById(id: string): Promise<NewsItem | null> {
    try {
      if (id.startsWith('mock-')) {
        const { MOCK_NEWS } = await import('../constants/mockNews');
        return MOCK_NEWS.find(item => item.id === id) || null;
      }
      const { doc, getDoc } = await import('firebase/firestore');
      const docRef = doc(db, NEWS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as NewsItem;
      }
      
      // If doc not found and not a mock ID, check mock data just in case
      const { MOCK_NEWS } = await import('../constants/mockNews');
      return MOCK_NEWS.find(item => item.id === id) || null;
    } catch (error) {
      // Check mock data as fallback on error
      try {
        const { MOCK_NEWS } = await import('../constants/mockNews');
        return MOCK_NEWS.find(item => item.id === id) || null;
      } catch (mockErr) {
        handleFirestoreError(error, OperationType.GET, `${NEWS_COLLECTION}/${id}`);
        return null;
      }
    }
  },

  async createNews(item: Omit<NewsItem, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, NEWS_COLLECTION), {
        ...item,
        publishedAt: item.publishedAt || Timestamp.now(),
        viewCount: item.viewCount || 0
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, NEWS_COLLECTION);
      throw error;
    }
  },

  async ensureArticleExists(title: string, data: Omit<NewsItem, 'id'>) {
    try {
      const { updateDoc, doc } = await import('firebase/firestore');
      // Use a more specific query to avoid permission issues if some drafts exist
      const q = query(collection(db, NEWS_COLLECTION), where('title', '==', title));
      
      // If not logged in as editor, this might fail if the article is not published.
      // We'll wrap it in a try-catch to avoid crashing startup.
      let existing;
      try {
        existing = await getDocs(q);
      } catch (err) {
        console.warn("Permission denied while checking for existing article (likely not yet authorized or article is hidden):", title);
        return null;
      }

      if (existing.empty) {
        return await this.createNews(data);
      }
      const existingId = existing.docs[0].id;
      // Update existing article to sync changes from seed
      try {
        await updateDoc(doc(db, NEWS_COLLECTION, existingId), {
          ...data
        });
      } catch (err) {
        console.warn("Could not update article (permission denied):", title);
      }
      return existingId;
    } catch (error) {
      console.error("Error ensuring article exists:", error);
      return null;
    }
  }
};
