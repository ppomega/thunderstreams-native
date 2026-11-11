import { FlatList, StyleSheet, Text, View } from 'react-native';
import { fonts } from '../lib/theme';
import { useTheme } from '../context/Theme';
import type { Series } from '../lib/types';
import { PosterCard, CARD_H, CARD_W } from './PosterCard';
import { Skeleton } from './Skeleton';

export function Carousel({ title, data, loading }: { title: string; data: Series[]; loading?: boolean }) {
  const { colors, mode } = useTheme();
  const styles = makeStyles(colors, mode === 'light');
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {loading ? (
        <View style={styles.skeletonRow}>
          <Skeleton width={CARD_W} height={CARD_H} radius={14} />
          <Skeleton width={CARD_W} height={CARD_H} radius={14} />
        </View>
      ) : (
        <FlatList
          horizontal
          data={data}
          keyExtractor={(s) => s._id}
          renderItem={({ item }) => <PosterCard series={item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        />
      )}
    </View>
  );
}

const makeStyles = (colors: typeof import('../lib/theme').darkColors, light: boolean) => StyleSheet.create({
  section: { paddingTop: 22 },
  title: { color: colors.text, fontFamily: fonts.body, fontSize: 20, fontWeight: light ? '900' : '800', paddingHorizontal: 16, marginBottom: 12 },
  list: { paddingHorizontal: 16 },
  skeletonRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16 },
});
