import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EpisodeCard } from '../../components/EpisodeCard';
import { Skeleton } from '../../components/Skeleton';
import { useAssets } from '../../context/Assets';
import { fetchSeasons, ratingOf } from '../../lib/api';
import { fileUrl } from '../../lib/config';
import { fonts } from '../../lib/theme';
import { useTheme } from '../../context/Theme';
import type { Season } from '../../lib/types';

export default function SeriesScreen() {
  const { colors, mode } = useTheme();
  const styles = makeStyles(colors, mode === 'light');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { byId } = useAssets();
  const series = byId(id);
  const insets = useSafeAreaInsets();
  const [seasons, setSeasons] = useState<Season[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!series) return;
    const ctrl = new AbortController();
    fetchSeasons(series.name, ctrl.signal)
      .then(setSeasons)
      .catch((e) => e?.name !== 'AbortError' && setError(e?.message ?? 'Unable to load episodes'));
    return () => ctrl.abort();
  }, [series]);

  if (!series) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.muted}>Title not found.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const rating = ratingOf(series);
  const season = seasons?.[selected];

  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: fileUrl(series.thumbnail2) }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={mode === 'light' ? ['rgba(0,0,0,0.78)', 'rgba(0,0,0,0.5)', colors.bg] : ['rgba(13,3,12,0.55)', colors.bg]}
        style={StyleSheet.absoluteFill}
        locations={mode === 'light' ? [0, 0.35, 0.82] : [0.2, 0.7]}
      />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 56, paddingBottom: insets.bottom + 32 }}>
        <View style={styles.header}>
          <Text style={styles.title}>{series.name}</Text>
          <Text style={styles.desc}>{series.description}</Text>
          <Text style={styles.genres}>{series.genre?.join('　')}</Text>
          {rating ? (
            <Text style={styles.rating}>
              Rating <Text style={{ color: '#eab308' }}>★</Text>: {rating}/10
            </Text>
          ) : null}
        </View>

        {seasons && seasons.length > 1 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
            {seasons.map((s, i) => (
              <Pressable key={s._id ?? i} onPress={() => setSelected(i)} style={[styles.tab, i === selected && styles.tabOn]} accessibilityState={{ selected: i === selected }}>
                <Text style={styles.tabText}>Season {s.seasonNumber}</Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : seasons?.length === 1 ? (
          <Text style={styles.seasonLabel}>Season {seasons[0].seasonNumber}</Text>
        ) : null}

        <View style={styles.list}>
          {!seasons && !error
            ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} height={84} radius={12} />)
            : null}
          {error ? <Text style={styles.muted}>{error}</Text> : null}
          {seasons && !season?.episodes?.length ? <Text style={styles.muted}>No episodes yet.</Text> : null}
          {season?.episodes?.map((ep, i) => (
            <EpisodeCard
              key={ep._id ?? ep.path}
              episode={ep}
              index={i}
              fallbackThumb={series.thumbnail2}
              onPress={() => router.push({ pathname: '/play', params: { id: series._id, s: String(selected), e: String(i) } })}
            />
          ))}
        </View>
      </ScrollView>
      <Pressable onPress={() => router.back()} style={[styles.back, { top: insets.top + 8 }]} accessibilityLabel="Go back" hitSlop={8}>
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </Pressable>
    </View>
  );
}

const makeStyles = (colors: typeof import('../../lib/theme').darkColors, light: boolean) => StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  muted: { color: colors.muted, fontFamily: fonts.body, fontSize: 14 },
  link: { color: colors.accent, fontFamily: fonts.body, fontSize: 15, fontWeight: '800' },
  back: { position: 'absolute', left: 12, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: 18, gap: 8, marginBottom: 18 },
  title: { color: light ? '#fff' : colors.text, fontFamily: fonts.body, fontSize: 32, fontWeight: light ? '900' : '800', textShadowColor: light ? 'rgba(0,0,0,0.9)' : 'transparent', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 5 },
  desc: { color: light ? '#fff' : colors.muted, fontFamily: fonts.body, fontSize: 15, fontWeight: light ? '600' : '400', lineHeight: 22, textShadowColor: light ? 'rgba(0,0,0,0.9)' : 'transparent', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  genres: { color: light ? '#ffe500' : colors.text, fontFamily: fonts.body, fontSize: 15, fontWeight: '800', textShadowColor: light ? 'rgba(0,0,0,0.9)' : 'transparent', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  rating: { color: light ? '#fff' : colors.text, fontFamily: fonts.body, fontSize: 16, fontWeight: '800', textShadowColor: light ? 'rgba(0,0,0,0.9)' : 'transparent', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  tabs: { paddingHorizontal: 14, gap: 8, marginBottom: 12 },
  tab: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8, backgroundColor: colors.surfaceAlt },
  tabOn: { backgroundColor: colors.accent },
  tabText: { color: light ? colors.text : '#fff', fontFamily: fonts.body, fontWeight: '900' },
  seasonLabel: { color: colors.text, fontFamily: fonts.body, fontWeight: '800', fontSize: 16, paddingHorizontal: 18, marginBottom: 10 },
  list: { paddingHorizontal: 10, gap: 6 },
});
