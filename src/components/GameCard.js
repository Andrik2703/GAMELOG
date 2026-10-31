// src/components/GameCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, FONTS } from '../utils/theme';

export default function GameCard({ game }) {
  return (
    <View style={styles.card}>
      {/* FreeToGame usa 'thumbnail' para la imagen */}
      <Image 
        source={{ uri: game.thumbnail }} 
        style={styles.cover} 
        contentFit="cover" 
        transition={300}
      />
      <View style={styles.info}>
        {/* FreeToGame usa 'title' */}
        <Text style={styles.name} numberOfLines={1}>{game.title}</Text>
        
        {/* FreeToGame usa 'release_date' y 'genre' */}
        <Text style={styles.meta}>
          {game.release_date || 'Año desconocido'}
        </Text>

        {/* FreeToGame usa 'genre' */}
        {game.genre && (
          <View style={styles.platforms}>
            <Text style={styles.platformTag}>{game.genre}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cover: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.border,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
  },
  platforms: {
    flexDirection: 'row',
    marginTop: 8,
  },
  platformTag: {
    backgroundColor: '#E3F2FD',
    color: COLORS.primary,
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
});