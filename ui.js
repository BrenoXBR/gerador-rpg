class UIManager {
    constructor() {
        this.initializeModal();
        this.initializeAnimations();
        this.initializeDownload();
        this.initializeImport();
    }

    initializeModal() {
        // Modal de exclusão
        this.deleteModal = document.getElementById('deleteModal');
        this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        this.cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        
        this.cancelDeleteBtn.addEventListener('click', () => {
            this.hideDeleteModal();
        });

        // Fechar modal ao clicar fora
        this.deleteModal.addEventListener('click', (e) => {
            if (e.target === this.deleteModal) {
                this.hideDeleteModal();
            }
        });
    }

    initializeAnimations() {
        // Adicionar CSS para imagens dos itens
        const imageStyle = document.createElement('style');
        imageStyle.textContent = `
            .item-image {
                width: 100%;
                height: 200px;
                overflow: hidden;
                border-radius: 12px 12px 0 0;
                position: relative;
                background: linear-gradient(135deg, rgba(139, 69, 19, 0.3), rgba(74, 60, 40, 0.3));
            }
            
            .item-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 12px 12px 0 0;
                transition: transform 0.3s ease;
            }
            
            .item-image img:hover {
                transform: scale(1.05);
            }
            
            .item-card {
                border-radius: 12px;
                overflow: hidden;
            }
            
            .item-card.rolled .item-image {
                animation: glow 2s infinite;
            }
            
            /* Para cards no grid */
            .items-grid .item-card {
                position: relative;
            }
            
            .items-grid .item-image {
                height: 180px;
            }
            
            /* Para resultado do sorteio */
            .roll-result .item-card {
                max-width: 500px;
                margin: 0 auto;
            }
            
            .roll-result .item-image {
                height: 200px;
            }
        `;
        document.head.appendChild(imageStyle);

        // Adicionar CSS para animações
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            @keyframes rollAnimation {
                0% {
                    transform: rotateY(0deg) scale(1);
                }
                25% {
                    transform: rotateY(90deg) scale(1.1);
                }
                50% {
                    transform: rotateY(180deg) scale(1.2);
                }
                75% {
                    transform: rotateY(270deg) scale(1.1);
                }
                100% {
                    transform: rotateY(360deg) scale(1);
                }
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
                100% {
                    transform: scale(1);
                }
            }

            @keyframes glow {
                0% {
                    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
                }
                50% {
                    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6);
                }
                100% {
                    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
                }
            }

            .rolling {
                animation: rollAnimation 1.5s ease-in-out;
            }

            .fade-in {
                animation: fadeIn 0.5s ease-out;
            }

            .pulse {
                animation: pulse 2s infinite;
            }

            .glow {
                animation: glow 2s infinite;
            }

            .modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 999;
                animation: fadeIn 0.3s ease-out;
            }

            .modal-content {
                animation: fadeIn 0.3s ease-out;
            }

            .item-card.rolled {
                animation: fadeIn 0.5s ease-out, glow 2s infinite;
            }

            .roll-btn.rolling {
                animation: pulse 1.5s infinite;
                background: linear-gradient(45deg, #8b4513, #daa520);
            }
        `;
        document.head.appendChild(style);
    }

    initializeImport() {
        // Botão de importação do Mestre
        const btnImport = document.getElementById('btnImport');
        const importFile = document.getElementById('importFile');
        
        if (btnImport && importFile) {
            btnImport.addEventListener('click', () => {
                importFile.click();
            });
            
            importFile.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    window.itemManager.importarDados(e.target.files[0]);
                }
            });
        }
        
        // Botão de importação do Jogador
        const btnImportPlayer = document.getElementById('btnImportPlayer');
        const importFilePlayer = document.getElementById('importFilePlayer');
        
        if (btnImportPlayer && importFilePlayer) {
            btnImportPlayer.addEventListener('click', () => {
                importFilePlayer.click();
            });
            
            importFilePlayer.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    window.itemManager.importarDados(e.target.files[0]);
                }
            });
        }
    }

    initializeDownload() {
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadItemCard();
            });
        }
    }

    downloadItemCard() {
        const itemCard = document.getElementById('rolledItemCard');
        const itemName = document.getElementById('rolledItemName').textContent;
        
        if (!itemCard || !itemName) {
            this.showNotification('Nenhum item para download!', 'error');
            return;
        }

        // Mostrar loading
        const downloadBtn = document.getElementById('downloadBtn');
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = '📥 Gerando...';
        downloadBtn.disabled = true;

        // Configuração do html2canvas
        const options = {
            backgroundColor: null, // Fundo transparente
            scale: 2, // Qualidade alta
            logging: false,
            useCORS: true,
            allowTaint: true
        };

        html2canvas(itemCard, options).then(canvas => {
            // Converter para blob e download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                
                // Nome do arquivo sanitizado
                const fileName = itemName.toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .substring(0, 30) + '.png';
                
                link.href = url;
                link.download = fileName;
                link.click();
                
                // Limpar
                URL.revokeObjectURL(url);
                
                // Restaurar botão
                downloadBtn.textContent = originalText;
                downloadBtn.disabled = false;
                
                this.showNotification('Carta baixada com sucesso!', 'success');
            }, 'image/png');
        }).catch(error => {
            console.error('Erro ao gerar imagem:', error);
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
            this.showNotification('Erro ao baixar a carta!', 'error');
        });
    }

    showDeleteModal(onConfirm) {
        this.deleteModal.style.display = 'flex';
        
        // Remover listeners antigos
        const newConfirmBtn = this.confirmDeleteBtn.cloneNode(true);
        this.confirmDeleteBtn.parentNode.replaceChild(newConfirmBtn, this.confirmDeleteBtn);
        this.confirmDeleteBtn = newConfirmBtn;
        
        // Adicionar novo listener
        this.confirmDeleteBtn.addEventListener('click', () => {
            onConfirm();
            this.hideDeleteModal();
        });

        // Focar no botão de cancelar
        this.cancelDeleteBtn.focus();
    }

    hideDeleteModal() {
        this.deleteModal.style.display = 'none';
    }

    animateRoll(callback) {
        const rollBtn = document.getElementById('rollBtn');
        const resultDiv = document.getElementById('rollResult');
        const downloadBtn = document.getElementById('downloadBtn');
        
        // Adicionar classe de animação ao botão
        rollBtn.classList.add('rolling');
        
        // Esconder resultado anterior
        resultDiv.style.display = 'none';
        if (downloadBtn) {
            downloadBtn.style.display = 'none';
        }
        
        // Criar efeito visual de sorteio
        const rollEffect = document.createElement('div');
        rollEffect.className = 'roll-effect';
        rollEffect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4rem;
            z-index: 1000;
            animation: rollAnimation 1.5s ease-in-out;
        `;
        rollEffect.textContent = '🎲';
        document.body.appendChild(rollEffect);
        
        // Efeitos sonoros simulados (visual)
        setTimeout(() => {
            rollEffect.textContent = '🎰';
        }, 500);
        
        setTimeout(() => {
            rollEffect.textContent = '⭐';
        }, 1000);
        
        // Remover efeito e executar callback
        setTimeout(() => {
            document.body.removeChild(rollEffect);
            rollBtn.classList.remove('rolling');
            
            // Garantir que o resultado seja visível
            resultDiv.style.display = 'block';
            resultDiv.style.visibility = 'visible';
            resultDiv.style.opacity = '1';
            
            // Adicionar animação de entrada
            resultDiv.classList.add('fade-in');
            
            // Adicionar classe glow ao item sorteado
            const itemCard = resultDiv.querySelector('.item-card');
            if (itemCard) {
                itemCard.classList.add('rolled');
                // Garantir que todos os elementos internos estejam visíveis
                const internalElements = itemCard.querySelectorAll('*');
                internalElements.forEach(el => {
                    el.style.display = '';
                    el.style.visibility = 'visible';
                    el.style.opacity = '1';
                });
            }
            
            // Mostrar botão de download
            if (downloadBtn) {
                downloadBtn.style.display = 'block';
                downloadBtn.classList.add('fade-in');
            }
            
            // Remover classes após animação
            setTimeout(() => {
                resultDiv.classList.remove('fade-in');
                if (itemCard) {
                    itemCard.classList.remove('rolled');
                }
                if (downloadBtn) {
                    downloadBtn.classList.remove('fade-in');
                }
            }, 2000);
            
            if (callback) callback();
        }, 1500);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos inline para garantir que apareça
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1001;
            max-width: 300px;
            word-wrap: break-word;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            ${type === 'success' ? 'background: linear-gradient(135deg, #27ae60, #2ecc71);' : ''}
            ${type === 'error' ? 'background: linear-gradient(135deg, #e74c3c, #c0392b);' : ''}
            ${type === 'warning' ? 'background: linear-gradient(135deg, #f39c12, #e67e22);' : ''}
            ${type === 'info' ? 'background: linear-gradient(135deg, #3498db, #2980b9);' : ''}
        `;
        
        document.body.appendChild(notification);
        
        // Auto remover após 4 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    highlightElement(element, duration = 2000) {
        if (!element) return;
        
        element.classList.add('glow');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
            element.classList.remove('glow');
        }, duration);
    }

    createLoadingSpinner(container) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
            <div class="spinner"></div>
            <p>Carregando...</p>
        `;
        
        // Estilos do spinner
        spinner.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            color: #8b4513;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #8b4513;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        if (!document.querySelector('style[data-spinner]')) {
            style.setAttribute('data-spinner', 'true');
            document.head.appendChild(style);
        }
        
        if (container) {
            container.appendChild(spinner);
        }
        
        return spinner;
    }

    removeLoadingSpinner(spinner) {
        if (spinner && spinner.parentNode) {
            spinner.parentNode.removeChild(spinner);
        }
    }

    // Animação para formulários
    animateForm(form, type = 'fadeIn') {
        if (!form) return;
        
        form.style.opacity = '0';
        form.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            form.style.transition = 'all 0.3s ease-out';
            form.style.opacity = '1';
            form.style.transform = 'translateY(0)';
        }, 100);
    }

    // Efeito de digitação para textos
    typeWriter(element, text, speed = 50) {
        if (!element) return;
        
        element.textContent = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }

    // Criar confete para celebração
    createConfetti() {
        const colors = ['#8b4513', '#daa520', '#ff6b6b', '#4ecdc4', '#45b7d1'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.8 + 0.2};
                transform: rotate(${Math.random() * 360}deg);
                animation: fall ${Math.random() * 2 + 2}s linear;
                z-index: 1002;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 4000);
        }
        
        // Adicionar animação de queda
        if (!document.querySelector('style[data-confetti]')) {
            const style = document.createElement('style');
            style.setAttribute('data-confetti', 'true');
            style.textContent = `
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Inicializar o gerenciador de UI
const uiManager = new UIManager();
window.uiManager = uiManager;
