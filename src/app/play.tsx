import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EpisodeCard } from '../components/EpisodeCard';
import { VideoPlayer } from '../components/VideoPlayer';
import { useAssets } from '../context/Assets';
import { fetchSeasons } from '../lib/api';
import { manifestUrl } from '../lib/config';
import { fonts } from '../lib/theme';
import { useTheme } from '../context/Theme';
import type { Season } from '../lib/types';

export default function PlayScreen() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { id, s, e } = useLocalSearchParams<{ id: string; s?: string; e?: string }>();
  const { byId } = useAssets();
  const series = byId(id);
  const insets = useSafeAreaInsets();
  const [seasons, setSeasons] = useState<Season[] | null>(null);
  const [si] = useState(Number(s ?? 0));
  const [ei, setEi] = useState(Number(e ?? 0));
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!series) return;
    const ctrl = new AbortController();
    fetchSeasons(series.name, ctrl.signal).then(setSeasons).catch(() => {});
    return () => ctrl.abort();
  }, [series]);

  const episodes = seasons?.[si]?.episodes ?? [];
  const episode = episodes[ei];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: fullscreen ? 0 : insets.top }}>
      <StatusBar hidden={fullscreen} style="light" />
      {episode ? (
        <VideoPlayer
          uri={manifestUrl(episode.path)}
          title={episode.title}
          fullscreen={fullscreen}
          onToggleFullscreen={setFullscreen}
          onEnd={() => ei + 1 < episodes.length && setEi(ei + 1)}
        />
      ) : (
        <View style={styles.placeholder} />
      )}

      {!fullscreen ? (
        <>
          <Pressable onPress={() => router.back()} style={styles.back} hitSlop={8} accessibilityLabel="Back">
            <Ionicons name="chevron-back" size={22} color="#fff" />
            <Text style={styles.backText}>{series?.name ?? 'Back'}</Text>
          </Pressable>
          <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
            {episode ? (
              <View style={styles.info}>
                <Text style={styles.epTitle}>Ep- {episode.title}</Text>
                {episode.description ? <Text style={styles.epDesc}>{episode.description}</Text> : null}
                {episode.releaseDate ? <Text style={styles.release}>Release: {episode.releaseDate}</Text> : null}
              </View>
            ) : null}
            <Text style={styles.heading}>Episodes</Text>
            <View style={{ paddingHorizontal: 10, gap: 4 }}>
              {episodes.map((ep, i) => (
                <EpisodeCard
                  key={ep._id ?? ep.path}
                  episode={ep}
                  index={i}
                  fallbackThumb={series?.thumbnail2}
                  selected={i === ei}
                  onPress={() => setEi(i)}
                />
              ))}
            </View>
          </ScrollView>
        </>
      ) : null}
    </View>
  );
}

const makeStyles = (colors: typeof import('../lib/theme').darkColors) => StyleSheet.create({
  placeholder: { width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.surface },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 10 },
  backText: { color: colors.text, fontFamily: fonts.body, fontSize: 15, fontWeight: '800' },
  info: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  epTitle: { color: colors.text, fontFamily: fonts.body, fontSize: 22, fontWeight: '800' },
  epDesc: { color: colors.muted, fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  release: { color: colors.muted, fontFamily: fonts.body, fontSize: 12 },
  heading: { color: colors.text, fontFamily: fonts.body, fontSize: 18, fontWeight: '800', paddingHorizontal: 16, marginTop: 8, marginBottom: 6 },
});
