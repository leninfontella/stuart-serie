# Stuart Não Consegue Salvar o Universo

Landing page responsiva, em português, criada para apresentar a série fictícia **Stuart Não Consegue Salvar o Universo**. O projeto reúne trailer, sinopse, ficha técnica, produções relacionadas e uma experiência visual inspirada em ficção científica.

> Projeto conceitual feito para fins de estudo e portfólio. As marcas, personagens e obras mencionadas pertencem aos seus respectivos detentores.

## Demonstração

[Acessar a versão publicada](https://stuart-serie.vercel.app/)

## Funcionalidades

- menu responsivo com navegação suave entre seções;
- destaque automático do item de navegação conforme a rolagem (scroll spy);
- barra de progresso de leitura;
- hero com efeito parallax;
- trailer incorporado do YouTube;
- animações de entrada acionadas durante a rolagem;
- seção de visão geral com sinopse e ficha técnica;
- cards de séries relacionadas;
- vídeo em loop e efeitos visuais temáticos;
- respeito à preferência do sistema por movimento reduzido;
- metadados Open Graph e Twitter Card para compartilhamento.

## Tecnologias

- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite 5](https://vitejs.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/)
- [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/), carregado via CDN

## Como executar

### Pré-requisitos

- Node.js 18 ou superior
- npm

### Instalação

```bash
git clone <URL_DO_REPOSITORIO>
cd stuart-site
npm install
npm run dev
```

Abra o endereço exibido pelo Vite no terminal (normalmente `http://localhost:5173`).

O trailer do YouTube e as animações do AOS dependem de conexão com a internet. As demais imagens e o vídeo de ambientação ficam em `public/images`.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor local com recarregamento automático. |
| `npm run build` | Gera a versão otimizada de produção em `dist/`. |
| `npm run preview` | Serve localmente a versão gerada em `dist/`. |
| `npm run lint` | Analisa o código com ESLint. |
| `npm run typecheck` | Executa somente a verificação de tipos do TypeScript. |

## Estrutura do projeto

```text
stuart-site/
├── public/
│   └── images/          # Imagens, logos e vídeos da página
├── src/
│   ├── App.tsx          # Conteúdo, componentes e interações da landing page
│   ├── index.css        # Estilos globais, animações e responsividade
│   └── main.tsx         # Ponto de entrada da aplicação React
├── index.html           # Documento base e metadados sociais
├── tailwind.config.js   # Configuração do Tailwind CSS
└── vite.config.ts       # Configuração do Vite e alias `@`
```

## Gerando a versão de produção

```bash
npm run build
npm run preview
```

O resultado otimizado será criado na pasta `dist`. Por ser uma aplicação de página única sem rotas no servidor, ela pode ser publicada em serviços de hospedagem estática como Vercel, Netlify ou GitHub Pages.

## Observações sobre a implementação

- A interface está concentrada em `src/App.tsx`; não há backend nem persistência de dados.
- O AOS é inserido dinamicamente pelo componente principal, em vez de ser empacotado como dependência local.
- Alguns links do rodapé e de redes sociais são placeholders e ainda não apontam para páginas externas reais.
- Há uma dependência de Supabase declarada no projeto, mas ela não é utilizada pela implementação atual.
