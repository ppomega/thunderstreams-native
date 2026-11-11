import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fileUrl } from '../lib/config';
import { fonts } from '../lib/theme';
import { useTheme } from '../context/Theme';
import type { Series } from '../lib/types';

export const CARD_W = 220;
export const CARD_H = 124;

export function openSeries(id: string) {
  router.push({ pathname: '/series/[id]', params: { id } });
}

export function PosterCard({ series, width = CARD_W }: { series: Series; width?: number }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const height = Math.round((width * CARD_H) / CARD_W);
  return (
    <Pressable
      onPress={() => openSeries(series._id)}
      accessibilityRole="button"
      accessibilityLabel={series.name}
      style={({ pressed }) => [{ width, height }, styles.card, pressed && { transform: [{ scale: 0.97 }] }]}
    >
      <Image
        source={{ uri: fileUrl(series.thumbnail1) }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={200}
        recyclingKey={series._id}
      />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.82)']} style={styles.label}>
        <Text style={styles.name} numberOfLines={2}>
          {series.name}
        </Text>
        {!!series.genre?.length && <Text style={styles.genre} numberOfLines={1}>{series.genre.slice(0, 2).join('  ·  ')}</Text>}
      </LinearGradient>
    </Pressable>
  );
}

const makeStyles = (colors: typeof import('../lib/theme').darkColors) => StyleSheet.create({
  card: { borderRadius: 14, overflow: 'hidden', backgroundColor: colors.skeleton, borderWidth: 1, borderColor: colors.border },
  label: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    paddingTop: 24,
    paddingBottom: 10,
    justifyContent: 'flex-end',
  },
  name: { color: '#fff', fontFamily: fonts.body, fontSize: 14, fontWeight: '900' },
  genre: { color: 'rgba(255,255,255,0.9)', fontFamily: fonts.body, fontSize: 11, marginTop: 3 },
});
