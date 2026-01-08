import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

// Track user authentication events
export const trackAuth = async (eventType, userId, method) => {
  try {
    await addDoc(collection(db, 'analytics_events'), {
      eventType: 'auth',
      action: eventType,
      userId,
      authMethod: method,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Track page/screen views
export const trackPageView = async (pageName, userId = null) => {
  try {
    await addDoc(collection(db, 'analytics_events'), {
      eventType: 'page_view',
      pageName,
      userId,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Track user sessions
export const trackSession = async (action, userId) => {
  try {
    await addDoc(collection(db, 'analytics_events'), {
      eventType: 'session',
      action,
      userId,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Track breathing exercise events
export const trackBreathingExercise = async (exerciseType, action, userId, metadata = {}) => {
  try {
    await addDoc(collection(db, 'analytics_events'), {
      eventType: 'breathing_exercise',
      exerciseType,
      action,
      userId,
      ...metadata,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Track custom events
export const trackEvent = async (eventName, eventData = {}, userId = null) => {
  try {
    await addDoc(collection(db, 'analytics_events'), {
      eventType: 'custom',
      eventName,
      userId,
      ...eventData,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};
