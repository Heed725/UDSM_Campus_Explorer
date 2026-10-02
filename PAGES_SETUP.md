# Publish on GitHub Pages

All website files are in `docs/`. Both explorers share assets but use separate campus datasets.

1. Sign in to GitHub as a repository administrator.
2. Open https://github.com/Heed725/UDSM_Campus_Explorer/settings/pages .
3. Source: **Deploy from a branch**.
4. Branch: **main**.
5. Folder: **/docs**.
6. Click **Save**.
7. In **Actions**, wait for the **pages build and deployment** workflow to succeed.
8. Check the Pages settings for the published URL.

Expected URLs after publication:

- https://heed725.github.io/UDSM_Campus_Explorer/
- https://heed725.github.io/UDSM_Campus_Explorer/coict/

The `Validate explorers` workflow checks source and spatial calculations; GitHub's built-in Pages workflow publishes the website after Pages is enabled. The code is plain static HTML/CSS/JavaScript. Do not select a Jekyll theme, add an API key, or configure an R/Shiny server for this implementation.

If a page shows older data, refresh the page. If a basemap is unavailable, select another basemap; campus geometry is bundled and remains usable.
