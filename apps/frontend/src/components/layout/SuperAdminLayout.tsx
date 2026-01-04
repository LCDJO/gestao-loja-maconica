import React, { useState, ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Settings, LogOut, Bell, Search } from 'lucide-react';
import { SUPER_ADMIN_MENU, MenuItem, MenuSecção } from '@/config/superAdminMenuStructure';
import { useNavigate } from 'wouter';
import styles from './SuperAdminLayout.module.css';

interface SuperAdminLayoutProps {
  children: ReactNode;
  currentPage?: string;
  pageTitle?: string;
  pageDescription?: string;
  actions?: ReactNode;
}

/**
 * SuperAdminLayout
 * Layout profissional para o painel SuperAdmin com:
 * - Sidebar colapsável com menu hierárquico
 * - Header com contexto e notificações
 * - Breadcrumb automático
 * - Indicadores de status e alertas
 * - Dark mode ready
 */
export default function SuperAdminLayout({
  children,
  currentPage,
  pageTitle,
  pageDescription,
  actions,
}: SuperAdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionTitle)
        ? prev.filter((s) => s !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const handleMenuItemClick = (item: MenuItem) => {
    navigate(item.path);
  };

  const filteredMenu = searchQuery.trim()
    ? SUPER_ADMIN_MENU.filter((secção) =>
        secção.itens.some((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : SUPER_ADMIN_MENU;

  return (
    <div className={styles.superAdminLayout}>
      {/* ===== SIDEBAR ===== */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.collapsed}`}>
        {/* Header Sidebar */}
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div className={styles.logoBadge}>SA</div>
            {sidebarOpen && <span className={styles.logoText}>SuperAdmin</span>}
          </div>
          <button
            className={styles.collapseBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Colapsar' : 'Expandir'}
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Search */}
        {sidebarOpen && (
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        )}

        {/* Menu */}
        <nav className={styles.menu}>
          {filteredMenu.map((secção) => (
            <div key={secção.título} className={styles.menuSecção}>
              {sidebarOpen && (
                <button
                  className={`${styles.sectionTitle} ${
                    expandedSections.includes(secção.título) ? styles.expanded : ''
                  }`}
                  onClick={() => toggleSection(secção.título)}
                >
                  <span>{secção.título}</span>
                  <ChevronRight size={16} />
                </button>
              )}

              {(expandedSections.includes(secção.título) || !sidebarOpen) && (
                <div className={styles.submenuList}>
                  {secção.itens.map((item) => (
                    <React.Fragment key={item.id}>
                      {/* Item Principal */}
                      <button
                        className={`${styles.menuItem} ${
                          currentPage === item.id ? styles.active : ''
                        }`}
                        onClick={() => handleMenuItemClick(item)}
                        title={item.label}
                      >
                        <span className={styles.menuIcon}>
                          {item.icon && <item.icon size={18} />}
                        </span>
                        {sidebarOpen && (
                          <>
                            <span className={styles.menuLabel}>{item.label}</span>
                            {item.badge && (
                              <span className={`${styles.badge} ${styles[`badge-${item.badge.cor}`]}`}>
                                {item.badge.texto}
                              </span>
                            )}
                          </>
                        )}
                      </button>

                      {/* Submenu */}
                      {item.submenu && item.submenu.length > 0 && sidebarOpen && (
                        <div className={styles.submenu}>
                          {item.submenu.map((subitem) => (
                            <button
                              key={subitem.id}
                              className={`${styles.submenuItem} ${
                                currentPage === subitem.id ? styles.active : ''
                              }`}
                              onClick={() => handleMenuItemClick(subitem)}
                            >
                              <span className={styles.submenuDot}></span>
                              {subitem.label}
                              {subitem.badge && (
                                <span className={`${styles.badge} ${styles[`badge-${subitem.badge.cor}`]}`}>
                                  {subitem.badge.texto}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer Sidebar */}
        <div className={styles.sidebarFooter}>
          {sidebarOpen && (
            <button className={styles.userInfo}>
              <div className={styles.userAvatar}>JD</div>
              <div className={styles.userDetails}>
                <div className={styles.userName}>João Dev</div>
                <div className={styles.userRole}>SuperAdmin</div>
              </div>
            </button>
          )}
          <button className={styles.logoutBtn} title="Sair">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            {pageTitle && (
              <div className={styles.pageInfo}>
                <h1 className={styles.pageTitle}>{pageTitle}</h1>
                {pageDescription && <p className={styles.pageDescription}>{pageDescription}</p>}
              </div>
            )}
          </div>

          <div className={styles.headerRight}>
            {actions && <div className={styles.actions}>{actions}</div>}

            {/* Notificações */}
            <button className={styles.notificationBtn}>
              <Bell size={20} />
              <span className={styles.notificationBadge}>3</span>
            </button>

            {/* Settings */}
            <button className={styles.settingsBtn}>
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Content */}
        <section className={styles.content}>{children}</section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>
            © 2026 Gestão Loja Maçônica SaaS. v1.0.0 |{' '}
            <a href="#">Status</a> |{' '}
            <a href="#">Documentação</a> |{' '}
            <a href="#">Suporte</a>
          </p>
          <p>
            Última atualização: <time>{new Date().toLocaleString('pt-BR')}</time>
          </p>
        </footer>
      </main>
    </div>
  );
}
