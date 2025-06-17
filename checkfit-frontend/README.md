# CheckFit Frontend

Uma aplicação React para gerenciamento de atividades fitness com sistema de check-in.

## 🚀 Melhorias Implementadas

### Design System Completo
- **Variáveis CSS** personalizadas para cores, espaçamentos, tipografia e sombras
- **Sistema de cores** moderno com paleta principal (Indigo) e secundária (Emerald)
- **Componentes reutilizáveis** com classes utilitárias
- **Responsividade** otimizada para mobile e desktop

### Páginas Redesenhadas

#### 🏠 Landing Page
- **Hero section** atrativa com call-to-action
- **Seção de features** destacando funcionalidades
- **Design moderno** com gradientes e animações suaves

#### 🔐 Autenticação
- **Login e Registro** redesenhados com layout split-screen
- **Validação de formulários** com feedback visual
- **Estados de loading** e tratamento de erros
- **Links de navegação** intuitivos

#### 🏠 Dashboard (Home)
- **Cards de estatísticas** mostrando métricas importantes
- **Ações rápidas** para navegação principal
- **Atividades em destaque** com informações detalhadas
- **Seção de boas-vindas** personalizada

#### 🏃‍♂️ Atividades
- **Grid responsivo** de cards de atividade
- **Sistema de busca** por nome/descrição
- **Filtros** por disponibilidade (Todas, Disponíveis, Lotadas)
- **Status badges** visuais para vagas disponíveis
- **Informações detalhadas** de cada atividade

### Componentes Criados

#### 📍 Navbar
- **Menu responsivo** com hambúrguer para mobile
- **Navegação ativa** com highlights
- **Logout** integrado
- **Design consistente** com o sistema

### Funcionalidades Técnicas

#### 🎨 Sistema de Design
- **CSS Variables** para manutenção fácil
- **Classes utilitárias** para layout e spacing
- **Animações suaves** com transições CSS
- **Estados hover** e feedback visual

#### 📱 Responsividade
- **Grid layouts** adaptativos
- **Breakpoints** otimizados
- **Menu mobile** funcional
- **Tipografia responsiva**

#### 🔒 Melhorias de UX
- **Estados de loading** com spinners
- **Feedback de erro** contextual
- **Navegação intuitiva** entre páginas
- **Proteção de rotas** por autenticação

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework principal
- **React Router DOM** - Roteamento
- **Axios** - Requisições HTTP
- **Vite** - Build tool
- **CSS3** - Estilização moderna

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Passos para executar

1. **Navegue para o diretório do frontend:**
   ```bash
   cd checkfit-frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação:**
   - URL: `http://localhost:5173`

### Para Windows PowerShell

Se encontrar erro com `&&` no PowerShell, execute os comandos separadamente:

```powershell
cd checkfit-frontend
npm run dev
```

## 🎯 Funcionalidades Principais

### Para Usuários Não Autenticados
- **Landing Page** atrativa
- **Registro** de nova conta
- **Login** com credenciais existentes

### Para Usuários Autenticados
- **Dashboard** com métricas e ações rápidas
- **Visualização de atividades** com busca e filtros
- **Check-in** em atividades disponíveis
- **Histórico** de check-ins realizados
- **Navegação** intuitiva entre páginas

## 🔧 Backend Integration

A aplicação está configurada para se conectar com o backend Spring Boot:

- **Base URL:** `http://localhost:8080`
- **Autenticação:** JWT Token
- **Endpoints:** `/auth/login`, `/auth/register`, `/activity`, `/checkin`

## 📱 Funcionalidades Mobile

- **Menu responsivo** com hambúrguer
- **Cards adaptáveis** para telas pequenas
- **Formulários otimizados** para mobile
- **Navegação touch-friendly**

## 🎨 Customização

O sistema de design é facilmente customizável através das variáveis CSS em `src/index.css`:

```css
:root {
  --primary: #4F46E5;        /* Cor principal */
  --secondary: #10B981;      /* Cor secundária */
  --success: #10B981;        /* Cor de sucesso */
  --error: #EF4444;          /* Cor de erro */
  /* ... outras variáveis */
}
```

## 🚀 Próximos Passos

### Melhorias Sugeridas
1. **PWA** - Transformar em Progressive Web App
2. **Dark Mode** - Implementar tema escuro
3. **Notificações** - Sistema de notificações push
4. **Charts** - Gráficos de progresso
5. **Gamificação** - Badges e conquistas

### Performance
- **Code Splitting** - Lazy loading de rotas
- **Image Optimization** - Otimização de imagens
- **Caching** - Estratégias de cache

---

**Desenvolvido com ❤️ para uma melhor experiência fitness**
