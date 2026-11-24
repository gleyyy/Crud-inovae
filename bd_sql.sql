
-- =========================================
-- BANCO DE DADOS: LOCADORA DE ROUPAS
-- =========================================

CREATE DATABASE IF NOT EXISTS locadora_roupas
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE locadora_roupas;


-- =========================================
-- TABELA: USUARIOS
-- =========================================

CREATE TABLE usuarios (

    id_usuario INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(120) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    senha_hash VARCHAR(255) NOT NULL,

    telefone VARCHAR(20),

    tipo ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


-- =========================================
-- TABELA: CATEGORIAS
-- =========================================

CREATE TABLE categorias (

    id_categoria INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(80) NOT NULL UNIQUE,

    descricao VARCHAR(255)

);


-- =========================================
-- TABELA: PRODUTOS
-- =========================================

CREATE TABLE produtos (

    id_produto INT AUTO_INCREMENT PRIMARY KEY,

    id_categoria INT NOT NULL,

    nome VARCHAR(120) NOT NULL,

    descricao TEXT,

    tamanho VARCHAR(30),

    cor VARCHAR(50),

    valor_diaria DECIMAL(10,2) NOT NULL,

    quantidade_estoque INT NOT NULL DEFAULT 1,

    imagem_url VARCHAR(500),

    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria),

    CHECK (valor_diaria >= 0),

    CHECK (quantidade_estoque >= 0)

);


-- =========================================
-- TABELA: LOCACOES
-- =========================================

CREATE TABLE locacoes (

    id_locacao INT AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT NOT NULL,

    data_inicio DATE NOT NULL,

    data_fim DATE NOT NULL,

    status ENUM(
        'pendente',
        'confirmada',
        'em_andamento',
        'concluida',
        'cancelada'
    ) NOT NULL DEFAULT 'pendente',

    valor_total DECIMAL(10,2) NOT NULL DEFAULT 0,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario),

    CHECK (data_fim >= data_inicio),

    CHECK (valor_total >= 0)

);


-- =========================================
-- TABELA: ITENS_LOCACAO
-- =========================================

CREATE TABLE itens_locacao (

    id_item INT AUTO_INCREMENT PRIMARY KEY,

    id_locacao INT NOT NULL,

    id_produto INT NOT NULL,

    quantidade INT NOT NULL,

    valor_diaria DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (id_locacao)
        REFERENCES locacoes(id_locacao),

    FOREIGN KEY (id_produto)
        REFERENCES produtos(id_produto),

    CHECK (quantidade > 0),

    CHECK (valor_diaria >= 0)

);


-- =========================================
-- DADOS INICIAIS: CATEGORIAS
-- =========================================

INSERT INTO categorias (nome, descricao) VALUES

('Vestidos', 'Vestidos para diferentes ocasiões'),

('Roupas', 'Peças de vestuário em geral'),

('Acessórios', 'Bolsas, joias e outros acessórios');


-- =========================================
-- CONSULTAS DE CONFERÊNCIA
-- =========================================

SELECT * FROM usuarios;

SELECT * FROM categorias;

SELECT * FROM produtos;

SELECT * FROM locacoes;

SELECT * FROM itens_locacao;
