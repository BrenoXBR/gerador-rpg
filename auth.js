class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isMaster = false;
        this.initializeEventListeners();
        this.checkExistingSession();
    }

    initializeEventListeners() {
        // Tabs de autenticação
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Links de alternância
        document.getElementById('switchToRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchTab('register');
        });

        document.getElementById('switchToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchTab('login');
        });

        // Formulários
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
    }

    switchTab(tab) {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const loginTab = document.querySelector('[data-tab="login"]');
        const registerTab = document.querySelector('[data-tab="register"]');
        const switchToRegister = document.getElementById('switchToRegister');
        const switchToLogin = document.getElementById('switchToLogin');

        if (tab === 'login') {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            switchToRegister.style.display = 'block';
            switchToLogin.style.display = 'none';
        } else {
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
            loginTab.classList.remove('active');
            registerTab.classList.add('active');
            switchToRegister.style.display = 'none';
            switchToLogin.style.display = 'block';
        }
    }

    handleLogin() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const userType = document.querySelector('input[name="userType"]:checked').value;

        const users = this.getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            this.currentUser = user;
            this.isMaster = (userType === 'mestre');
            this.saveSession();
            this.showMainScreen();
        } else {
            this.showError('Usuário ou senha incorretos!');
        }
    }

    handleRegister() {
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            this.showError('As senhas não coincidem!');
            return;
        }

        const users = this.getUsers();
        if (users.find(u => u.username === username)) {
            this.showError('Usuário já existe!');
            return;
        }

        const newUser = {
            id: Date.now(),
            username,
            password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);

        this.showSuccess('Cadastro realizado com sucesso!');
        this.switchTab('login');
        
        // Limpar formulário
        document.getElementById('registerForm').reset();
    }

    getUsers() {
        const users = localStorage.getItem('rpgUsers');
        return users ? JSON.parse(users) : [];
    }

    saveUsers(users) {
        localStorage.setItem('rpgUsers', JSON.stringify(users));
    }

    saveSession() {
        const session = {
            user: this.currentUser,
            isMaster: this.isMaster,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('rpgSession', JSON.stringify(session));
    }

    checkExistingSession() {
        const session = localStorage.getItem('rpgSession');
        if (session) {
            const sessionData = JSON.parse(session);
            this.currentUser = sessionData.user;
            this.isMaster = sessionData.isMaster;
            this.showMainScreen();
        }
    }

    logout() {
        localStorage.removeItem('rpgSession');
        this.currentUser = null;
        this.isMaster = false;
        this.showLoginScreen();
    }

    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'block';
        document.getElementById('mainScreen').style.display = 'none';
        document.getElementById('loginForm').reset();
    }

    showMainScreen() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'block';
        document.getElementById('currentUser').textContent = 
            `${this.currentUser.username} (${this.isMaster ? 'Mestre' : 'Jogador'})`;

        // Mostrar/ocultar painéis baseado no tipo de usuário
        const editPanel = document.getElementById('editPanel');
        const itemsList = document.getElementById('itemsList');

        if (this.isMaster) {
            editPanel.style.display = 'block';
            itemsList.style.display = 'block';
        } else {
            editPanel.style.display = 'none';
            itemsList.style.display = 'none';
        }

        // Carregar itens se for mestre
        if (this.isMaster && window.itemManager) {
            window.itemManager.loadItems();
        }
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
}

// Inicializar o gerenciador de autenticação
const authManager = new AuthManager();
window.authManager = authManager;