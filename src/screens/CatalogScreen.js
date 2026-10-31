import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, FONTS } from '../utils/theme';
import { fetchGames } from '../services/gameApi';
import GameCard from '../components/GameCard';
import GameLoader from '../components/GameLoader';

export default function CatalogScreen({ navigation }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  
  // Estados para la búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Lo que el usuario escribe

  // Carga inicial (sin búsqueda)
  useEffect(() => {
    cargarJuegosIniciales('');
  }, []);

  const cargarJuegosIniciales = async (termino) => {
    try {
      setLoading(true);
      setError(null);
      setPage(1);
      const data = await fetchGames(1, termino);
      setGames(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar más juegos al hacer scroll
  const cargarMasJuegos = async () => {
    if (loadingMore || error || games.length === 0) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await fetchGames(nextPage, searchTerm);
      setGames((prevGames) => [...prevGames, ...data]);
      setPage(nextPage);
    } catch (err) {
      console.log('Error al cargar más juegos:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Ejecutar búsqueda al presionar el botón o Enter
  const handleSearch = () => {
    setSearchTerm(searchInput);
    cargarJuegosIniciales(searchInput);
  };

  // Limpiar búsqueda
  const handleClear = () => {
    setSearchInput('');
    setSearchTerm('');
    cargarJuegosIniciales('');
  };

    // Estado de carga inicial - USANDO EL NUEVO LOADER
  if (loading) {
    return <GameLoader />;
  }

  // Estado de error de red
  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>No se pudo cargar el catálogo</Text>
        <Text style={styles.errorSub}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.retryText}>Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Catálogo 🎮</Text>
        <Text style={styles.subtitle}>Busca y descubre videojuegos</Text>
      </View>

      {/* BARRA DE BÚSQUEDA */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar un juego (ej. Zelda, Mario...)"
          placeholderTextColor={COLORS.textSecondary}
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchInput.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* MENSAJE SI NO HAY RESULTADOS */}
      {games.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No se encontraron juegos</Text>
          <Text style={styles.emptySub}>
            No hay resultados para "{searchTerm}".{'\n'}Intenta con otro nombre.
          </Text>
        </View>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => <GameCard game={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onEndReached={cargarMasJuegos} 
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.footerText}>Cargando más juegos...</Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background, padding: 24 },
  loadingText: { marginTop: 12, fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.textSecondary },
  errorIcon: { fontSize: 48, marginBottom: 12 },
  errorText: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.error, marginBottom: 8 },
  errorSub: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.textSecondary, marginBottom: 20, textAlign: 'center' },
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, backgroundColor: COLORS.primary },
  retryText: { color: '#FFF', fontFamily: 'Inter-Bold', fontSize: 15 },
  
  header: { paddingHorizontal: SIZES.padding, paddingTop: SIZES.padding },
  backButton: { marginBottom: 12 },
  backText: { color: COLORS.primary, fontSize: 16, fontFamily: 'Inter-Bold' },
  title: { ...FONTS.title, color: COLORS.primary, marginBottom: 4 },
  subtitle: { ...FONTS.subtitle, marginBottom: 16 },
  
  // Estilos de la barra de búsqueda
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.padding,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text,
    outlineStyle: 'none', // Quita el borde azul feo en Web
  },
  clearButton: {
    padding: 4,
    marginRight: 8,
  },
  clearText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Inter-Bold',
  },

  // Estilos del estado vacío (No encontrado)
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: -40, // Lo subimos un poco
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  list: { paddingHorizontal: SIZES.padding, paddingBottom: 24 },
  footerLoading: { paddingVertical: 20, alignItems: 'center', justifyContent: 'center' },
  footerText: { marginTop: 8, fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.textSecondary }
});