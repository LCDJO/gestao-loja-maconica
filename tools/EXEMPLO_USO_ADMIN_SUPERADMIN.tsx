/**
 * EXEMPLO DE USO - Componentes AdminProtectedRoute e SuperAdminProtectedRoute
 * 
 * Este arquivo mostra como integrar os novos componentes de proteção
 * no App.tsx para rotas com diferenciação de Admin vs Super-Admin
 */

// =====================================================================
// EXEMPLO 1: Usando AdminProtectedRoute em uma rota
// =====================================================================

// Antes (sem proteção clara):
// <Route path="/admin/secretaria/membros" component={ListaMembros} />

// Depois (com proteção de role):
// <Route path="/admin/secretaria/membros">
//   <AdminProtectedRoute>
//     <ListaMembros />
//   </AdminProtectedRoute>
// </Route>

// Ou em uma função wrapper:
// <Route path="/admin/secretaria/membros" component={AdminListaMembrosPage} />

// function AdminListaMembrosPage() {
//   return (
//     <AdminProtectedRoute>
//       <ListaMembros />
//     </AdminProtectedRoute>
//   );
// }

// =====================================================================
// EXEMPLO 2: Usando SuperAdminProtectedRoute para rotas SaaS
// =====================================================================

// <Route path="/admin/super-admin/lojas" component={SuperAdminListaLojasPage} />

// function SuperAdminListaLojasPage() {
//   return (
//     <SuperAdminProtectedRoute>
//       <ListaLojas />
//     </SuperAdminProtectedRoute>
//   );
// }

// =====================================================================
// EXEMPLO 3: Usando useAuthContext() em um componente
// =====================================================================

// import { useAuthContext, useLogout } from '@/components/ProtectedRoutes';

// function MeuComponente() {
//   const auth = useAuthContext();
//   const logout = useLogout();

//   return (
//     <>
//       {/* Mostrar informações baseado no role */}
//       {auth.isAdmin && <div>Admin da loja: {auth.lodgeId}</div>}
//       {auth.isSuperAdmin && <div>Super-Admin do SaaS</div>}
//       {auth.isMember && <div>Membro do Portal</div>}

//       {/* Menu baseado no role */}
//       <nav>
//         {auth.isAdmin && (
//           <>
//             <a href="/admin/secretaria/membros">Membros</a>
//             <a href="/admin/tesouraria/fluxo">Finanças</a>
//           </>
//         )}
//         {auth.isSuperAdmin && (
//           <>
//             <a href="/admin/super-admin/lojas">Lojas</a>
//             <a href="/admin/super-admin/relatorios">Relatórios Globais</a>
//           </>
//         )}
//       </nav>

//       <button onClick={logout}>Sair</button>
//     </>
//   );
// }

// =====================================================================
// EXEMPLO 4: Proteção condicional no login
// =====================================================================

// function LoginComponent() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   async function handleLogin(e: React.FormEvent) {
//     e.preventDefault();

//     // 1. Chamar API de login
//     const response = await fetch('/api/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password })
//     });

//     const data = await response.json();

//     // 2. Salvar dados no localStorage
//     localStorage.setItem('MEMBER_TOKEN_KEY', data.token);
//     localStorage.setItem('ADMIN_ROLE', data.role); // 'admin' ou 'super_admin'
//     localStorage.setItem('ADMIN_LODGE_ID', data.lodge_id || '');
//     localStorage.setItem('MEMBER_ID', data.memberId);
//     localStorage.setItem('MEMBER_EMAIL', data.email);

//     // 3. Redirecionar baseado no role
//     if (data.role === 'admin') {
//       window.location.href = '/admin/secretaria/membros';
//     } else if (data.role === 'super_admin') {
//       window.location.href = '/admin/super-admin/lojas';
//     } else {
//       window.location.href = '/member-portal/dashboard';
//     }
//   }

//   return (
//     <form onSubmit={handleLogin}>
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Email"
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Senha"
//       />
//       <button type="submit">Entrar</button>
//     </form>
//   );
// }

// =====================================================================
// EXEMPLO 5: API Client separado por role
// =====================================================================

// // apiClient/admin.ts
// import axios from 'axios';

// export const adminApi = axios.create({
//   baseURL: '/api',
// });

// // Interceptador para adicionar token
// adminApi.interceptors.request.use((config) => {
//   const token = localStorage.getItem('MEMBER_TOKEN_KEY');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Funções de admin
// export async function getMembers(lodgeId: string) {
//   // Backend vai filtrar por lodgeId automaticamente via middleware
//   const response = await adminApi.get('/members');
//   return response.data;
// }

// export async function getFinances(lodgeId: string) {
//   const response = await adminApi.get('/finances');
//   return response.data;
// }

// // apiClient/superAdmin.ts
// import axios from 'axios';

// export const superAdminApi = axios.create({
//   baseURL: '/api',
// });

// superAdminApi.interceptors.request.use((config) => {
//   const token = localStorage.getItem('MEMBER_TOKEN_KEY');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Funções de super-admin (SEM filtro por lodgeId)
// export async function getAllLodges() {
//   const response = await superAdminApi.get('/admin/super-admin/lojas');
//   return response.data;
// }

// export async function getAllMembers() {
//   const response = await superAdminApi.get('/admin/super-admin/members');
//   return response.data;
// }

// export async function getGlobalReports() {
//   const response = await superAdminApi.get('/admin/super-admin/relatorios');
//   return response.data;
// }

// =====================================================================
// EXEMPLO 6: Componente que muda baseado no role
// =====================================================================

// function Dashboard() {
//   const auth = useAuthContext();

//   if (!auth.isLoggedIn) {
//     return <Navigate to="/login" />;
//   }

//   if (auth.isAdmin) {
//     return <AdminDashboard lodgeId={auth.lodgeId!} />;
//   }

//   if (auth.isSuperAdmin) {
//     return <SuperAdminDashboard />;
//   }

//   if (auth.isMember) {
//     return <MemberPortalDashboard memberId={auth.memberId!} />;
//   }

//   return <div>Erro: Role inválido</div>;
// }

// =====================================================================
// RESUMO DE IMPLEMENTAÇÃO
// =====================================================================

/*
1. BACKEND:
   ✅ Criar middleware/protectedRoutes.ts
   ✅ Usar adminOnly na rota GET /members (filtra por lodge_id)
   ✅ Usar superAdminOnly na rota GET /admin/super-admin/members (sem filtro)

2. FRONTEND:
   ✅ Usar <AdminProtectedRoute> para /admin/*
   ✅ Usar <SuperAdminProtectedRoute> para /admin/super-admin/*
   ✅ Usar <MemberProtectedRoute> para /member-portal/*

3. TIPOS:
   ✅ Usar RoleType enum em lugar de strings
   ✅ Usar type guards: isAdminContext(), isSuperAdminContext()

4. API CLIENT:
   ✅ Separar em admin.ts, superAdmin.ts, member.ts
   ✅ Adicionar interceptador de token

5. TESTES:
   ✅ Admin NÃO consegue acessar /admin/super-admin/lojas
   ✅ Super-Admin consegue acessar /admin/super-admin/lojas
   ✅ Admin vê apenas dados de sua loja
   ✅ Super-Admin vê dados de todas as lojas
*/
