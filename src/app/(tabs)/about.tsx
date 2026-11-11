import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { fonts } from '../../lib/theme';
import { useTheme } from '../../context/Theme';

const EMAIL = 'prateekveerbhan@gmail.com';

export default function About() {
  const { colors, mode, toggleTheme } = useTheme();
  const styles = makeStyles(colors, mode === 'light');
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.eyebrow}>
        <Ionicons name="sparkles" size={14} color={colors.gold} />
        <Text style={styles.eyebrowText}>YOUR NEXT FAVORITE STORY STARTS HERE</Text>
      </View>
      <Text style={styles.h1}>Stories worth staying up for.</Text>
      <Text style={styles.p}>
        Thunder Streams brings your anime watchlist, new discoveries, and favorite series together in one place. Find a
        title, settle in, and enjoy the next episode.
      </Text>
      <Pressable style={styles.cta} onPress={() => router.push('/anime')}>
        <Text style={styles.ctaText}>Explore anime</Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </Pressable>

      <View style={styles.themeRow}>
        <View style={styles.themeCopy}>
          <Ionicons name={mode === 'dark' ? 'moon' : 'sunny'} size={20} color={colors.accent} />
          <View><Text style={styles.h2}>Appearance</Text><Text style={styles.p}>{mode === 'dark' ? 'Dark theme' : 'Light theme'}</Text></View>
        </View>
        <Switch value={mode === 'dark'} onValueChange={toggleTheme} accessibilityLabel="Toggle dark theme" trackColor={{ false: colors.border, true: colors.accent }} thumbColor="#fff" />
      </View>

      <View style={styles.card}>
        <Ionicons name="play-circle" size={22} color={colors.accent} />
        <Text style={styles.h2}>Find your next series</Text>
        <Text style={styles.p}>Browse collections by genre and explore titles picked to make choosing your next watch easy.</Text>
      </View>
      <View style={styles.card}>
        <Ionicons name="sparkles" size={22} color={colors.accent} />
        <Text style={styles.h2}>Made for anime fans</Text>
        <Text style={styles.p}>A simple place to discover memorable characters, new worlds, and stories to come back to.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.h2}>Get in touch</Text>
        <Text style={styles.p}>Have feedback or a question? We’d love to hear from you.</Text>
        <Pressable style={styles.mail} onPress={() => Linking.openURL(`mailto:${EMAIL}`)}>
          <Ionicons name="mail" size={18} color={colors.gold} />
          <Text style={styles.mailText}>{EMAIL}</Text>
        </Pressable>
      </View>
      <Text style={styles.foot}>© {new Date().getFullYear()} Thunder Streams · Made for anime fans</Text>
    </ScrollView>
  );
}

const makeStyles = (colors: typeof import('../../lib/theme').darkColors, light: boolean) => StyleSheet.create({
  page: { padding: 20, gap: 14, paddingBottom: 40 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eyebrowText: { color: colors.gold, fontFamily: fonts.body, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  h1: { color: colors.text, fontFamily: fonts.body, fontSize: 32, fontWeight: light ? '900' : '800', lineHeight: 38 },
  h2: { color: colors.text, fontFamily: fonts.body, fontSize: 18, fontWeight: light ? '900' : '800' },
  p: { color: colors.muted, fontFamily: fonts.body, fontSize: 15, fontWeight: light ? '500' : '400', lineHeight: 22 },
  cta: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.accentStrong, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  ctaText: { color: light ? colors.text : '#fff', fontFamily: fonts.body, fontSize: 16, fontWeight: '900' },
  card: { backgroundColor: colors.surface, borderRadius: 14, padding: 16, gap: 8, borderWidth: 1, borderColor: colors.border },
  themeRow: { backgroundColor: colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  themeCopy: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mail: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  mailText: { color: colors.gold, fontFamily: fonts.body, fontSize: 15, fontWeight: '700' },
  foot: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, textAlign: 'center', marginTop: 8 },
});
