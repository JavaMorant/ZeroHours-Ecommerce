from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from flask_login import UserMixin
from sqlalchemy import func
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model, UserMixin):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(345), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    email_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    last_online = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    basket_items = relationship('Basket', back_populates='user')
    orders = relationship('Order', back_populates='user')

    def __repr__(self):
        return f'<User {self.email}>'
    def get_id(self):
        return str(self.id)

class Products(db.Model):
    __tablename__ = "products"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(345), nullable=False)
    type = db.Column(db.String(30))
    price = db.Column(db.Numeric(10,2), nullable=False)
    scount = db.Column(db.Integer(), nullable=False)
    mcount = db.Column(db.Integer(), nullable=False)
    lcount = db.Column(db.Integer(), nullable=False)
    xlcount = db.Column(db.Integer(), nullable=False)
    xxlcount = db.Column(db.Integer(), nullable=False)
    description = db.Column(db.String(1000), nullable=False)
    photo = db.Column(db.String(345), nullable=False)
    hover_image = db.Column(db.String(345), nullable=False)

    order_items = relationship('OrderItem', back_populates='product')
    basket_items = relationship('Basket', back_populates='product')

    def __repr__(self):
        return f'<Product {self.name}>'

class Basket(db.Model):
    __tablename__ = 'baskets'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(32), ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.String(32), ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    size = db.Column(db.String(5), nullable=False)  # 'S', 'M', 'L', 'XL', 'XXL'
    
    user = relationship('User', back_populates='basket_items')
    product = relationship('Products', back_populates='basket_items')

    def __repr__(self):
        return f'<Basket Item: {self.product_id}, Size: {self.size}, Quantity: {self.quantity}>'

class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    user_id = db.Column(db.String(32), ForeignKey('users.id'), nullable=False)
    order_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')
    
    user = relationship('User', back_populates='orders')
    items = relationship('OrderItem', back_populates='order')

    def __repr__(self):
        return f'<Order {self.id}: {self.status}>'

class OrderItem(db.Model):
    __tablename__ = "order_items"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    order_id = db.Column(db.String(32), ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.String(32), ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    size = db.Column(db.String(5), nullable=False)  # 'S', 'M', 'L', 'XL', 'XXL'
    price = db.Column(db.Numeric(10, 2), nullable=False)
    
    order = relationship('Order', back_populates='items')
    product = relationship('Products', back_populates='order_items')

    def __repr__(self):
        return f'<OrderItem {self.id}: {self.product_id}, Size: {self.size}, Quantity: {self.quantity}>'
    
    