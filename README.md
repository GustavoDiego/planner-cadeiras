# 🗂️ Planner de Cadeiras (Grade Horária)

[![Deploy Angular to GitHub Pages](https://github.com/GustavoDiego/planner-cadeiras/actions/workflows/deploy.yml/badge.svg)](https://github.com/GustavoDiego/planner-cadeiras/actions/workflows/deploy.yml)
![Angular](https://img.shields.io/badge/Angular-20-dd0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Um app **Angular** moderno para montar e gerenciar sua grade de disciplinas com **drag-and-drop**, períodos (Manhã/Tarde/Noite), **exportação em PNG**, tema **claro/escuro**, rolagem assistida durante o arraste, e design caprichado.

👉 **Demo (GitHub Pages):** `https://gustavodiego.github.io/planner-cadeiras/`

---

## ✨ Features

- 🧲 **Arrastar & soltar** (Angular CDK) entre dias/horários
- 🗂️ **Períodos** (Manhã / Tarde / Noite) com **expansão/colapso**
- 🧮 **Linhas auto-alinhadas**: sincronia de alturas por linha/mapa de slots
- 🖼️ **Exportar PNG** da grade e de cards individuais (share)
- 🌓 **Tema** claro/escuro (tokens CSS)
- 🧭 **Rolagem automática** durante o drag (vertical e horizontal)
- 🧱 **SPA fallback** (404.html) para rotas no GitHub Pages
- ♿ **Acessível**: foco por teclado, `aria-*`, e preview de drag adequado
- 📱 **Responsivo** (grid fluido, sticky headers, colunas com min/max)

---

## 🚀 Começando

### Requisitos

- **Node 20+**
- **Angular CLI 20+**

### Instalação

```bash
npm ci
```

### Dev server

```bash
ng serve
```

Abra `http://localhost:4200/`. O app recarrega ao salvar.

---

## 🧱 Build

Produção (otimizado):

```bash
ng build --configuration production
```

Saída padrão: `dist/<nome-do-app>/browser`

> Para GitHub Pages (subpasta do repositório), **use base-href**:

```bash
ng build --configuration production --base-href /planner-cadeiras/
```

---

## ☁️ Deploy (GitHub Pages via Actions)

Este repositório está pronto para publicar **automaticamente** ao fazer **push na branch `master`**.

### Workflow (já pronto)

`.github/workflows/deploy.yml`:

- build com `--base-href /planner-cadeiras/`
- gera `404.html` (fallback SPA) e `.nojekyll`
- publica em **GitHub Pages**

### Ative o Pages

1. Vá em **Settings → Pages**
2. Em **Source**, selecione **GitHub Actions**

Pronto. A cada `git push` na `master`, sai deploy para:

```
https://gustavodiego.github.io/planner-cadeiras/
```

---

## 🔧 Scripts úteis

```bash
# Dev
ng serve

# Build produção (raiz)
ng build --configuration production

# Build para GH Pages (usa subpasta /planner-cadeiras/)
ng build --configuration production --base-href /planner-cadeiras/
```


---

## 🧰 Estrutura do projeto (principal)

```
src/
  app/
    core/
      services/
        export-image.service.ts   # exporta elementos como PNG
        toast.service.ts          # toasts
      state/ui-state.service.ts   # estado global simples (UI)
    features/
      schedule/
        components/
          schedule-grid/          # grade com CDK drag/drop
          course-card/            # card compacto (arrastável)
          course-modal/           # modal para criar/editar
          course-share/           # visual/PNG compartilhável
          confirm-dialog/         # confirmação de exclusão
        models/
          course.model.ts
        state/
          schedule.store.ts       # store simples da agenda
        utils/
          time-utils.ts           # SLOT_TO_TIME, labels, etc
    shared/
      components/footer/          # rodapé
  styles.scss                      # tokens e temas (light/dark)
```

---

## 🧠 Decisões de arquitetura

- **Signals/Computed/Effects** para estado local de componentes;
- **Angular CDK DragDrop** para arraste com **auto-scroll** (vertical e horizontal);
- **ResizeObserver/MutationObserver** para **sincronizar alturas** de linhas dinamicamente;
- **Tokens CSS** e `color-mix()` para temas e skins;
- **Exportação de PNG** via serviço (captura de elementos do DOM);
- **SPA Fallback (404.html)** para funcionar no GitHub Pages em qualquer rota.

---

## 🎯 Dicas de uso

- **Exportar PNG da grade**: botão “Baixar horários” (a UI troca para modo `exporting`, remove sombras/handles e aplica background consistente).
- **Arraste** pelo **ícone “move”** do card (handle).
  No export, o handle **não aparece**.
- **Colapsar/Expandir períodos**: clique em “Manhã/Tarde/Noite”.

---

## 🐛 Troubleshooting

- **Página 404/blank no Pages**
  Garanta que o build usou `--base-href /planner-cadeiras/` **e** o workflow criou `404.html` & `.nojekyll` (já incluso).
- **Linhas desalinhadas**
  A sincronização de altura roda após mutações/resize. Se mexer no layout, mantenha as classes/atributos (`data-p`, `data-i`) e chame `syncRowHeights()` após mudanças grandes.
- **Warnings de orçamento (budgets)**
  Esses avisos **não** quebram o build. Se quiser ajustar, edite `angular.json` > `budgets`.

---

## 🧹 Lint & Formatação (opcional)

Integre ESLint/Prettier caso queira. Ex.:

```bash
# instalar
npm i -D eslint @angular-eslint/schematics prettier eslint-config-prettier eslint-plugin-prettier

# gerar config angular-eslint
ng add @angular-eslint/schematics
```

---

## 🗺️ Roadmap (ideias)

- [ ] Persistência em LocalStorage/IndexedDB
- [ ] Import/Export de plano (JSON)
- [ ] Atalhos de teclado (mover card, navegar células)
- [ ] i18n (pt/pt-BR/en)
- [ ] Testes E2E (Playwright) no CI

---

## 🤝 Contribuindo

1. Faça um fork
2. Crie sua branch: `git checkout -b feat/minha-feature`
3. Commit: `git commit -m "feat: minha feature"`
4. Push: `git push origin feat/minha-feature`
5. Abra um PR 🎉

Padrão sugerido: **Conventional Commits**.

---

## 📄 Licença

**MIT** – veja `LICENSE`.

---

## 🙌 Créditos

Feito com ❤️ por **@GustavoDiego**.
Obrigado a todo mundo que usa, reporta issues e envia PRs!

---

## 🔗 Links rápidos

- Angular CLI: [https://angular.dev/tools/cli](https://angular.dev/tools/cli)
- Angular CDK Drag\&Drop: [https://material.angular.io/cdk/drag-drop/overview](https://material.angular.io/cdk/drag-drop/overview)
- GitHub Pages: [https://pages.github.com/](https://pages.github.com/)

> Curtiu? Abre uma ⭐ no repositório!
