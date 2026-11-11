import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fileUrl } from '../lib/config';
import { fonts } from '../lib/theme';
import { useTheme } from '../context/Theme';
import type { Episode } from '../lib/types';

export function EpisodeCard({
  episode,
  index,
  fallbackThumb,
  selected,
  onPress,
}: {
  episode: Episode;
  index: number;
  fallbackThumb?: string;
  selected?: boolean;
  onPress: () => void;
}) {
  const { colors, mode } = useTheme();
  const styles = makeStyles(colors, mode === 'light');
  const thumb = fileUrl(episode.thumbnail || episode.thumbnail1 || fallbackThumb);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Play episode ${index + 1}: ${episode.title ?? ''}`}
      style={({ pressed }) => [styles.row, selected && styles.selected, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.art}>
        <Image source={{ uri: thumb }} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
        <View style={styles.playBadge}>
          <Ionicons name="play" size={18} color="#fff" />
        </View>
        <Text style={styles.epNo}>EP {String(index + 1).padStart(2, '0')}</Text>
        {episode.duration ? <Text style={styles.duration}>{episode.duration}</Text> : null}
      </View>
      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={1}>
          {episode.title || `Episode ${index + 1}`}
        </Text>
        <Text style={styles.desc} numberOfLines={3}>
          {episode.description}
        </Text>
      </View>
    </Pressable>
  );
}

const makeStyles = (colors: typeof import('../lib/theme').darkColors, light: boolean) => StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, padding: 8, borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
  selected: { backgroundColor: light ? 'rgba(255,229,0,0.22)' : 'rgba(217,70,239,0.16)', borderColor: colors.accent },
  art: { width: 150, height: 84, borderRadius: 10, overflow: 'hidden', backgroundColor: colors.skeleton },
  playBadge: { position: 'absolute', alignSelf: 'center', top: 28, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  epNo: { position: 'absolute', left: 6, top: 6, color: '#fff', fontFamily: fonts.body, fontSize: 11, fontWeight: '800', backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4, overflow: 'hidden' },
  duration: { position: 'absolute', right: 6, bottom: 6, color: '#fff', fontFamily: fonts.body, fontSize: 11, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 5, borderRadius: 4, overflow: 'hidden' },
  copy: { flex: 1, gap: 4 },
  title: { color: colors.text, fontFamily: fonts.body, fontSize: 15, fontWeight: light ? '900' : '800' },
  desc: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, fontWeight: light ? '500' : '400', lineHeight: 17 },
});
