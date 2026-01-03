import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Member } from '@/lib/types';
import { memberStore } from '@/lib/store';

interface MemberAuthContextType {
  currentMember: Member | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const MemberAuthContext = createContext<MemberAuthContextType | undefined>(undefined);

export function MemberAuthProvider({ children }: { children: ReactNode }) {
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Carregar sessão ao montar
  useEffect(() => {
    const savedSession = localStorage.getItem('member_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        const member = memberStore.getAll().find(m => m.id === session.memberId);
        if (member) {
          setCurrentMember(member);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Erro ao restaurar sessão:', error);
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Buscar membro por email
    const members = memberStore.getAll();
    const member = members.find(m => m.email?.toLowerCase() === email.toLowerCase());

    if (!member || !member.email) {
      return false;
    }

    // Validação simplificada: usar email como senha padrão para demo
    // Em produção, usar hash bcrypt ou similar
    const isValidPassword = password === member.email || password === '123456';

    if (isValidPassword) {
      setCurrentMember(member);
      setIsLoggedIn(true);
      
      // Salvar sessão
      localStorage.setItem('member_session', JSON.stringify({
        memberId: member.id,
        loginTime: new Date().toISOString()
      }));
      
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentMember(null);
    setIsLoggedIn(false);
    localStorage.removeItem('member_session');
  };

  return (
    <MemberAuthContext.Provider value={{ currentMember, isLoggedIn, login, logout }}>
      {children}
    </MemberAuthContext.Provider>
  );
}

export function useMemberAuth() {
  const context = useContext(MemberAuthContext);
  if (!context) {
    throw new Error('useMemberAuth deve ser usado dentro de MemberAuthProvider');
  }
  return context;
}
