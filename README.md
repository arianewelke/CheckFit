# CheckFit - Sistema de Gestão de Atividades Fitness

## Sobre o Projeto

CheckFit é uma aplicação web completa para gestão de atividades fitness, permitindo que usuários se cadastrem, visualizem atividades disponíveis e façam check-ins de forma rápida e intuitiva. O sistema oferece uma experiência eficiente e responsiva para academias e centros de atividades físicas.

## Características Principais

### Backend (Spring Boot)
- **API RESTful**: Endpoints organizados e documentados
- **Segurança**: JWT authentication com Spring Security
- **Banco de Dados**: JPA/Hibernate com MySQL
- **Validações**: Validação de dados com Bean Validation
- **Arquitetura Limpa**: Separação clara entre camadas (Controller, Service, Repository)


### Frontend (React)
- **Responsividade**: Adaptado para desktop, tablet e mobile
- **Navegação Intuitiva**: SPA com React Router DOM
- **Autenticação**: Sistema completo de login e registro
- **Filtros Avançados**: Busca, filtros por data e status com paginação
- **Check-in Rápido**: Processo simplificado de check-in com um clique

## Tecnologias Utilizadas

### Backend
- **Java 17** - Linguagem de programação
- **Spring Boot 3** - Framework principal
- **Spring Security** - Autenticação e autorização
- **Spring Data JPA** - Persistência de dados
- **Hibernate** - ORM
- **MySQL** - Banco de dados
- **JWT** - Tokens de autenticação
- **Maven** - Gerenciamento de dependências


### Frontend
- **React 19** - Biblioteca principal
- **Vite** - Build tool e desenvolvimento
- **React Router DOM** - Navegação SPA
- **Axios** - Cliente HTTP
- **CSS3** - Estilização com CSS Variables
- **JavaScript ES6+** - Linguagem de programação

## Instalação e Configuração

### Pré-requisitos
- **Java 17+**
- **Node.js 16+**
- **MySQL 8.0+**
- **Maven 3.8+**

### 1. Configuração do Banco de Dados

```sql
DROP SCHEMA IF EXISTS `checkfit`;

CREATE DATABASE checkfit;

CREATE USER 'checkfit_user'@'localhost' IDENTIFIED BY 'sua_senha';

GRANT ALL PRIVILEGES ON checkfit.* TO 'checkfit_user'@'localhost';

FLUSH PRIVILEGES;

use `checkfit`;

CREATE TABLE user(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(60) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  cpf CHAR(11) NOT NULL UNIQUE, 
  dateBirth DATE NOT NULL,
  password CHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity( 
  id INT AUTO_INCREMENT PRIMARY KEY,
  startTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  finishTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description VARCHAR(200),
  limitPeople INT NOT NULL,
  countPeople INT NOT NULL
);

  CREATE TABLE checkin(
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  activityId INT NOT NULL,
  checkinTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES user(id),
  FOREIGN KEY (activityId) REFERENCES activity(id)
);

```

