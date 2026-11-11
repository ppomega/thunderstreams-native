import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { openSeries } from '../../components/PosterCard';
import { useAssets } from '../../context/Assets';
import { fileUrl } from '../../lib/config';
import { fonts } from '../../lib/theme';
import { useTheme } from '../../context/Theme';

export default function Search() {
  const { colors, mode } = useTheme();
  const styles = makeStyles(colors, mode === 'light');
  const { assets } = useAssets();
  const [q, setQ] = useState('');

  // Same matching as the web app: case-insensitive, whitespace ignored.
  const results = useMemo(() => {
    const term = q.toLowerCase().replace(/\s+/g, '');
    if (!term) return [];
    return assets.filter((a) => a.name?.toLowerCase().replace(/\s+/g, '').includes(term));
  }, [q, assets]);

  return (
    <View style={styles.page}>
      <View style={styles.inputWrap}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search titles"
          placeholderTextColor="rgba(255,255,255,0.5)"
          style={styles.input}
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search titles"
        />
        {q ? (
          <Pressable onPress={() => setQ('')} hitSlop={10} accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>
      <FlatList
        data={results}
        numColumns={2}
        keyExtractor={(s) => s._id}
        keyboardShouldPersistTaps="handled"
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 14, paddingBottom: 32 }}
        ListEmptyComponent={
          <Text style={styles.empty}>{q ? 'No titles match your search.' : 'Type a title to start searching.'}</Text>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => openSeries(item._id)}>
            <Image source={{ uri: fileUrl(item.thumbnail1) }} style={styles.thumb} contentFit="cover" transition={150} />
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const makeStyles = (colors: typeof import('../../lib/theme').darkColors, light: boolean) => StyleSheet.create({
  page: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surface, borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  input: { flex: 1, color: colors.text, fontFamily: fonts.body, fontSize: 16, paddingVertical: 12 },
  empty: { color: colors.muted, fontFamily: fonts.body, textAlign: 'center', marginTop: 40 },
  item: { flex: 1 },
  thumb: { width: '100%', aspectRatio: 16 / 9, borderRadius: 10, backgroundColor: colors.skeleton },
  name: { color: colors.text, fontFamily: fonts.body, fontSize: 14, fontWeight: light ? '900' : '700', marginTop: 6 },
});
