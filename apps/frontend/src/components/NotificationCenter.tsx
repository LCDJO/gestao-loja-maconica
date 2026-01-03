import React, { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Filter } from 'lucide-react';
import { realtimeNotificationStore, RealtimeNotification, notificationFilterStore, NotificationFilter } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filters, setFilters] = useState<NotificationFilter>(notificationFilterStore.get());

  useEffect(() => {
    // Carregar notificações iniciais
    const allNotifications = realtimeNotificationStore.getAll();
    setNotifications(allNotifications);
    setUnreadCount(realtimeNotificationStore.getUnreadCount());

    // Simular notificações em tempo real (em produção, seria via WebSocket)
    const interval = setInterval(() => {
      const currentNotifications = realtimeNotificationStore.getAll();
      setNotifications(currentNotifications);
      setUnreadCount(realtimeNotificationStore.getUnreadCount());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = (id: string) => {
    realtimeNotificationStore.markAsRead(id);
    const updated = realtimeNotificationStore.getAll();
    setNotifications(updated);
    setUnreadCount(realtimeNotificationStore.getUnreadCount());
  };

  const handleMarkAllAsRead = () => {
    realtimeNotificationStore.markAllAsRead();
    const updated = realtimeNotificationStore.getAll();
    setNotifications(updated);
    setUnreadCount(0);
  };

  const handleDelete = (id: string) => {
    realtimeNotificationStore.delete(id);
    const updated = realtimeNotificationStore.getAll();
    setNotifications(updated);
    setUnreadCount(realtimeNotificationStore.getUnreadCount());
  };

  const handleDeleteAll = () => {
    realtimeNotificationStore.deleteAll();
    setNotifications([]);
    setUnreadCount(0);
  };

  const applyFilters = (notifs: RealtimeNotification[]): RealtimeNotification[] => {
    let filtered = notifs;

    // Filtrar por tipo
    if (filters.type) {
      filtered = filtered.filter(n => n.type === filters.type);
    }

    // Filtrar por status de leitura
    if (filters.readStatus === 'lidos') {
      filtered = filtered.filter(n => n.read);
    } else if (filters.readStatus === 'nao-lidos') {
      filtered = filtered.filter(n => !n.read);
    }

    // Filtrar por data
    if (filters.startDate) {
      const startDate = new Date(filters.startDate).getTime();
      filtered = filtered.filter(n => new Date(n.timestamp).getTime() >= startDate);
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate).getTime();
      filtered = filtered.filter(n => new Date(n.timestamp).getTime() <= endDate);
    }

    return filtered;
  };

  const handleFilterChange = (newFilters: NotificationFilter) => {
    setFilters(newFilters);
    notificationFilterStore.set(newFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters: NotificationFilter = {
      type: undefined,
      startDate: undefined,
      endDate: undefined,
      readStatus: 'todos',
    };
    setFilters(defaultFilters);
    notificationFilterStore.reset();
  };

  const filteredNotifications = applyFilters(notifications);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comunicado':
        return '📢';
      case 'reuniao':
        return '📅';
      case 'sistema':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'comunicado':
        return 'bg-blue-50 border-blue-200';
      case 'reuniao':
        return 'bg-purple-50 border-purple-200';
      case 'sistema':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="relative">
      {/* Botão de Notificações */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        title="Notificações"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Painel de Notificações */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Notificações</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  title="Marcar todas como lidas"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filtros */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-b border-gray-200 bg-white">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <Filter className="w-3 h-3" /> Filtros
              </button>
              {showFilters && (
                <div className="mt-3 space-y-2 pb-2">
                  <div>
                    <label className="text-xs font-medium text-gray-700">Tipo</label>
                    <Select value={filters.type || ''} onValueChange={(v) => handleFilterChange({...filters, type: v as any})}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os tipos</SelectItem>
                        <SelectItem value="comunicado">Comunicados</SelectItem>
                        <SelectItem value="reuniao">Reuniões</SelectItem>
                        <SelectItem value="sistema">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Status</label>
                    <Select value={filters.readStatus || 'todos'} onValueChange={(v) => handleFilterChange({...filters, readStatus: v as any})}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todas</SelectItem>
                        <SelectItem value="lidos">Lidas</SelectItem>
                        <SelectItem value="nao-lidos">Não lidas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-gray-600 hover:text-gray-900 font-medium w-full text-center py-1"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Lista de Notificações */}
          <div className="overflow-y-auto flex-1">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>{notifications.length === 0 ? 'Nenhuma notificação' : 'Nenhuma notificação com esses filtros'}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 border-l-4 transition-colors',
                      notification.read
                        ? 'bg-white border-l-gray-200'
                        : 'bg-blue-50 border-l-blue-500'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.timestamp).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Marcar como lida"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remover"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rodapé */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleDeleteAll}
                className="w-full text-xs text-gray-600 hover:text-gray-900 font-medium py-2"
              >
                Limpar tudo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
