from flask import Flask, jsonify, request, url_for, send_from_directory
from models import db, Products, Order, OrderItem
from config import ApplicationConfig
from flask_cors import CORS
import os
from flask_migrate import Migrate
import stripe

app = Flask(__name__)
app.config.from_object(ApplicationConfig())

CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "allow_headers": ["Content-Type", "Authorization"], "methods": ["GET", "POST", "OPTIONS"]}}, supports_credentials=True)
stripe.api_key = 'sk_test_51PpWYO2Lpl1R0iboAGzFAsq0DOYkjPpk6tH85n84fLrYpCDYrA3gcWVTsyWjWj0uGGT71l4ShgH6LOk4RB2SJQ3j002hYGjCIl'

# Initialize Flask-SQLAlchemy
db.init_app(app)
with app.app_context():
    db.create_all()

# Initialize Flask-Migrate
migrate = Migrate(app, db)

def get_hover_images(product_name):
    folder_path = os.path.join('../frontend/public/Assets/img/', product_name)
    if not os.path.exists(folder_path):
        return []
    return [url_for('serve_hover_image', product_name=product_name, filename=img) for img in os.listdir(folder_path)]

def size_option(product):
    if product.type == 'sock':
        return {'One Size': product.scount}
    return {
        'S': product.scount,
        'M': product.mcount,
        'L': product.lcount,
        'XL': product.xlcount,
        'XXL': product.xxlcount,
    }

@app.route('/products', methods=['GET'])
def get_products():
    products = Products.query.all()
    product_list = [{
        'id': product.id,
        'type': product.type,
        'name': product.name,
        'price': product.price,
        'photo': product.photo,
        'hover_images': get_hover_images(product.hover_image),
        'sizes': size_option(product),
        'description': product.description
    } for product in products]
    
    return jsonify(product_list)

@app.route('/Assets/img/<product_name>/<filename>')
def serve_hover_image(product_name, filename):
    folder_path = os.path.join('Assets/img', product_name)
    return send_from_directory(folder_path, filename)

@app.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    try:
        data = request.json
        amount = data['amount']
        email = data.get('email')

        # Create a Customer object in Stripe
        customer = stripe.Customer.create(email=email)

        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd',
            customer=customer.id,
            receipt_email=email
        )

        return jsonify({
            'clientSecret': intent.client_secret
        })

    except Exception as e:
        return jsonify(error=str(e)), 403

@app.route('/payment-success', methods=['POST'])
def payment_success():
    try:
        data = request.json
        payment_intent_id = data['paymentIntentId']
        order_items = data['orderItems']  # This should be sent from the client
        
        # Retrieve the payment intent to verify the payment
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        if payment_intent.status == 'succeeded':
            # Create a new order
            new_order = Order(
                total_amount=payment_intent.amount / 100,  # Convert cents to dollars
                status='paid',
                customer_email=payment_intent.receipt_email
            )
            db.session.add(new_order)
            
            # Add order items
            for item in order_items:
                order_item = OrderItem(
                    order_id=new_order.id,
                    product_id=item['id'],
                    quantity=item['quantity'],
                    price=item['price'],
                    size=item['size']
                )
                db.session.add(order_item)
            
            db.session.commit()
            
            return jsonify({'success': True, 'orderId': new_order.id})
        else:
            return jsonify({'error': 'Payment not successful'}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True)