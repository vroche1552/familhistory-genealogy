import axios, { AxiosError, AxiosInstance } from 'axios';
import { Person, Family, Document, TimelineEvent, KeyFact, ChangelogEntry, UserPreferences } from '@/types';

// API Response Types
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}

// API Client
class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;

  private constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for adding auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for handling errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || 'An error occurred',
          code: error.response?.status?.toString() || '500',
          details: error.response?.data,
        };
        return Promise.reject(apiError);
      }
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Family API Methods
  async getFamilies(): Promise<ApiResponse<Family[]>> {
    const response = await this.client.get<ApiResponse<Family[]>>('/families');
    return response.data;
  }

  async getFamily(id: string): Promise<ApiResponse<Family>> {
    const response = await this.client.get<ApiResponse<Family>>(`/families/${id}`);
    return response.data;
  }

  async createFamily(family: Omit<Family, 'id'>): Promise<ApiResponse<Family>> {
    const response = await this.client.post<ApiResponse<Family>>('/families', family);
    return response.data;
  }

  async updateFamily(id: string, family: Partial<Family>): Promise<ApiResponse<Family>> {
    const response = await this.client.put<ApiResponse<Family>>(`/families/${id}`, family);
    return response.data;
  }

  async deleteFamily(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(`/families/${id}`);
    return response.data;
  }

  // Person API Methods
  async getPerson(id: string): Promise<ApiResponse<Person>> {
    const response = await this.client.get<ApiResponse<Person>>(`/persons/${id}`);
    return response.data;
  }

  async createPerson(person: Omit<Person, 'id'>): Promise<ApiResponse<Person>> {
    const response = await this.client.post<ApiResponse<Person>>('/persons', person);
    return response.data;
  }

  async updatePerson(id: string, person: Partial<Person>): Promise<ApiResponse<Person>> {
    const response = await this.client.put<ApiResponse<Person>>(`/persons/${id}`, person);
    return response.data;
  }

  async deletePerson(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(`/persons/${id}`);
    return response.data;
  }

  // Document API Methods
  async getDocuments(personId: string): Promise<ApiResponse<Document[]>> {
    const response = await this.client.get<ApiResponse<Document[]>>(`/persons/${personId}/documents`);
    return response.data;
  }

  async uploadDocument(personId: string, file: File): Promise<ApiResponse<Document>> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.client.post<ApiResponse<Document>>(
      `/persons/${personId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async deleteDocument(personId: string, documentId: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(
      `/persons/${personId}/documents/${documentId}`
    );
    return response.data;
  }

  // Timeline API Methods
  async getTimelineEvents(personId: string): Promise<ApiResponse<TimelineEvent[]>> {
    const response = await this.client.get<ApiResponse<TimelineEvent[]>>(
      `/persons/${personId}/timeline`
    );
    return response.data;
  }

  async addTimelineEvent(
    personId: string,
    event: Omit<TimelineEvent, 'id'>
  ): Promise<ApiResponse<TimelineEvent>> {
    const response = await this.client.post<ApiResponse<TimelineEvent>>(
      `/persons/${personId}/timeline`,
      event
    );
    return response.data;
  }

  async updateTimelineEvent(personId: string, eventId: string, event: Partial<TimelineEvent>): Promise<ApiResponse<TimelineEvent>> {
    const response = await this.client.patch<ApiResponse<TimelineEvent>>(
      `/persons/${personId}/timeline/${eventId}`,
      event
    );
    return response.data;
  }

  async deleteTimelineEvent(personId: string, eventId: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(
      `/persons/${personId}/timeline/${eventId}`
    );
    return response.data;
  }

  // Key Facts Methods
  async getKeyFacts(personId: string): Promise<ApiResponse<KeyFact[]>> {
    const response = await this.client.get<ApiResponse<KeyFact[]>>(`/persons/${personId}/key-facts`);
    return response.data;
  }

  async addKeyFact(personId: string, fact: Omit<KeyFact, 'id'>): Promise<ApiResponse<KeyFact>> {
    const response = await this.client.post<ApiResponse<KeyFact>>(`/persons/${personId}/key-facts`, fact);
    return response.data;
  }

  async updateKeyFact(personId: string, factId: string, fact: Partial<KeyFact>): Promise<ApiResponse<KeyFact>> {
    const response = await this.client.patch<ApiResponse<KeyFact>>(`/persons/${personId}/key-facts/${factId}`, fact);
    return response.data;
  }

  async deleteKeyFact(personId: string, factId: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(`/persons/${personId}/key-facts/${factId}`);
    return response.data;
  }

  // Changelog Methods
  async getChangelogEntries(personId: string): Promise<ApiResponse<ChangelogEntry[]>> {
    const response = await this.client.get<ApiResponse<ChangelogEntry[]>>(`/persons/${personId}/changelog`);
    return response.data;
  }

  async addChangelogEntry(personId: string, entry: Omit<ChangelogEntry, 'id'>): Promise<ApiResponse<ChangelogEntry>> {
    const response = await this.client.post<ApiResponse<ChangelogEntry>>(`/persons/${personId}/changelog`, entry);
    return response.data;
  }

  async updateChangelogEntry(personId: string, entryId: string, entry: Partial<ChangelogEntry>): Promise<ApiResponse<ChangelogEntry>> {
    const response = await this.client.patch<ApiResponse<ChangelogEntry>>(`/persons/${personId}/changelog/${entryId}`, entry);
    return response.data;
  }

  async deleteChangelogEntry(personId: string, entryId: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(`/persons/${personId}/changelog/${entryId}`);
    return response.data;
  }

  async approveChangelogEntry(personId: string, entryId: string): Promise<ApiResponse<ChangelogEntry>> {
    const response = await this.client.post<ApiResponse<ChangelogEntry>>(`/persons/${personId}/changelog/${entryId}/approve`);
    return response.data;
  }

  async rejectChangelogEntry(personId: string, entryId: string): Promise<ApiResponse<ChangelogEntry>> {
    const response = await this.client.post<ApiResponse<ChangelogEntry>>(`/persons/${personId}/changelog/${entryId}/reject`);
    return response.data;
  }

  // User Preferences Methods
  async getUserPreferences(): Promise<ApiResponse<UserPreferences>> {
    const response = await this.client.get<ApiResponse<UserPreferences>>('/user/preferences');
    return response.data;
  }

  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> {
    const response = await this.client.patch<ApiResponse<UserPreferences>>('/user/preferences', preferences);
    return response.data;
  }

  async resetUserPreferences(): Promise<ApiResponse<UserPreferences>> {
    const response = await this.client.post<ApiResponse<UserPreferences>>('/user/preferences/reset');
    return response.data;
  }

  // Auth API Methods
  async login(email: string, password: string): Promise<ApiResponse<{ token: string }>> {
    const response = await this.client.post<ApiResponse<{ token: string }>>('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<ApiResponse<{ token: string }>> {
    const response = await this.client.post<ApiResponse<{ token: string }>>('/auth/register', userData);
    return response.data;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.client.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  }

  // Notification methods
  async getNotifications() {
    return this.client.get<Notification[]>('/notifications');
  }

  async markNotificationAsRead(notificationId: string) {
    return this.client.patch<Notification>(`/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead() {
    return this.client.patch<Notification[]>('/notifications/read-all');
  }

  async deleteNotification(notificationId: string) {
    return this.client.delete(`/notifications/${notificationId}`);
  }

  async deleteAllNotifications() {
    return this.client.delete('/notifications');
  }

  // Search methods
  async search(query: string, filters: {
    type?: string[];
    dateRange?: {
      start: string;
      end: string;
    };
    location?: string;
  } = {}) {
    return this.client.get<SearchResult[]>('/search', {
      params: {
        query,
        ...filters,
      },
    });
  }

  // File upload methods
  async uploadFile(formData: FormData, config?: {
    onUploadProgress?: (progressEvent: any) => void;
  }) {
    return this.client.post<{ url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    });
  }

  async deleteFile(fileUrl: string) {
    return this.client.delete(`/upload/${encodeURIComponent(fileUrl)}`);
  }
}

export const api = ApiClient.getInstance(); 