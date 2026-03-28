// ─── Momentum App — useNotifications Hook ────────────────────────────────────
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'expo-router';
import {
  requestPermissions,
  addReceivedListener,
  addResponseListener,
  scheduleDailyQuoteReminder,
  cancelAllReminders,
  getAllScheduled,
} from '../features/notifications/notificationService';
import { useApp } from '../context/AppContext';

export const useNotifications = () => {
  const { settings }         = useApp();
  const router               = useRouter();
  const [granted, setGranted] = useState(false);
  const [token,   setToken]  = useState(null);
  const [scheduled, setScheduled] = useState([]);

  const receivedRef = useRef(null);
  const responseRef = useRef(null);

  // ── Request permissions on mount ─────────────────────────────────────────
  useEffect(() => {
    requestPermissions().then(({ granted: g, token: t }) => {
      setGranted(g);
      setToken(t);
    });
  }, []);

  // ── Received listener ─────────────────────────────────────────────────────
  useEffect(() => {
    receivedRef.current = addReceivedListener((notification) => {
      console.log('[useNotifications] Received:', notification.request.content.title);
    });

    return () => receivedRef.current?.remove();
  }, []);

  // ── Response (tap) listener ───────────────────────────────────────────────
  useEffect(() => {
    responseRef.current = addResponseListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.taskId) {
        // Navigate to home with task highlighted
        router.push({ pathname: '/', params: { highlightTask: data.taskId } });
      } else if (data?.type === 'daily_quote') {
        router.push('/');
      }
    });

    return () => responseRef.current?.remove();
  }, [router]);

  // ── Schedule daily quote reminder when settings change ───────────────────
  useEffect(() => {
    if (!granted) return;
    if (settings.dailyQuoteEnabled) {
      scheduleDailyQuoteReminder(settings.dailyQuoteHour, settings.dailyQuoteMinute);
    }
  }, [granted, settings.dailyQuoteEnabled, settings.dailyQuoteHour, settings.dailyQuoteMinute]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const refreshScheduled = useCallback(async () => {
    const list = await getAllScheduled();
    setScheduled(list);
  }, []);

  const clearAll = useCallback(async () => {
    await cancelAllReminders();
    setScheduled([]);
  }, []);

  return {
    granted,
    token,
    scheduled,
    refreshScheduled,
    clearAll,
  };
};

export default useNotifications;
