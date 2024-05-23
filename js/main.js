// Função para armazenar dados no sessionStorage
function saveToSessionStorage(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

// Função para recuperar dados do sessionStorage
function loadFromSessionStorage(key) {
    return JSON.parse(sessionStorage.getItem(key));
}

// Função para remover dados do sessionStorage
function removeFromSessionStorage(key) {
    sessionStorage.removeItem(key);
}

function voltar() {
    window.history.back();
}

function irParaCarrinho() {
    window.location.href = 'carrinho.html';
}

function atualizarIconeCarrinho() {
    let carrinho = loadFromSessionStorage('carrinho') || [];
    document.getElementById('carrinho-count').innerText = carrinho.length;
}

function selecionarHamburguer(id) {
    let hamburgueres = [
        { id: 1, nome: "Hamburguer Clássico", preco: 25.00 },
        { id: 2, nome: "Hamburguer Vegetariano", preco: 20.00 },
        { id: 3, nome: "Hamburguer de Frango", preco: 22.00 }
        // Adicione mais hambúrgueres conforme necessário
    ];

    let hamburguerSelecionado = hamburgueres.find(hamburguer => hamburguer.id === id);

    if (hamburguerSelecionado) {
        window.location.href = `hamburguer${id}.html`;
    } else {
        alert("Hamburguer não encontrado!");
    }
}

function adicionarAoCarrinho() {
    let adicionais = [];
    document.querySelectorAll('#adicionais input[type="checkbox"]:checked').forEach((checkbox) => {
        adicionais.push({
            nome: checkbox.value,
            preco: parseFloat(checkbox.parentElement.textContent.match(/\(([^)]+)\)/)[1].replace('R$ ', '').replace(',', '.'))
        });
    });

    let hamburguer = {
        nome: document.getElementById('hamburguer-title').innerText,
        preco: parseFloat(document.getElementById('hamburguer-price').innerText.replace('R$ ', '').replace(',', '.')),
        adicionais: adicionais,
        observacoes: document.getElementById('observacoes').value // Adicionando observações do textarea
    };

    let carrinho = loadFromSessionStorage('carrinho') || [];
    carrinho.push(hamburguer);
    saveToSessionStorage('carrinho', carrinho);

    document.getElementById('notificacao').style.display = 'block';
    setTimeout(() => {
        document.getElementById('notificacao').style.display = 'none';
        window.location.href = 'index.html';
    }, 1000);
}

function irParaCarrinhoComprar() {
    let adicionais = [];
    document.querySelectorAll('#adicionais input[type="checkbox"]:checked').forEach((checkbox) => {
        adicionais.push({
            nome: checkbox.value,
            preco: parseFloat(checkbox.parentElement.textContent.match(/\(([^)]+)\)/)[1].replace('R$ ', '').replace(',', '.'))
        });
    });

    let hamburguer = {
        nome: document.getElementById('hamburguer-title').innerText,
        preco: parseFloat(document.getElementById('hamburguer-price').innerText.replace('R$ ', '').replace(',', '.')),
        adicionais: adicionais,
        observacoes: document.getElementById('observacoes').value // Adicionando observações do textarea
    };

    let carrinho = loadFromSessionStorage('carrinho') || [];
    carrinho.push(hamburguer);
    saveToSessionStorage('carrinho', carrinho);

    document.getElementById('notificacao').style.display = 'block';
    setTimeout(() => {
        document.getElementById('notificacao').style.display = 'none';
        window.location.href = 'carrinho.html';
    }, 1000);

}



function carregarCarrinho() {
    let carrinho = loadFromSessionStorage('carrinho') || [];
    let carrinhoDiv = document.getElementById('carrinho');
    carrinhoDiv.innerHTML = '';

    let total = 0;
    carrinho.forEach((item, index) => {
        let adicionaisTexto = item.adicionais.length ? `Adicionais: ${item.adicionais.map(a => `${a.nome} (R$ ${a.preco.toFixed(2)})`).join(', ')}` : 'Sem adicionais';
        let adicionaisPreco = item.adicionais.reduce((sum, a) => sum + a.preco, 0);
        let itemTotal = item.preco + adicionaisPreco;

        total += itemTotal;

        carrinhoDiv.innerHTML += `
            <div class="carrinho-item">
                <p>${item.nome}: R$ ${item.preco.toFixed(2)}</p>
                <p>${adicionaisTexto}</p>
                <p>Observações: ${item.observacoes}</p> <!-- Adicionando observações aqui -->
                <p>Subtotal: R$ ${itemTotal.toFixed(2)}</p>
                <button onclick="removerDoCarrinho(${index})">Remover</button>
            </div>
        `;
    });

    carrinhoDiv.innerHTML += `<p>Total: R$ ${total.toFixed(2)}</p>`;
}

