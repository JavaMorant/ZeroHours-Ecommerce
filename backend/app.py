from flask import Flask, jsonify, request, url_for, send_from_directory
from models import db, Products, Order, OrderItem
from config import ApplicationConfig
from flask_cors import CORS
import os
from flask_migrate import Migrate
import stripe
from flask_mail import Mail, Message

app = Flask(__name__)
app.config.from_object(ApplicationConfig())
app.config['MAIL_SERVER'] = 'smtp.office365.com'  # Correct SMTP server for Outlook
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = "zerohourbrand@outlook.com"
app.config['MAIL_PASSWORD'] = "Manpower419"
app.config['MAIL_DEFAULT_SENDER'] = "zerohourbrand@outlook.com"

mail = Mail(app)

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

stripe.api_key = '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'

# Initialize Flask-SQLAlchemy
db.init_app(app)
with app.app_context():
    db.create_all()

# Initialize Flask-Migrate
migrate = Migrate(app, db)

DOMAIN_NAME = "https://0hrs.co.uk"

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
    try:
        send_order__email()

        data = request.json

        # Create line items for products in the basket
        line_items = [{
            'price_data': {
                'currency': 'gbp',
                'product_data': {
                    'name': item['name'],
                    'metadata': {  # Include size in metadata
                    'size': item.get('size')  # Get the size from the client-side order
                }
                },
                'unit_amount': int(float(item['price']) * 100),  # Price in pence
            },
            'quantity': item['quantity'],
        } for item in data['items']]

        # Add shipping cost as a separate line item
        shipping_cost = data.get('shippingCost', 0)  # Ensure we get the shipping cost
        if shipping_cost > 0:
            line_items.append({
                'price_data': {
                    'currency': 'gbp',
                    'product_data': {
                        'name': 'Shipping',
                    },
                    'unit_amount': int(float(shipping_cost) * 100),  # Shipping cost in pence
                },
                'quantity': 1,
            })

        # Create the Stripe Checkout session
        checkout_session = stripe.checkout.Session.create(
            line_items=line_items,
            mode='payment',
            success_url= DOMAIN_NAME + '/checkout?success',
            cancel_url= DOMAIN_NAME + '/checkout?canceled',
            automatic_tax={'enabled': True},
            billing_address_collection='required',
            shipping_address_collection={'allowed_countries': ['GB']},
            customer_email=data.get('email'),  # Get the customer's email
        )

    except Exception as e:
        return jsonify(error=str(e)), 400
    
    return jsonify(id=checkout_session.id)
@app.route('/send-contact-email', methods=['POST'])
def send_contact_email():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not all([name, email, message]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Compose email
        msg = Message("New Contact Form Submission",
                      recipients=["awanded75@gmail.com"])
        msg.body = f"""
        New contact form submission:
        
        Name: {name}
        Email: {email}
        Message: {message}
        """

        # Send email
        mail.send(msg)

        return jsonify({'message': 'Message sent successfully!'}), 200
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return jsonify({'error': 'Failed to send message. Please try again.'}), 500

def send_order_email(order, session):
    try:
        msg = Message("Order Confirmation",
                      recipients=[session.customer_details.email])
        
        # Construct email body
        email_body = f"""
        Thank you for your order!

        Thank you for shopping with us!
        """

        msg.body = email_body
        mail.send(msg)
    except Exception as e:
        print(f"Error sending order confirmation email: {str(e)}")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, 'whsec_7e112aba4e1d13c8eacb596b11963b6cf307435a1ae1238759d2c12515213056'
        )
    except ValueError as e:
        return jsonify({'error': 'Invalid payload'}), 400
    except stripe.error.SignatureVerificationError as e:
        return jsonify({'error': 'Invalid signature'}), 400

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']

        session_with_items = stripe.checkout.Session.retrieve(
            session.id,
            expand=['line_items']
        )

        try:
            new_order = Order(
                total_amount=session.amount_total / 100,
                status='paid',
                customer_email=session.customer_details.email
            )
            db.session.add(new_order)
            db.session.flush()

            for item in session_with_items.line_items.data:
                product = stripe.Product.retrieve(item.price.product)
                size = product.metadata.get('size', 'N/A')

                # Retrieve the corresponding product from our database
                db_product = Products.query.filter_by(stripe_product_id=item.price.product).first()
                
                if db_product:
                    # Update inventory based on size
                    if size == 'S':
                        db_product.scount -= item.quantity
                    elif size == 'M':
                        db_product.mcount -= item.quantity
                    elif size == 'L':
                        db_product.lcount -= item.quantity
                    elif size == 'XL':
                        db_product.xlcount -= item.quantity
                    elif db_product.type == 'sock':
                        db_product.scount -= item.quantity  # Assuming scount is used for socks
                    
                    # Ensure counts don't go below zero
                    db_product.scount = max(db_product.scount, 0)
                    db_product.mcount = max(db_product.mcount, 0)
                    db_product.lcount = max(db_product.lcount, 0)
                    db_product.xlcount = max(db_product.xlcount, 0)

                order_item = OrderItem(
                    order_id=new_order.id,
                    product_id=db_product.id if db_product else None,
                    quantity=item.quantity,
                    price=item.amount_total / 100,
                    size=size
                )
                db.session.add(order_item)

            db.session.commit()
            print(f"Order created successfully: {new_order.id}")

            # Send order confirmation email
            send_order_confirmation_email(new_order, session_with_items)

        except Exception as e:
            db.session.rollback()
            print(f"Error processing order: {str(e)}")
            return jsonify({'error': 'Error processing order'}), 500

    return jsonify({'success': True}), 200

if __name__ == '__main__':
    app.run(debug=True)