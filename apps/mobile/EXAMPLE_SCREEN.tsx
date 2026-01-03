/**
 * EXEMPLO: Tela de Perfil do Membro
 * 
 * Este arquivo demonstra como usar:
 * - Hooks React Query (useProfile)
 * - Store Zustand (useAuthStore)
 * - Components nativos (React Native)
 * - TypeScript typing
 * 
 * Copie e adapte este padrão para suas telas!
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { useProfile } from '@hooks/useData';
import { useAuthStore } from '@store/authStore';
import { membersApi } from '@services/api';

export function ProfileScreen() {
  const { user, isLoggedIn, updateProfile } = useAuthStore();
  const { data: profileData, isLoading, error, refetch } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    birth_date: user?.member?.birth_date || '',
    phone: '',
    address: '',
    city: '',
    state: '',
  });

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Você precisa fazer login</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Erro ao carregar: {error.message}</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => refetch()}
        >
          <Text style={styles.buttonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const memberData = profileData?.data;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const success = await updateProfile(formData);
      
      if (success) {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        setIsEditing(false);
        refetch();
      } else {
        Alert.alert('Erro', 'Falha ao atualizar perfil');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header com foto */}
      <View style={styles.headerSection}>
        {memberData?.member?.photo_url ? (
          <Image
            source={{ uri: memberData.member.photo_url }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.initials}>
              {memberData?.user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.name}>{memberData?.user?.name}</Text>
        <Text style={styles.subtitle}>{memberData?.member?.degree}</Text>
      </View>

      {/* Informações Principais */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Básicas</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{memberData?.user?.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>CIM:</Text>
          <Text style={styles.value}>{memberData?.member?.cim}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Grau:</Text>
          <Text style={styles.value}>{memberData?.member?.degree}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[
            styles.value,
            memberData?.member?.status === 'ativo' && styles.statusAti vo
          ]}>
            {memberData?.member?.status}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Data de Iniciação:</Text>
          <Text style={styles.value}>
            {new Date(memberData?.member?.initiation_date).toLocaleDateString('pt-BR')}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Loja:</Text>
          <Text style={styles.value}>{memberData?.user?.lodgeName}</Text>
        </View>
      </View>

      {/* Seção Editável */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informações Adicionais</Text>
          <TouchableOpacity 
            onPress={() => setIsEditing(!isEditing)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Cancelar' : 'Editar'}
            </Text>
          </TouchableOpacity>
        </View>

        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nome Completo"
              value={formData.name}
              onChangeText={(text) => 
                setFormData({ ...formData, name: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Data de Nascimento (DD/MM/YYYY)"
              value={formData.birth_date}
              onChangeText={(text) => 
                setFormData({ ...formData, birth_date: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Telefone"
              value={formData.phone}
              onChangeText={(text) => 
                setFormData({ ...formData, phone: text })
              }
              keyboardType="phone-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Endereço"
              value={formData.address}
              onChangeText={(text) => 
                setFormData({ ...formData, address: text })
              }
            />

            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="Cidade"
                value={formData.city}
                onChangeText={(text) => 
                  setFormData({ ...formData, city: text })
                }
              />

              <TextInput
                style={[styles.input, { width: 60 }]}
                placeholder="UF"
                value={formData.state}
                onChangeText={(text) => 
                  setFormData({ ...formData, state: text })
                }
                maxLength={2}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, isSaving && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.buttonText}>
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Telefone:</Text>
              <Text style={styles.value}>{formData.phone || 'Não informado'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Endereço:</Text>
              <Text style={styles.value}>{formData.address || 'Não informado'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Cidade/UF:</Text>
              <Text style={styles.value}>
                {formData.city && formData.state 
                  ? `${formData.city}, ${formData.state}` 
                  : 'Não informado'
                }
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Ações */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.dangerButton}>
          <Text style={styles.dangerButtonText}>Alterar Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.dangerButton, { marginTop: 12 }]}
          onPress={async () => {
            Alert.alert(
              'Confirmar Logout',
              'Tem certeza que deseja sair?',
              [
                { text: 'Cancelar', onPress: () => {} },
                {
                  text: 'Sair',
                  onPress: async () => {
                    await useAuthStore.getState().logout();
                    // Navigation.resetTo('Login') - implementar conforme seu router
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.dangerButtonText}>Fazer Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Espaço extra para scroll */}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

/**
 * ESTILOS
 * 
 * Exemplo com tamanhos e cores comuns
 * Adapte conforme seu design system!
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  error: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    padding: 16,
  },

  // Header
  headerSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },

  // Sections
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#e3f2fd',
  },
  editButtonText: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '500',
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#000',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  statusAtivo: {
    color: '#4caf50',
    fontWeight: '600',
  },

  // Inputs
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ddd',
  },

  // Buttons
  button: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  dangerButtonText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: '600',
  },
});

/**
 * COMO USAR ESTE PADRÃO
 * 
 * 1. Copie a estrutura da tela
 * 2. Mude os hooks (useProfile → useBalance, useTransactions, etc)
 * 3. Atualize o JSX com seus componentes
 * 4. Adapte os estilos
 * 5. Pronto! Use em sua navegação
 * 
 * PADRÃO DE HOOKS:
 * - useProfile()
 * - useBalance()
 * - useTransactions(page, limit, filters)
 * - useMembers(page, limit, search)
 * - useDocuments(type)
 * - useAttendance(month)
 * - useUpcomingEvents(limit)
 * - useHealthStatus()
 * 
 * PADRÃO DE STORE:
 * - useAuthStore() → user, isLoggedIn, login, logout, updateProfile
 * 
 * PADRÃO DE API:
 * - membersApi.login(email, password)
 * - membersApi.getProfile()
 * - membersApi.updateProfile(data)
 * - membersApi.changePassword(old, new)
 * - membersApi.getBalance()
 * - etc...
 */
