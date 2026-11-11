import { Ionicons } from '@expo/vector-icons';
import { useEventListener } from 'expo';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useVideoPlayer, VideoView, type AudioTrack, type VideoTrack } from 'expo-video';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { colors, fonts } from '../lib/theme';

function fmt(t: number) {
  if (!Number.isFinite(t) || t < 0) return '00:00';
  const s = Math.floor(t);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const mm = String(m).padStart(2, '0');
  const rr = String(r).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${rr}` : `${mm}:${rr}`;
}

type Props = {
  uri: string;
  title?: string;
  fullscreen: boolean;
  onToggleFullscreen: (next: boolean) => void;
  onEnd?: () => void;
};

export function VideoPlayer({ uri, title, fullscreen, onToggleFullscreen, onEnd }: Props) {
  const player = useVideoPlayer(null, (p) => {
    p.timeUpdateEventInterval = 0.5;
  });
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [controls, setControls] = useState(true);
  const [menu, setMenu] = useState(false);
  const [tab, setTab] = useState<'quality' | 'audio'>('quality');
  const [videoTracks, setVideoTracks] = useState<VideoTrack[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [activeAudio, setActiveAudio] = useState(0);
  const [cap, setCap] = useState<number | null>(null); // null = Auto
  const barW = useRef(1);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load (or switch) the episode. DASH is Android-only in expo-video.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setTime(0);
    setVideoTracks([]);
    setAudioTracks([]);
    setCap(null);
    player.maxResolution = null;
    player
      .replaceAsync({ uri, contentType: 'dash' })
      .then(() => !cancelled && player.play())
      .catch((e) => !cancelled && setError(e?.message ?? 'Unable to load this episode'));
    return () => {
      cancelled = true;
    };
  }, [uri, player]);

  useEventListener(player, 'playingChange', ({ isPlaying }) => setPlaying(isPlaying));
  useEventListener(player, 'statusChange', ({ status, error: err }) => {
    setLoading(status === 'loading');
    if (status === 'error') setError(err?.message ?? 'Playback error');
    else if (status === 'readyToPlay') setError(null);
  });
  useEventListener(player, 'timeUpdate', ({ currentTime }) => {
    setTime(currentTime);
    if (player.duration > 0) setDuration(player.duration);
  });
  useEventListener(player, 'sourceLoad', ({ availableVideoTracks, availableAudioTracks, duration: d }) => {
    setVideoTracks(availableVideoTracks);
    setAudioTracks(availableAudioTracks);
    setDuration(d);
    const i = availableAudioTracks.findIndex((t) => t.id != null && t.id === player.audioTrack?.id);
    setActiveAudio(i >= 0 ? i : 0);
  });
  useEventListener(player, 'availableAudioTracksChange', ({ availableAudioTracks }) => {
    setAudioTracks(availableAudioTracks);
    const selected = availableAudioTracks.findIndex((track) => track.id != null && track.id === player.audioTrack?.id);
    setActiveAudio(selected >= 0 ? selected : 0);
  });
  useEventListener(player, 'playToEnd', () => onEnd?.());

  const poke = useCallback(() => {
    setControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControls(false), 4000);
  }, []);
  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    },
    [],
  );

  // Landscape for fullscreen, portrait otherwise; always restore on leave.
  useEffect(() => {
    ScreenOrientation.lockAsync(
      fullscreen ? ScreenOrientation.OrientationLock.LANDSCAPE : ScreenOrientation.OrientationLock.PORTRAIT_UP,
    ).catch(() => {});
  }, [fullscreen]);
  useEffect(
    () => () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
    },
    [],
  );

  const togglePlay = () => {
    poke();
    if (player.playing) player.pause();
    else player.play();
  };
  const seekTo = (x: number) => {
    poke();
    if (duration > 0) player.currentTime = Math.max(0, Math.min(1, x / barW.current)) * duration;
  };
  const onBarLayout = (e: LayoutChangeEvent) => (barW.current = e.nativeEvent.layout.width || 1);

  const heights = [...new Set(videoTracks.map((t) => t.size?.height).filter((h): h is number => !!h))].sort((a, b) => b - a);
  const setQuality = (h: number | null) => {
    setCap(h);
    if (h == null) player.maxResolution = null;
    else {
      const track = videoTracks.find((t) => t.size?.height === h);
      player.maxResolution = { height: h, width: track?.size?.width ?? Math.round((h * 16) / 9) };
    }
  };
  const pickAudio = (t: AudioTrack, i: number) => {
    player.audioTrack = t;
    setActiveAudio(i);
  };

  return (
    <View style={fullscreen ? styles.full : styles.inline}>
      <VideoView player={player} style={StyleSheet.absoluteFill} nativeControls={false} contentFit="contain" />

      <Pressable style={StyleSheet.absoluteFill} onPress={() => (controls ? setControls(false) : poke())} accessibilityLabel="Toggle player controls" />

      {loading && !error ? (
        <View style={styles.center} pointerEvents="none">
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : null}

      {error ? (
        <View style={styles.center}>
          <Text style={styles.err}>Couldn’t play this episode.</Text>
          <Text style={styles.errSub}>{error}</Text>
        </View>
      ) : null}

      {controls ? (
        <>
          <View style={styles.top} pointerEvents="none">
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>

          <Pressable style={styles.centerBtn} onPress={togglePlay} accessibilityLabel={playing ? 'Pause' : 'Play'}>
            <Ionicons name={playing ? 'pause' : 'play'} size={30} color="#fff" />
          </Pressable>

          <View style={styles.bottom}>
            <Pressable style={styles.barHit} onLayout={onBarLayout} onPress={(e) => seekTo(e.nativeEvent.locationX)} accessibilityLabel="Seek">
              <View style={styles.bar}>
                <View style={[styles.barFill, { width: `${duration ? Math.min(100, (time / duration) * 100) : 0}%` }]} />
              </View>
            </Pressable>
            <View style={styles.row}>
              <Pressable onPress={togglePlay} hitSlop={8} accessibilityLabel={playing ? 'Pause' : 'Play'}>
                <Ionicons name={playing ? 'pause' : 'play'} size={22} color="#fff" />
              </Pressable>
              <Text style={styles.time}>
                {fmt(time)} / {fmt(duration)}
              </Text>
              <View style={{ flex: 1 }} />
              <Pressable
                hitSlop={8}
                onPress={() => {
                  poke();
                  setMuted((m) => {
                    player.muted = !m;
                    return !m;
                  });
                }}
                accessibilityLabel={muted ? 'Unmute' : 'Mute'}
              >
                <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={22} color="#fff" />
              </Pressable>
              <Pressable hitSlop={8} onPress={() => { poke(); setMenu((m) => !m); }} accessibilityLabel="Playback settings">
                <Ionicons name="settings-outline" size={22} color={menu ? colors.accent : '#fff'} />
              </Pressable>
              <Pressable hitSlop={8} onPress={() => onToggleFullscreen(!fullscreen)} accessibilityLabel={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                <Ionicons name={fullscreen ? 'contract' : 'expand'} size={22} color="#fff" />
              </Pressable>
            </View>
          </View>
        </>
      ) : null}

      {menu ? (
        <View style={styles.menu}>
          <View style={styles.menuTabs}>
            {(['quality', 'audio'] as const).map((t) => (
              <Pressable key={t} onPress={() => setTab(t)}>
                <Text style={[styles.menuTab, tab === t && styles.menuTabOn]}>{t === 'quality' ? 'Video quality' : 'Audio'}</Text>
              </Pressable>
            ))}
          </View>
          <ScrollView style={styles.options} nestedScrollEnabled>
          {tab === 'quality' ? (
            <>
              <Option label="Auto" active={cap == null} onPress={() => setQuality(null)} />
              {heights.map((h) => (
                <Option key={h} label={`${h}p`} active={cap === h} onPress={() => setQuality(h)} />
              ))}
              {!heights.length ? <Text style={styles.menuEmpty}>Automatic quality is managed by the stream.</Text> : null}
            </>
          ) : audioTracks.length ? (
            audioTracks.map((t, i) => (
              <Option key={t.id ?? `${t.language}-${i}`} label={audioTrackLabel(t, i, audioTracks)} active={activeAudio === i} onPress={() => pickAudio(t, i)} />
            ))
          ) : (
            <Text style={styles.menuEmpty}>No audio tracks reported for this stream.</Text>
          )}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

function audioTrackLabel(track: AudioTrack, index: number, tracks: AudioTrack[]) {
  // Prefer the source's track name: Android's localized label can report the same device language for every dub.
  const language = track.language && track.language !== 'und' ? track.language.toUpperCase() : '';
  const name = track.name?.trim();
  const label = track.label?.trim();
  let title = name || language || label || `Audio ${index + 1}`;
  if (name && language && !name.toLowerCase().includes(language.toLowerCase())) title = `${name} (${language})`;
  if (tracks.filter((candidate) => (candidate.name || candidate.language || candidate.label) === (track.name || track.language || track.label)).length > 1) {
    title += ` - Track ${index + 1}`;
  }
  return title;
}

function Option({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.opt} accessibilityState={{ selected: active }}>
      <Text style={[styles.optText, active && { color: colors.accent }]}>{label}</Text>
      {active ? <Ionicons name="checkmark" size={16} color={colors.accent} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  inline: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' },
  full: { ...StyleSheet.absoluteFill, backgroundColor: '#000', zIndex: 10 },
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', gap: 6 },
  err: { color: '#fff', fontFamily: fonts.body, fontSize: 16, fontWeight: '800' },
  errSub: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, paddingHorizontal: 24, textAlign: 'center' },
  top: { position: 'absolute', top: 0, left: 0, right: 0, padding: 12, backgroundColor: 'rgba(0,0,0,0.45)' },
  title: { color: '#fff', fontFamily: fonts.body, fontSize: 15, fontWeight: '800' },
  centerBtn: { position: 'absolute', alignSelf: 'center', top: '50%', marginTop: -32, width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 12, paddingBottom: 8, backgroundColor: 'rgba(0,0,0,0.45)' },
  barHit: { height: 24, justifyContent: 'center' },
  bar: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  barFill: { height: 4, backgroundColor: colors.accent },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  time: { color: '#fff', fontFamily: fonts.body, fontSize: 12 },
  menu: { position: 'absolute', right: 12, bottom: 64, minWidth: 190, maxHeight: '70%', backgroundColor: 'rgba(22,17,24,0.96)', borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 10 },
  menuTabs: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  menuTab: { color: colors.muted, fontFamily: fonts.body, fontWeight: '800', fontSize: 13 },
  menuTabOn: { color: '#fff', textDecorationLine: 'underline' },
  menuEmpty: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, maxWidth: 200 },
  options: { maxHeight: 330 },
  opt: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingVertical: 8 },
  optText: { color: '#fff', fontFamily: fonts.body, fontSize: 14 },
});