![Diagrama ER](https://raw.githubusercontent.com/arianewelke/CheckFit/refs/heads/main/assets/EER.png)


### 2. Configuração do Backend

1. Clone o repositório:
```bash
git clone https://github.com/arianewelke/checkfit.git
cd checkfit
```

2. Configure o arquivo `application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/checkfit
spring.datasource.username=checkfit_user
spring.datasource.password=sua_senha
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

# Security Configuration
api.security.token.secret=minha-chave-secreta-jwt
```

3. Execute o backend:
```bash
mvn spring-boot:run
```

O backend estará disponível em `http://localhost:8080`

### 3. Configuração do Frontend

1. Navegue para o diretório do frontend:
```bash
cd checkfit-frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o frontend:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5174`

##  Funcionalidades Detalhadas

###  Sistema de Autenticação
- **Registro de Usuário**: Cadastro com validação de CPF, telefone e email
- **Login Seguro**: Autenticação JWT com tokens de 2 horas de duração
- **Validações**: CPF (11 dígitos), telefone (10-11 dígitos), senha forte
- **Auto-login**: Login automático após registro bem-sucedido

### Gestão de Atividades
- **Visualização**: Lista paginada com filtros avançados
- **Busca**: Busca por nome da atividade
- **Filtros**: Por data, status (disponível/lotada)
- **Ordenação**: Por data, nome ou disponibilidade
- **Paginação**: 6 atividades por página
- **Status em Tempo Real**: Visualização de vagas disponíveis

###  Sistema de Check-in
- **Check-in Rápido**: Um clique para confirmar presença
- **Validações**: Verificação de vagas disponíveis
- **Feedback Visual**: Toast notifications para sucesso/erro
- **Histórico Completo**: Visualização de todos os check-ins

###  Interface e UX
- **Design Responsivo**: Adaptado para todos os dispositivos
- **Toast Notifications**: Feedback não-invasivo fixo na tela
- **Loading States**: Indicadores visuais durante carregamento
- **Formatação de Datas**: Formato brasileiro (DD/MM/AAAA HH:mm)
- **Navegação Intuitiva**: Breadcrumbs e navegação clara

###  Dashboard e Relatórios
- **Estatísticas**: Total de atividades e vagas disponíveis
- **Atividades Recentes**: Últimas atividades cadastradas
- **Histórico Detalhado**: Lista completa com filtros e paginação
- **Cards Informativos**: Visual atrativo com métricas importantes

##  API Endpoints

### Autenticação
```http
POST /auth/register    # Cadastro de usuário
POST /auth/login       # Login de usuário
```

### Atividades
```http
GET  /activity         # Listar atividades
GET  /activity/{id}    # Buscar atividade por ID
GET  /activity/availability/{id}  # Verificar disponibilidade
```

### Check-ins
```http
POST /checkin          # Realizar check-in
GET  /checkin/history  # Histórico do usuário
GET  /checkin/{id}     # Buscar check-in por ID
```

## Design System

### Cores Principais
- **Primary**: #6366F1 (Indigo)
- **Secondary**: #10B981 (Emerald)
- **Success**: #22C55E (Green)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Tamanhos**: 0.75rem a 2.5rem
- **Pesos**: 400, 500, 600, 700

### Componentes
- **Botões**: 4 variantes (primary, secondary, success, danger)
- **Cards**: Sombras suaves e bordas arredondadas
- **Formulários**: Campos com focus states e validação visual
- **Navegação**: Navbar responsiva com hamburger menu

## Segurança

### Backend
- **JWT Authentication**: Tokens seguros com expiração
- **Password Encoding**: BCrypt para hash de senhas
- **CORS**: Configurado para permitir frontend
- **Validação de Dados**: Bean Validation em todos os endpoints
- **SQL Injection**: Proteção via JPA/Hibernate

### Frontend
- **Token Storage**: LocalStorage com verificação de expiração
- **Rota Protection**: Redirecionamento para login se não autenticado
- **Input Validation**: Validação client-side e server-side
- **XSS Protection**: Sanitização de dados de entrada

## Melhorias Futuras

### Backend
- Refresh tokens para segurança aprimorada
- Notificações por email
- Analytics e dashboard admin
- Sistema de gamificação
- Testes de integração

### Frontend
- PWA (Progressive Web App)
- Dark mode
- Push notifications
- Calendario de atividades


## Deploy

### Produção

1. **Backend**: Deploy no Render utilizando Docker. O serviço fica ativo na nuvem, acessível via HTTPS.
2. **Frontend**: Deploy no Vercel como aplicação estática. Servido via CDN, garantindo rapidez e alta disponibilidade.
3. **Database**: Banco de dados em produção no Render (MySQL), com backup automático e alta disponibilidade.

## Contato

- **Email**: arianewelkep97@gmail.com
- **LinkedIn**: https://www.linkedin.com/in/arianewelke/
- **GitHub**: https://github.com/arianewelke

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela!**

📝 **Última atualização**: Junho 2025 