# map-staff

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run firebase rules tests
Requires firebase-tools: https://github.com/firebase/firebase-tools

Setup:

```
firebase setup:emulators:firestore
firebase use --add <firebase project id>
```

To run:

```
firebase emulators:start --only firestore
npm test
```

### Lints and fixes files
```
npm run lint
```

### Deploy

Firestore Rules:
```
firebase deploy --only firestore:rules
```