class ItemManager {
    constructor() {
        this.items = [];
        this.currentEditId = null;
        this.customAttributeCount = 0;
        this.initializeEventListeners();
        this.loadItems();
    }

    initializeEventListeners() {
        // Formulário de item
        document.getElementById('itemForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveItem();
        });

        // Botão de adicionar atributo base
        document.getElementById('addBaseAttributeBtn').addEventListener('click', () => {
            this.addBaseAttribute();
        });

        // Botão de adicionar atributo personalizado
        document.getElementById('addAttributeBtn').addEventListener('click', () => {
            this.addCustomAttribute();
        });

        // Botão cancelar edição
        document.getElementById('cancelEditBtn').addEventListener('click', () => {
            this.cancelEdit();
        });

        // Botão de sorteio
        document.getElementById('rollBtn').addEventListener('click', () => {
            this.rollRandomItem();
        });

        // Filtros de sorteio
        document.querySelectorAll('.roll-filters input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateRollFilters();
            });
        });

        // Botões de importação/exportação
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportItems();
        });

        document.getElementById('btnImport').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importItems(e.target.files[0]);
        });
    }

    addBaseAttribute() {
        this.baseAttributeCount = (this.baseAttributeCount || 0) + 1;
        const container = document.getElementById('baseAttributes');
        
        const attributeDiv = document.createElement('div');
        attributeDiv.className = 'base-attribute-item';
        attributeDiv.innerHTML = `
            <div class="attribute-header">
                <input type="text" placeholder="Nome do atributo" class="base-attr-name">
                <button type="button" class="btn-remove-attr" data-id="base-${this.baseAttributeCount}">×</button>
            </div>
            <div class="attribute-slider">
                <input type="range" class="attribute-bar" min="0" max="100" value="50">
                <span class="attribute-value">50</span>
            </div>
        `;

        container.appendChild(attributeDiv);

        // Adicionar evento de remoção
        attributeDiv.querySelector('.btn-remove-attr').addEventListener('click', (e) => {
            this.removeBaseAttribute(e.target.closest('.base-attribute-item'));
        });

        // Adicionar evento de atualização do valor
        const slider = attributeDiv.querySelector('.attribute-bar');
        const valueSpan = attributeDiv.querySelector('.attribute-value');
        slider.addEventListener('input', (e) => {
            valueSpan.textContent = e.target.value;
        });
    }

    removeBaseAttribute(element) {
        element.remove();
    }

    addCustomAttribute() {
        this.customAttributeCount++;
        const container = document.getElementById('customAttributes');
        
        const attributeDiv = document.createElement('div');
        attributeDiv.className = 'custom-attribute-item';
        attributeDiv.innerHTML = `
            <div class="attribute-header">
                <input type="text" placeholder="Nome do atributo" class="attr-name">
                <button type="button" class="btn-remove-attr" data-id="${this.customAttributeCount}">×</button>
            </div>
            <input type="text" placeholder="Valor do atributo" class="attr-value">
        `;

        container.appendChild(attributeDiv);

        // Adicionar evento de remoção
        attributeDiv.querySelector('.btn-remove-attr').addEventListener('click', (e) => {
            this.removeCustomAttribute(e.target.closest('.custom-attribute-item'));
        });
    }

    removeCustomAttribute(element) {
        element.remove();
    }

    saveItem() {
        const name = document.getElementById('itemName').value;
        const type = document.getElementById('itemType').value;
        const rarity = document.getElementById('itemRarity').value;
        const description = document.getElementById('itemDescription').value;
        const image = document.getElementById('itemImage').value;

        // Coletar atributos base dinâmicos
        const baseAttributes = {};
        document.querySelectorAll('#baseAttributes .base-attribute-item').forEach(item => {
            const name = item.querySelector('.base-attr-name').value;
            const value = item.querySelector('.attribute-bar').value;
            if (name) {
                baseAttributes[name] = parseInt(value);
            }
        });

        // Coletar atributos personalizados
        const customAttributes = {};
        document.querySelectorAll('#customAttributes .custom-attribute-item').forEach(item => {
            const name = item.querySelector('.attr-name').value;
            const value = item.querySelector('.attr-value').value;
            if (name && value) {
                customAttributes[name] = value;
            }
        });

        const item = {
            id: this.currentEditId || Date.now(),
            name,
            type,
            rarity,
            description,
            image,
            baseAttributes,
            customAttributes,
            createdAt: this.currentEditId ? 
                this.items.find(i => i.id === this.currentEditId).createdAt : 
                new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.currentEditId) {
            // Atualizar item existente
            const index = this.items.findIndex(i => i.id === this.currentEditId);
            this.items[index] = item;
            this.currentEditId = null;
        } else {
            // Adicionar novo item
            this.items.push(item);
        }

        this.saveItems();
        this.loadItems();
        this.resetForm();
        this.showSuccess('Item salvo com sucesso!');
    }

    editItem(id) {
        const item = this.items.find(i => i.id === id);
        if (!item) return;

        this.currentEditId = id;

        // Preencher formulário
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemType').value = item.type;
        document.getElementById('itemRarity').value = item.rarity;
        document.getElementById('itemDescription').value = item.description || '';
        document.getElementById('itemImage').value = item.image || '';

        // Limpar e preencher atributos base dinâmicos
        document.getElementById('baseAttributes').innerHTML = '';
        Object.keys(item.baseAttributes || {}).forEach(attrName => {
            this.baseAttributeCount = (this.baseAttributeCount || 0) + 1;
            const container = document.getElementById('baseAttributes');
            
            const attributeDiv = document.createElement('div');
            attributeDiv.className = 'base-attribute-item';
            attributeDiv.innerHTML = `
                <div class="attribute-header">
                    <input type="text" placeholder="Nome do atributo" class="base-attr-name" value="${attrName}">
                    <button type="button" class="btn-remove-attr" data-id="base-${this.baseAttributeCount}">×</button>
                </div>
                <div class="attribute-slider">
                    <input type="range" class="attribute-bar" min="0" max="100" value="${item.baseAttributes[attrName]}">
                    <span class="attribute-value">${item.baseAttributes[attrName]}</span>
                </div>
            `;

            container.appendChild(attributeDiv);

            // Adicionar evento de remoção
            attributeDiv.querySelector('.btn-remove-attr').addEventListener('click', (e) => {
                this.removeBaseAttribute(e.target.closest('.base-attribute-item'));
            });

            // Adicionar evento de atualização do valor
            const slider = attributeDiv.querySelector('.attribute-bar');
            const valueSpan = attributeDiv.querySelector('.attribute-value');
            slider.addEventListener('input', (e) => {
                valueSpan.textContent = e.target.value;
            });
        });

        // Limpar e preencher atributos personalizados
        document.getElementById('customAttributes').innerHTML = '';
        Object.keys(item.customAttributes || {}).forEach(attrName => {
            this.customAttributeCount++;
            const container = document.getElementById('customAttributes');
            
            const attributeDiv = document.createElement('div');
            attributeDiv.className = 'custom-attribute-item';
            attributeDiv.innerHTML = `
                <div class="attribute-header">
                    <input type="text" placeholder="Nome do atributo" class="attr-name" value="${attrName}">
                    <button type="button" class="btn-remove-attr" data-id="${this.customAttributeCount}">×</button>
                </div>
                <input type="text" placeholder="Valor do atributo" class="attr-value" value="${item.customAttributes[attrName]}">
            `;

            container.appendChild(attributeDiv);

            // Adicionar evento de remoção
            attributeDiv.querySelector('.btn-remove-attr').addEventListener('click', (e) => {
                this.removeCustomAttribute(e.target.closest('.custom-attribute-item'));
            });
        });

        // Mudar texto do botão
        document.querySelector('#itemForm button[type="submit"]').textContent = 'Atualizar Item';

        // Rolar para o formulário
        document.getElementById('editPanel').scrollIntoView({ behavior: 'smooth' });
    }

    deleteItem(id) {
        if (window.uiManager) {
            window.uiManager.showDeleteModal(() => {
                this.items = this.items.filter(i => i.id !== id);
                this.saveItems();
                this.loadItems();
                this.showSuccess('Item excluído com sucesso!');
            });
        }
    }

    loadItems() {
        const savedItems = localStorage.getItem('rpgItems');
        if (savedItems) {
            this.items = JSON.parse(savedItems);
        }

        this.renderItemsList();
    }

    saveItems() {
        localStorage.setItem('rpgItems', JSON.stringify(this.items));
    }

    renderItemsList() {
        const grid = document.getElementById('itemsGrid');
        if (!grid) return;

        grid.innerHTML = '';

        this.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div class="item-image">
                    <img src="${item.image || 'https://picsum.photos/seed/item${item.id}/300/200.jpg'}" 
                         alt="${item.name}" 
                         onerror="this.src='https://picsum.photos/seed/default${item.id}/300/200.jpg'">
                </div>
                <div class="item-header">
                    <h3>${item.name}</h3>
                    <span class="item-rarity ${item.rarity}">${this.getRarityLabel(item.rarity)}</span>
                </div>
                <div class="item-meta">
                    <span class="item-type">${this.getTypeLabel(item.type)}</span>
                </div>
                ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
                <div class="item-attributes">
                    ${this.renderAttributes(item.baseAttributes, item.customAttributes)}
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="window.itemManager.editItem(${item.id})">Editar</button>
                    <button class="btn-delete" onclick="window.itemManager.deleteItem(${item.id})">Excluir</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    renderAttributes(baseAttributes, customAttributes) {
        let html = '';
        
        // Contar total de atributos
        const totalAttrs = (baseAttributes ? Object.keys(baseAttributes).length : 0) + 
                          (customAttributes ? Object.keys(customAttributes).length : 0);
        
        // Se tiver mais de 6 atributos, usar layout em duas colunas
        const useTwoColumns = totalAttrs > 6;
        
        if (useTwoColumns) {
            html += '<div class="attributes-two-columns">';
        }
        
        if (baseAttributes && Object.keys(baseAttributes).length > 0) {
            const baseAttrsHtml = Object.entries(baseAttributes).map(([name, value]) => `
                <div class="attr-bar">
                    <div class="attr-info">
                        <span class="attr-name">${name}</span>
                        <span class="attr-value">${value}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${value}%"></div>
                    </div>
                </div>
            `).join('');
            
            if (useTwoColumns) {
                html += `<div class="attr-column base-attrs">${baseAttrsHtml}</div>`;
            } else {
                html += `<div class="base-attrs">${baseAttrsHtml}</div>`;
            }
        }

        if (customAttributes && Object.keys(customAttributes).length > 0) {
            const customAttrsHtml = Object.entries(customAttributes).map(([name, value]) => 
                `<div class="attr-text"><span class="attr-name">${name}:</span> <span class="attr-value">${value}</span></div>`
            ).join('');
            
            if (useTwoColumns) {
                html += `<div class="attr-column custom-attrs">${customAttrsHtml}</div>`;
            } else {
                html += `<div class="custom-attrs">${customAttrsHtml}</div>`;
            }
        }
        
        if (useTwoColumns) {
            html += '</div>'; // Fecha .attributes-two-columns
        }

        return html;
    }

    rollRandomItem() {
        const enabledTypes = this.getEnabledTypes();
        const filteredItems = this.items.filter(item => enabledTypes.includes(item.type));

        if (filteredItems.length === 0) {
            this.showError('Nenhum item encontrado para os filtros selecionados!');
            return;
        }

        // Desabilitar botão durante animação
        const rollBtn = document.getElementById('rollBtn');
        rollBtn.disabled = true;
        rollBtn.textContent = '🎲 SORTEANDO...';

        // Animar sorteio
        if (window.uiManager) {
            window.uiManager.animateRoll(() => {
                const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];
                this.displayRolledItem(randomItem);
                
                // Reabilitar botão após 1.5 segundos
                setTimeout(() => {
                    rollBtn.disabled = false;
                    rollBtn.textContent = '🎲 SORTEAR ITEM';
                }, 1500);
            });
        }
    }

    displayRolledItem(item) {
        const resultDiv = document.getElementById('rollResult');
        const imageEl = document.getElementById('rolledItemImage');
        const nameEl = document.getElementById('rolledItemName');
        const typeEl = document.getElementById('rolledItemType');
        const rarityEl = document.getElementById('rolledItemRarity');
        const descriptionEl = document.getElementById('rolledItemDescription');
        const attributesEl = document.getElementById('rolledItemAttributes');

        // Preencher imagem
        imageEl.src = item.image || `https://picsum.photos/seed/rolled${item.id}/300/200.jpg`;
        imageEl.alt = item.name;
        imageEl.onerror = function() {
            this.src = `https://picsum.photos/seed/fallback${item.id}/300/200.jpg`;
        };

        // Preencher dados do item
        nameEl.textContent = item.name;
        typeEl.textContent = this.getTypeLabel(item.type);
        rarityEl.textContent = this.getRarityLabel(item.rarity);
        rarityEl.className = `item-rarity ${item.rarity}`;
        descriptionEl.textContent = item.description || '';
        attributesEl.innerHTML = this.renderAttributes(item.baseAttributes, item.customAttributes);

        // Garantir que todos os elementos estejam visíveis
        resultDiv.style.display = 'block';
        resultDiv.style.visibility = 'visible';
        resultDiv.style.opacity = '1';
        
        const itemCard = resultDiv.querySelector('.item-card');
        if (itemCard) {
            itemCard.style.display = 'block';
            itemCard.style.visibility = 'visible';
            itemCard.style.opacity = '1';
        }

        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    getEnabledTypes() {
        const types = [];
        if (document.getElementById('filterArma').checked) types.push('arma');
        if (document.getElementById('filterArmadura').checked) types.push('armadura');
        if (document.getElementById('filterConsumivel').checked) types.push('consumivel');
        if (document.getElementById('filterAcessorio').checked) types.push('acessorio');
        return types;
    }

    updateRollFilters() {
        const enabledTypes = this.getEnabledTypes();
        const rollBtn = document.getElementById('rollBtn');
        
        if (enabledTypes.length === 0) {
            rollBtn.disabled = true;
            rollBtn.textContent = 'Selecione pelo menos um tipo';
        } else {
            rollBtn.disabled = false;
            rollBtn.textContent = '🎲 SORTEAR ITEM';
        }
    }

    getTypeLabel(type) {
        const labels = {
            arma: '⚔️ Arma',
            armadura: '🛡️ Armadura',
            consumivel: '🧪 Consumível',
            acessorio: '💎 Acessório'
        };
        return labels[type] || type;
    }

    getRarityLabel(rarity) {
        const labels = {
            comum: 'Comum',
            incomum: 'Incomum',
            raro: 'Raro',
            épico: 'Épico',
            lendário: 'Lendário'
        };
        return labels[rarity] || rarity;
    }

    resetForm() {
        document.getElementById('itemForm').reset();
        document.getElementById('baseAttributes').innerHTML = '';
        document.getElementById('customAttributes').innerHTML = '';
        document.querySelector('#itemForm button[type="submit"]').textContent = 'Salvar Item';
        
        this.currentEditId = null;
        this.customAttributeCount = 0;
        this.baseAttributeCount = 0;
    }

    cancelEdit() {
        this.resetForm();
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        // Criar elemento de mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            ${type === 'error' ? 'background: #e74c3c;' : 'background: #27ae60;'}
        `;

        document.body.appendChild(messageDiv);

        // Remover após 3 segundos
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }

    exportItems() {
        try {
            // Obter itens do localStorage
            const items = this.items;
            
            // Criar objeto de exportação com metadados
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                itemCount: items.length,
                items: items
            };
            
            // Converter para JSON
            const jsonString = JSON.stringify(exportData, null, 2);
            
            // Criar blob e download
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            // Nome do arquivo com data
            const fileName = `rpg-items-${new Date().toISOString().split('T')[0]}.json`;
            
            link.href = url;
            link.download = fileName;
            link.click();
            
            // Limpar
            URL.revokeObjectURL(url);
            
            this.showSuccess(`${items.length} itens exportados com sucesso!`);
        } catch (error) {
            console.error('Erro ao exportar itens:', error);
            this.showError('Erro ao exportar itens!');
        }
    }

    importItems(file) {
        if (!file) {
            return;
        }
        
        if (file.type !== 'application/json') {
            this.showError('Por favor, selecione um arquivo JSON válido!');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                // Validar estrutura do arquivo
                if (!importData.items || !Array.isArray(importData.items)) {
                    this.showError('Arquivo JSON inválido! Estrutura não reconhecida.');
                    return;
                }
                
                // Validar cada item
                const validItems = importData.items.filter(item => {
                    return item.name && item.type && item.rarity;
                });
                
                if (validItems.length === 0) {
                    this.showError('Nenhum item válido encontrado no arquivo!');
                    return;
                }
                
                // Perguntar se quer substituir ou adicionar
                if (this.items.length > 0) {
                    if (confirm(`Deseja substituir os ${this.items.length} itens existentes pelos ${validItems.length} itens do arquivo?\n\nClique em "OK" para substituir ou "Cancelar" para adicionar.`)) {
                        // Substituir todos os itens
                        this.items = validItems;
                    } else {
                        // Adicionar itens novos (evitando duplicados pelo nome)
                        const existingNames = new Set(this.items.map(item => item.name.toLowerCase()));
                        const newItems = validItems.filter(item => !existingNames.has(item.name.toLowerCase()));
                        
                        if (newItems.length === 0) {
                            this.showError('Todos os itens do arquivo já existem!');
                            return;
                        }
                        
                        this.items = [...this.items, ...newItems];
                        this.showSuccess(`${newItems.length} novos itens adicionados!`);
                    }
                } else {
                    // Primeira importação
                    this.items = validItems;
                }
                
                // Salvar e atualizar
                this.saveItems();
                this.loadItems();
                
                // Limpar input de arquivo
                document.getElementById('importFile').value = '';
                
                const message = this.items.length > validItems.length 
                    ? `${validItems.length} itens importados com sucesso! (${this.items.length} itens totais)`
                    : `${validItems.length} itens importados com sucesso!`;
                    
                this.showSuccess(message);
                
            } catch (error) {
                console.error('Erro ao importar itens:', error);
                this.showError('Erro ao ler o arquivo JSON! Verifique se o arquivo está correto.');
            }
        };
        
        reader.onerror = () => {
            this.showError('Erro ao ler o arquivo!');
        };
        
        reader.readAsText(file);
    }
}

// Inicializar o gerenciador de itens
const itemManager = new ItemManager();
window.itemManager = itemManager;
