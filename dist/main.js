// GameUIVault - Main Scripts
// Version: 1.0.0

console.log('GameUIVault scripts loaded ✓');
```

Unten auf **„Commit changes"** klicken → „Commit directly to main" → **„Commit changes"**

---

## Phase 3: GitHub Release erstellen

Das ist der wichtigste Schritt — jsDelivr braucht einen **Release** (eine Versionsnummer), um den Code stabil zu hosten.

### Schritt 4: Release erstellen

1. Auf der Repo-Startseite rechts auf **„Releases"** klicken
2. **„Create a new release"** klicken
3. Ausfüllen:
   - **„Choose a tag"** → tippe `v1.0.0` → „Create new tag: v1.0.0"
   - **Release title:** `v1.0.0 - Initial release`
4. **„Publish release"** klicken

---

## Phase 4: jsDelivr URL bauen

### Schritt 5: Deine CDN-URL

Das Muster ist immer:
```
https://cdn.jsdelivr.net/gh/DEIN-USERNAME/DEIN-REPO@VERSION/PFAD-ZUR-DATEI
```

Also konkret — ersetze `DEIN-USERNAME` mit deinem GitHub-Nutzernamen:
```
https://cdn.jsdelivr.net/gh/viertagewoche/gameuivault-scripts@v1.0.0/dist/main.js
