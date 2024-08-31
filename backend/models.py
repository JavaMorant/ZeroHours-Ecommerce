from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from sqlalchemy import func
from datetime import datetime

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

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

    order_items = db.relationship('OrderItem', back_populates='product')

    def __repr__(self):
        return f'<Product {self.name}>'

class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    order_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')
    customer_email = db.Column(db.String(345), nullable=False)
    
    items = db.relationship('OrderItem', back_populates='order')

    def __repr__(self):
        return f'<Order {self.id}: {self.status}>'

class OrderItem(db.Model):
    __tablename__ = "order_items"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    order_id = db.Column(db.String(32), db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.String(32), db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    size = db.Column(db.String(5), nullable=False)  # 'S', 'M', 'L', 'XL', 'XXL'
    price = db.Column(db.Numeric(10, 2), nullable=False)
    
    order = db.relationship('Order', back_populates='items')
    product = db.relationship('Products', back_populates='order_items')

    def __repr__(self):
        return f'<OrderItem {self.id}: {self.product_id}, Size: {self.size}, Quantity: {self.quantity}>'