function removerDoCarrinho(index) {
    let carrinho = loadFromSessionStorage('carrinho') || [];
    carrinho.splice(index, 1);
    saveToSessionStorage('carrinho', carrinho);
    carregarCarrinho();
    atualizarIconeCarrinho();
}

function confirmarPedido() {
    window.location.href = 'informacoes_cliente.html';
}

function selecionarPagamento() {
    let nome = document.getElementById('nome').value;
    let endereco = document.getElementById('endereco').value;

    saveToSessionStorage('cliente', { nome, endereco });
    window.location.href = 'pagamento.html';
}

document.querySelectorAll('input[name="pagamento"]').forEach((elem) => {
    elem.addEventListener("change", function(event) {
        var value = event.target.value;
        if (value === "dinheiro") {
            document.getElementById("troco").style.display = "block";
        } else {
            document.getElementById("troco").style.display = "none";
        }
    });
});

function confirmarPagamento() {
    let pagamento = document.querySelector('input[name="pagamento"]:checked').value;
    let trocoPara = document.getElementById('troco-para').value || null;

    saveToSessionStorage('pagamento', { pagamento, trocoPara });
    window.location.href = 'confirmacao_pedido.html';
}

function carregarConfirmacaoPedido() {
    let carrinho = loadFromSessionStorage('carrinho');
    let cliente = loadFromSessionStorage('cliente');
    let pagamento = loadFromSessionStorage('pagamento');

    let resumoPedidoDiv = document.getElementById('resumo-pedido');
    resumoPedidoDiv.innerHTML = '';

    let total = 0;
    carrinho.forEach((item) => {
        let adicionaisTexto = item.adicionais.length ? `Adicionais: ${item.adicionais.map(a => `${a.nome} (R$ ${a.preco.toFixed(2)})`).join(', ')}` : 'Sem adicionais';
        let adicionaisPreco = item.adicionais.reduce((sum, a) => sum + a.preco, 0);
        let itemTotal = item.preco + adicionaisPreco;

        total += itemTotal;

        resumoPedidoDiv.innerHTML += `
            <div class="resumo-item">
                <p>${item.nome}: R$ ${item.preco.toFixed(2)}</p>
                <p>${adicionaisTexto}</p>
                <p>Observações: ${item.observacoes}</p> <!-- Adicionando observações aqui -->
                <p>Subtotal: R$ ${itemTotal.toFixed(2)}</p>
            </div>
        `;
    });

    resumoPedidoDiv.innerHTML += `
        <p>Total: R$ ${total.toFixed(2)}</p>
        <p>Nome: ${cliente.nome}</p>
        <p>Endereço: ${cliente.endereco}</p>
        <p>Pagamento: ${pagamento.pagamento} ${pagamento.pagamento === 'dinheiro' ? `(Troco para R$ ${pagamento.trocoPara})` : ''}</p>
    `;
}

function enviarPedido() {
    let carrinho = loadFromSessionStorage('carrinho');
    let cliente = loadFromSessionStorage('cliente');
    let pagamento = loadFromSessionStorage('pagamento');

    let adicionaisTexto = carrinho.map(item => item.adicionais.length ? `Adicionais: ${item.adicionais.map(a => `${a.nome} (R$ ${a.preco.toFixed(2)})`).join(', ')}` : 'Sem adicionais').join('\n');

    let total = carrinho.reduce((sum, item) => {
        let adicionaisPreco = item.adicionais.reduce((sum, a) => sum + a.preco, 0);
        return sum + item.preco + adicionaisPreco;
    }, 0);

    let observacoes = carrinho.map(item => item.observacoes ? `- Observações (${item.nome}): ${item.observacoes}` : '').join('\n');

    let mensagem = `
        Pedido:
        ${carrinho.map(item => `- ${item.nome}: R$ ${item.preco.toFixed(2)}\n${item.adicionais.length ? `Adicionais: ${item.adicionais.map(a => `${a.nome} (R$ ${a.preco.toFixed(2)})`).join(', ')}` : 'Sem adicionais'}`).join('\n')}
        
        - Total: R$ ${total.toFixed(2)}

        Cliente:
        - Nome: ${cliente.nome}
        - Endereço: ${cliente.endereco}

        Pagamento:
        - ${pagamento.pagamento}
        ${pagamento.pagamento === 'dinheiro' ? `- Troco para: R$ ${pagamento.trocoPara}` : ''}
        ${observacoes}
    `;

    let telefone = "5571987699693"; // Substitua pelo número de telefone da hamburgueria
    let url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.location.href = url;
}
