import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { fileUrl } from '../lib/config';
import { fonts } from '../lib/theme';
import { useTheme } from '../context/Theme';
import type { Series } from '../lib/types';
import { openSeries } from './PosterCard';

const HERO_H = 460;
const AUTOPLAY_MS = 3500;

export function Hero({ data }: { data: Series[] }) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<Series>>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const paused = useRef(false);

  useEffect(() => {
    if (data.length < 2) return;
    const t = setInterval(() => {
      if (paused.current) return;
      const next = (indexRef.current + 1) % data.length;
      listRef.current?.scrollToOffset({ offset: next * width, animated: true });
      indexRef.current = next;
      setIndex(next);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [data.length, width]);

  const onEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    indexRef.current = i;
    setIndex(i);
    paused.current = false;
  };

  return (
    <View style={{ height: HERO_H }}>
      <FlatList
        ref={listRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s) => s._id}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onScrollBeginDrag={() => (paused.current = true)}
        onMomentumScrollEnd={onEnd}
        renderItem={({ item }) => <Slide series={item} width={width} />}
      />
      <View style={styles.dots} accessibilityLabel={`Featured title ${index + 1} of ${data.length}`}>
        {data.slice(0, 8).map((s, i) => (
          <Pressable key={s._id} accessibilityRole="button" accessibilityLabel={`Show ${s.name}`} onPress={() => { listRef.current?.scrollToOffset({ offset: i * width, animated: true }); setIndex(i); indexRef.current = i; }} style={[styles.dot, i === index % 8 && { backgroundColor: colors.accent, width: 18 }]} />
        ))}
      </View>
    </View>
  );
}

function Slide({ series, width }: { series: Series; width: number }) {
  const { colors, mode } = useTheme();
  return (
    <View style={{ width, height: HERO_H }}>
      <Image source={{ uri: fileUrl(series.thumbnail1) }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.64)', 'rgba(0,0,0,0.96)']} style={StyleSheet.absoluteFill} locations={[0.25, 0.65, 1]} />
      <View style={styles.copy}>
        {series.logo ? (
          <Image source={{ uri: fileUrl(series.logo) }} style={styles.logo} contentFit="contain" contentPosition="left" />
        ) : (
          <Text style={styles.title}>{series.name}</Text>
        )}
        <Text style={styles.genres}>{series.genre?.join('   ')}</Text>
        <Text style={styles.desc} numberOfLines={3}>
          {series.description}
        </Text>
        <Pressable onPress={() => openSeries(series._id)} style={({ pressed }) => [styles.cta, { backgroundColor: colors.button }, pressed && { opacity: 0.85 }]}>
          <Text style={[styles.ctaText, mode === 'light' && { color: colors.text }]}>Watch Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: { position: 'absolute', left: 0, right: 0, bottom: 32, paddingHorizontal: 18, gap: 8 },
  logo: { width: '70%', height: 90 },
  title: { color: '#fff', fontFamily: fonts.body, fontSize: 30, fontWeight: '800' },
  genres: { color: '#facc15', fontFamily: fonts.body, fontSize: 14, fontWeight: '700' },
  desc: { color: '#fff', fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  cta: { alignSelf: 'flex-start', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 26, marginTop: 4 },
  ctaText: { color: '#fff', fontFamily: fonts.body, fontSize: 16, fontWeight: '800' },
  dots: { position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' },
});
