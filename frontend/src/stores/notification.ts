import { defineStore } from 'pinia';
import api from '../services/api';
import socketService from '../services/socket';
import type { Notification } from '../types';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[],
    toasts: [] as ToastMessage[],
    unreadCount: 0
  }),

  actions: {
    addToast(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      this.toasts.push({ id, title, message, type });

      setTimeout(() => {
        this.removeToast(id);
      }, 5000);
    },

    removeToast(id: string) {
      this.toasts = this.toasts.filter(t => t.id !== id);
    },

    async fetchNotifications() {
      try {
        const res = await api.get('/buyer/notifications');
        this.notifications = res.data;
        this.unreadCount = this.notifications.filter(n => !n.is_read).length;
      } catch {
        // Silently handle if not logged in
      }
    },

    async markAsRead(id: number) {
      try {
        await api.patch(`/buyer/notifications/${id}/read`);
        const item = this.notifications.find(n => n.id === id);
        if (item && !item.is_read) {
          item.is_read = 1;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      } catch (err) {
        console.error(err);
      }
    },

    async markAllAsRead() {
      try {
        await api.patch('/buyer/notifications/read-all');
        this.notifications.forEach(n => n.is_read = 1);
        this.unreadCount = 0;
      } catch (err) {
        console.error(err);
      }
    },

    initSocketListeners() {
      socketService.on('notification.created', (notif: any) => {
        this.addToast(notif.title || 'Nova Notificação', notif.message, 'warning');
        this.fetchNotifications();
      });
    }
  }
});
