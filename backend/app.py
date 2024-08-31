from flask import Flask, jsonify, request, url_for, send_from_directory
from models import db, Products, Order, OrderItem
from config import ApplicationConfig
from flask_cors import CORS
import os
from flask_migrate import Migrate
import stripe

app = Flask(__name__)
app.config.from_object(ApplicationConfig())

# Configure CORS
CORS(app, resources={r"/*": {
    "origins": [
        "http://localhost:3000", 
        "https://master--stunning-sopapillas-f808db.netlify.app",
        "https://0hrs.co.uk"
    ],
    "allow_headers": ["Content-Type", "Authorization"],
    "methods": ["GET", "POST", "OPTIONS"]
}}, supports_credentials=True)

stripe.api_key = 'sk_test_51PpWYO2Lpl1R0iboAGzFAsq0DOYkjPpk6tH85n84fLrYpCDYrA3gcWVTsyWjWj0uGGT71l4ShgH6LOk4RB2SJQ3j002hYGjCIl'

# Initialize Flask-SQLAlchemy
db.init_app(app)
with app.app_context():
    db.create_all()

# Initialize Flask-Migrate
migrate = Migrate(app, db)

DOMAIN_NAME = "http://localhost:3000"

# Handle preflight OPTIONS requests
@app.route('/products', methods=['OPTIONS'])
def options():
    response = jsonify()
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

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
    
@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    print("wid")
    try:
        print("wod")
        data = request.json
        line_items = [{
            'price_data': {
                'currency': 'gbp',
                'product_data': {
                    'name': item['name'],
                },
                'unit_amount': int(float(item['price']) * 100),  # Stripe expects amount in cents
            },
            'quantity': item['quantity'],
        } for item in data['items']]

        checkout_session = stripe.checkout.Session.create(
            line_items=line_items,
            mode='payment',
            success_url= DOMAIN_NAME + '/checkout?success=true',
            cancel_url= DOMAIN_NAME + '/checkout?canceled=true',
            automatic_tax={'enabled': True},
        )
    except Exception as e:
        return jsonify(error=str(e)), 400
    
    return jsonify(id=checkout_session.id)

@app.route('/webhook', methods=['POST'])
def webhook():
    event = None
    payload = request.data
    sig_header = request.headers['STRIPE_SIGNATURE']

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, 'your_webhook_secret'
        )
    except ValueError as e:
        # Invalid payload
        return 'Invalid payload', 400
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return 'Invalid signature', 400

    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Create a new order
        new_order = Order(
            total_amount=session.amount_total / 100,  # Convert cents to dollars
            status='paid',
            customer_email=session.customer_details.email
        )
        db.session.add(new_order)
        
        # Add order items (you'll need to modify this based on your needs)
        for item in session.line_items.data:
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item.price.product,  # You might need to adjust this
                quantity=item.quantity,
                price=item.amount_total / 100,  # Convert cents to dollars
                size='N/A'  # You'll need to figure out how to handle size
            )
            db.session.add(order_item)
        
        db.session.commit()

    return 'Success', 200

if __name__ == '__main__':
    app.run(debug=True)

if __name__ == '__main__':
    app.run(debug=True)