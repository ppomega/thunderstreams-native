import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { Carousel } from '../../components/Carousel';
import { Hero } from '../../components/Hero';
import { Skeleton } from '../../components/Skeleton';
import { useAssets } from '../../context/Assets';
import { fonts } from '../../lib/theme';
import { useTheme } from '../../context/Theme';
import type { Series } from '../../lib/types';

function byGenre(all: Series[], genre: string) {
  const hit = all.filter((s) => s.genre?.some((g) => g.toLowerCase() === genre.toLowerCase()));
  return hit.length ? hit : all;
}

export default function Home() {
  const { colors } = useTheme();
  const { assets, loading, error, reload } = useAssets();
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} tintColor={colors.accent} />}
    >
      {assets.length ? <Hero data={assets} /> : <View style={{ padding: 16 }}><Skeleton height={400} /></View>}
      {error ? (
        <Text style={{ color: colors.muted, fontFamily: fonts.body, padding: 16 }}>
          Couldn’t load titles: {error}. Pull down to retry.
        </Text>
      ) : null}
      <Carousel title="Latest In 2025" data={assets} loading={loading && !assets.length} />
      <Carousel title="Action" data={byGenre(assets, 'Action')} loading={loading && !assets.length} />
      <Carousel title="Fantasy" data={byGenre(assets, 'Fantasy')} loading={loading && !assets.length} />
    </ScrollView>
  );
}
