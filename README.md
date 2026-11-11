# Thunder Streams (React Native / Expo)

Native port of [thunderstreams_front](https://github.com/ppomega/thunderstreams_front). Uses the same backend
(`/assets`, `/animeInfo`, `/file`, DASH `output.mpd`).

## Run

```bash
npm install
cp .env.example .env        # set EXPO_PUBLIC_API_URL to your backend (same as VITE_APP_API_URL)
npx expo start --android    # works in Expo Go on Android
```

## Screens (web route -> native)

| Web | Native |
| --- | --- |
| `/` Home (slider + carousels) | `src/app/(tabs)/index.tsx` |
| `/anime` | `src/app/(tabs)/anime.tsx` (rows grouped by genre) |
| navbar search popup | `src/app/(tabs)/search.tsx` |
| `/aboutus` | `src/app/(tabs)/about.tsx` |
| `/series` | `src/app/series/[id].tsx` |
| `/play` (dash.js) | `src/app/play.tsx` + `src/components/VideoPlayer.tsx` (expo-video) |

## Notes

- **DASH is Android-only** in `expo-video`. iOS needs HLS output from the backend, or a native DASH transport provider.
- Quality menu is "Auto / Up to Np" (`player.maxResolution`); expo-video cannot pin one exact rendition like dash.js did.
- The web `/auth` login page was a non-functional stub and is not ported. Dark theme only.
