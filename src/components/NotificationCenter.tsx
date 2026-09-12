import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  X, 
  Calendar, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  Mail,
  Clock
} from 'lucide-react';
import { PortalNotification } from '../types/assessment';
import { 
  getNotificationsForUser, 
  markNotificationAsRead, 
  clearPortalNotification, 
  clearAllNotifications 
} from '../services/firebase';
import { useAuth } from '../context/AuthContext';

interface NotificationCenterProps {
  onOpenEmailReminders?: () => void;
  onNavigate?: (route: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  onOpenEmailReminders,
  onNavigate 
}) => {
  const { user, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const data = await getNotificationsForUser(user?.uid, user?.email || undefined, isAdmin);
      setNotifications(data);
    } catch (err) {
      console.warn('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleUpdate = () => {
      fetchNotifications();
    };

    window.addEventListener('portal_notifications_updated', handleUpdate);
    const interval = setInterval(fetchNotifications, 15000);

    return () => {
      window.removeEventListener('portal_notifications_updated', handleUpdate);
      clearInterval(interval);
    };
  }, [user, isAdmin]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read && !n.cleared).length;

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => n.notificationId === id ? { ...n, read: true } : n));
  };

  const handleClearSingle = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await clearPortalNotification(id);
    setNotifications(prev => prev.filter(n => n.notificationId !== id));
  };

  const handleClearAll = async () => {
    setLoading(true);
    await clearAllNotifications(isAdmin, user?.uid);
    setNotifications([]);
    setLoading(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'reminder':
        return <Calendar className="w-4 h-4 text-blue-400 shrink-0" />;
      case 'assessment':
        return <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all border border-slate-700/60 hover:border-slate-600 focus:outline-none cursor-pointer"
        title="Notifications & Weekly Reminders"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-slate-200" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white ring-2 ring-[#0c1222] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0d1424] border border-slate-700/80 shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-800/90 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <button
                  id="clear-all-notifications-btn"
                  onClick={handleClearAll}
                  disabled={loading}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-red-400 px-2 py-1 rounded hover:bg-slate-800/60 transition-colors cursor-pointer"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear all</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800/60 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List Area */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-3 text-slate-500">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-300">All caught up!</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  You have no unread notifications or event reminders.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.notificationId}
                  onClick={() => handleMarkRead(item.notificationId)}
                  className={`p-3.5 hover:bg-slate-800/40 transition-colors cursor-pointer group flex items-start justify-between gap-3 ${
                    !item.read ? 'bg-blue-950/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div className="mt-0.5">
                      {getNotificationIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-semibold text-slate-200 truncate">
                          {item.title}
                        </h4>
                        {!item.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {item.type === 'reminder' && (
                          <span className="text-blue-400 font-sans font-medium">Weekly Reminder</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Individual Clear Button */}
                  <button
                    onClick={(e) => handleClearSingle(e, item.notificationId)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition-all shrink-0"
                    title="Dismiss notification"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Quick Links */}
          <div className="p-2.5 bg-slate-900/80 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            {onOpenEmailReminders && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenEmailReminders();
                }}
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded hover:bg-blue-500/10 transition-colors cursor-pointer"
              >
                <Mail className="w-3 h-3" />
                <span>Email & Reminders Hub</span>
              </button>
            )}

            {isAdmin && onNavigate && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('/admin');
                }}
                className="text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded hover:bg-indigo-500/10 transition-colors cursor-pointer"
              >
                Admin Stream →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
