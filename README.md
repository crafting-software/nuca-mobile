# Nuca - mobile

## Environment variables setup

### Dev

- create a file named `.env.development.local`
- add your variable in that file e.g. `MAPBOX_API_KEY=ABCDEF...XYZ`
- import the variable by using the `expo-constants` module e.g.

```ts
import Constants;
export const mapboxKey = Constants.expoConfig?.extra?.mapboxApiKey;
```

### Prod

- similar to dev, create a file named `.env.production.local`
- add your variable in that file
- import the variable as mentioned in the **dev** section above
