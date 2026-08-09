CREATE DATABASE hamburgueria; /*criando o database da Hamburqueria*/

USE hamburgueria; /*acessando a database criada*/

/* criando a tabela user*/
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'ATENDENTE', 'COZINHA') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

/* criando a tabela products, Não use FLOAT nem DOUBLE para dinheiro.
DECIMAL evita erro de arredondamento*/
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

/* criando a tabela product_options Se o produto for removido, os adicionais dele também são.  */
CREATE TABLE product_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    additional_price DECIMAL(10,2) NOT NULL,
    
    CONSTRAINT fk_product_options_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

/* criando a tabela orders, Status controlado evita bugs e confusão no sistema.  */
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    status ENUM(
        'CRIADO',
        'PAGO',
        'EM_PREPARO',
        'PRONTO',
        'ENTREGUE',
        'CANCELADO'
    ) NOT NULL DEFAULT 'CRIADO',
    total DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
) ENGINE=InnoDB;

/* criando a tabela order_items, Repare: O preço fica salvo aqui para manter histórico correto.
  */
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
) ENGINE=InnoDB;

/* criando a tabela pagamentos(payments) */
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    method ENUM('PIX', 'CARTAO', 'DINHEIRO') NOT NULL,
    status ENUM('PENDENTE', 'PAGO', 'CANCELADO') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paid_at DATETIME,

    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
) ENGINE=InnoDB;

/* criando a tabela ingredients  */
CREATE TABLE ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    unit ENUM('KG', 'G', 'UNIDADE') NOT NULL
) ENGINE=InnoDB;

/* criando a tabela Estoque(stock)   */
CREATE TABLE stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    minimum_quantity DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_stock_ingredient
        FOREIGN KEY (ingredient_id)
        REFERENCES ingredients(id)
) ENGINE=InnoDB;

/* comando para verificar as tabelas criadas */
SHOW TABLES;

/* verificar se o usuário foi salvo no banco, acessando tabela */
SELECT * FROM users;

use hamburgueria;

SELECT id, email, password FROM users;

show tables;
SELECT * FROM products;


ALTER TABLE product_options
ADD COLUMN active BOOLEAN DEFAULT TRUE;

DESCRIBE product_options;


CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  status ENUM('CRIADO','EM_PREPARO','PRONTO','ENTREGUE','CANCELADO') DEFAULT 'CRIADO',
  total DECIMAL(10,2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,

  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id)
);


CREATE TABLE order_item_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderItemId INT NOT NULL,
  productOptionId INT NOT NULL,
  additional_price DECIMAL(10,2) NOT NULL,

  FOREIGN KEY (orderItemId) REFERENCES order_items(id) ON DELETE CASCADE,
  FOREIGN KEY (productOptionId) REFERENCES product_options(id)
);




ALTER TABLE product_options
CHANGE product_id productId INT NOT NULL;

SELECT * FROM orders;

SELECT * FROM products;

SELECT * FROM order_items;

use hamburgueria;

INSERT INTO orders (user_id, status, total)
VALUES (2, 'CRIADO', 0);

SELECT id, name FROM users;


CREATE TABLE order_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  prepared_minutes INT NOT NULL,
  was_late BOOLEAN NOT NULL,
  closed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


SELECT * FROM order_history ORDER BY closed_at DESC;

DESCRIBE products;


ALTER TABLE products
ADD image_url VARCHAR(255) NULL;

SELECT id, name FROM products ORDER BY id;





