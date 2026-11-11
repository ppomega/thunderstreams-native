import { useMemo } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { Carousel } from '../../components/Carousel';
import { useAssets } from '../../context/Assets';
import { useTheme } from '../../context/Theme';

export default function AnimeTab() {
  const { colors } = useTheme();
  const { assets, loading, reload } = useAssets();

  // One row per genre (most populated first), plus everything.
  const rows = useMemo(() => {
    const map = new Map<string, typeof assets>();
    for (const s of assets) for (const g of s.genre ?? []) map.set(g, [...(map.get(g) ?? []), s]);
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 6);
  }, [assets]);

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} tintColor={colors.accent} />}
    >
      <Carousel title="All Titles" data={assets} loading={loading && !assets.length} />
      {rows.map(([genre, list]) => (
        <Carousel key={genre} title={genre} data={list} />
      ))}
    </ScrollView>
  );
}
