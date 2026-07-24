# Lava Jato Tá Novo - Sistema Premium 🏆

![Logo](./public/logo.png)

> **"Onde seu carro sai novo e seu negócio voa."**

*Um sistema de gestão moderno para Estética Automotiva, focado em alta performance, Experiência do Cliente (CX) e design sofisticado e prático.*

---

## ✨ Funcionalidades Principais:

### 🎨 Experiência Premium (UI/UX):
- **Dark Glass Aesthetic**: Interface moderna com transparências e desfoque (Glassmorphism), inspirada nos dashboards mais futuristas;
- **Animações Fluidas**: Transições suaves entre telas e interações táteis powered by `Framer Motion`;
- **Mobile First**: Portal do Cliente 100% otimizado para celulares.

### 💳 Financeiro & Pix Profissional:
- **Pix com BR Code**: Geração automática de QRCodes compatíveis com qualquer app bancário.
- **Feedback Visual**: Confirmação de pagamento com animações de sucesso (sem alertas intrusivos).
- **Controle de Caixa**: Dashboard financeiro com gráficos semanais e tickets médios.

### 🛡️ Segurança & Acesso:
- **Modo Furtivo (Stealth Mode)**: O painel administrativo fica oculto por padrão. A equipe acessa através de um gatilho secreto.
- **MFA (Autenticação de Dois Fatores)**: Login seguro via **Google Authenticator**. Nada de senhas fracas.
- **Login Seguro**: Validação de telefone para evitar duplicidade de clientes.

### 📊 Operacional:
- **Kanban Interativo**: Fluxo visual (Aguardando → Lavando → Pronto).
- **Histórico Vitalício**: Registro completo de todos os serviços, com possibilidade de edição e auditoria.
- **Configuração Dinâmica**: Tabelas de preços ajustáveis em tempo real.

---

## 🚀 Tecnologias Utilizadas:

- O projeto foi construído com o que há de mais moderno no ecossistema React:

| Tech | Função |
|------|--------|
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | Core Framework |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) | Build Tool ultrarrápido |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | Estilização Utilitária |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) | Animações complexas |
| **Lucide React** | Íconografia vetorial leve |
| **Recharts** | Visualização de dados (BI) |
| **OTPAuth** | Segurança criptográfica (TOTP) |
| **QRCodes** | Padrão EMV BR Code |

---

## 📦 Como Rodar:

- *Pré-requisitos: Node.js 18+ instalado.*

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/lava-jato-ta-novo.git
   cd lava-jato-ta-novo
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Rode o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse:**
   👉 Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

---

## 🔐 Acesso Administrativo (Segredo):

- Como o sistema possui **Stealth Mode**, o botão de login não aparece inicialmente:

1. Na tela inicial, clique **3 vezes rapidamente** no título **"Lava Jato Tá Novo"**;
2. O botão **"Equipe / Staff"** aparecerá;
3. No primeiro acesso, escaneie o QR Code com seu app autenticador.

---

## 📱 Portal do Cliente:

Para testar a visão do cliente:
1. Clique em **"Sou Cliente"**;
2. Digite um número de celular (Ex: `11999999999`);
3. Acompanhe seus veículos em tempo real em visualização clara e de fácil entendimento.

---

## 📄 Licença:

> Este projeto é proprietário e desenvolvido por Hyago Santos para uso exclusivo para modelo.
