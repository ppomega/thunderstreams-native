import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { Text, View } from 'react-native';
import { fonts } from '../../lib/theme';
import { useTheme } from '../../context/Theme';

function Brand() {
  const { colors, mode } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 6, backgroundColor: 'transparent' }}>
      <Text style={{ color: colors.text, fontFamily: fonts.brand, fontSize: 22, fontWeight: '900' }}>Thunder</Text>
      <Text style={{ color: colors.brandYellow, fontFamily: fonts.brand, fontSize: 22, fontWeight: '900' }}>Streams</Text>
    </View>
  );
}

type IconName = keyof typeof Ionicons.glyphMap;
const icon = (name: IconName, focused: IconName) => ({ color, focused: f, size }: { color: ColorValue; focused: boolean; size: number }) => (
  <Ionicons name={f ? focused : name} size={size} color={color as string} />
);

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerTitle: () => <Brand />,
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fonts.body, fontWeight: '700' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home-outline', 'home') }} />
      <Tabs.Screen name="anime" options={{ title: 'Anime', tabBarIcon: icon('film-outline', 'film') }} />
      <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: icon('search-outline', 'search') }} />
      <Tabs.Screen name="about" options={{ title: 'About', tabBarIcon: icon('information-circle-outline', 'information-circle') }} />
    </Tabs>
  );
}
