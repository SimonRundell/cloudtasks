# Cloud Responsibility Grid

A classroom activity for NCFE Level 2, BTec Level 3 and T-Level Level 3 students. It covers the shared responsibility model across On-premises (private cloud), IaaS, PaaS and SaaS.

Students click each of 32 tiles (4 models by 8 layers) to say who manages that layer: **You** (green) or the **Cloud provider** (blue). Submit unlocks when every tile has an answer, then wrong tiles are marked in red.

Built with React, Vite and JavaScript. Front end only, nothing is saved between page loads.

## How to run

```bash
npm install
npm run dev      # development server
npm test         # unit and component tests
npm run lint
npm run build     # output in dist/ (includes .htaccess)
```n
## Editing the answer key

Open `src/data/serviceModels.js`. Each model has a `youLayers` number: how many layers, counting from the top (Data & access), the customer manages. Current values are 8, 5, 2 and 1. The key follows the supplied graphic, which puts the virtual machine layer with the customer in IaaS. Some textbooks differ, so change the IaaS number if your course materials say otherwise.

## Licence

Simon Rundell, Exeter College. Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International.

You are free to share and adapt this work for non-commercial purposes. You must give credit and note any changes you made. If you adapt it, you must share your version under the same licence.

Full terms: https://creativecommons.org/licenses/by-nc-sa/4.0/