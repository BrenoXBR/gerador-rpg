# ⚔️ O Forjador Arcano: Gerador de Itens RPG 🛡️

O **Forjador Arcano** é uma ferramenta completa para Mestres de RPG que desejam criar, gerenciar e sortear loots de forma épica e organizada. O sistema foi desenvolvido com uma arquitetura modular para garantir estabilidade e facilidade de manutenção.

## 🌟 Funcionalidades Principais

* **🔐 Sistema de Autenticação**: Painel de Login e Cadastro exclusivo para o Mestre, garantindo que apenas ele controle a base de dados de itens.
* **📊 Atributos Base Dinâmicos**: Liberdade total para criar barras de progresso (como Ataque, Defesa ou Magia) com valores customizados de 0 a 100.
* **✨ Status Personalizados**: Adicione sub-atributos específicos para cada item, como "Dano de Fogo" ou "Recuo".
* **🖼️ Alquimia Visual**: Suporte a imagens via URL para ilustrar cada tesouro encontrado.
* **🎲 Sorteio com Filtros**: Os jogadores podem sortear itens aleatórios filtrando por categorias como Armas, Armaduras ou Consumíveis.
* **📥 Exportação de Fichas**: Botão integrado para baixar a carta do item como imagem (PNG), ideal para compartilhar em grupos de jogo.
* **📱 Design Compacto**: Fichas otimizadas com layout "lado a lado" para facilitar a leitura sem necessidade de muito scroll.

## 🛠️ Tecnologias Utilizadas

Para evitar erros de processamento e sobrecarga de código, o projeto utiliza uma estrutura modular:

1.  **HTML5 & CSS3**: Interface responsiva com estética Dark Medieval.
2.  **Vanilla JavaScript**: Lógica separada em módulos (`auth.js`, `items.js`, `ui.js`, `main.js`).
3.  **LocalStorage**: Armazenamento de dados local no navegador.
4.  **Html2Canvas**: Biblioteca para conversão de elementos HTML em imagens.

## 📜 Como Utilizar

1.  **Acesso do Mestre**: Crie sua conta na tela inicial para começar a forjar seus itens.
2.  **Configuração**: Adicione quantos Atributos Base ou Status quiser ao criar um item.
3.  **Modo Jogador**: Ao entrar como jogador, o painel de edição é ocultado, sobrando apenas a área de sorteio.
4.  **Coleta de Loot**: Após o sorteio, clique em "Baixar Carta" para salvar o pergaminho do item.

---
*Desenvolvido para elevar o nível das suas campanhas de RPG.* 🐉🔥
