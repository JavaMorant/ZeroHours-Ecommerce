from datetime import timedelta
from flask import Flask, jsonify, make_response, request, session, url_for, send_from_directory
from flask_bcrypt import Bcrypt
from models import Basket, Order, OrderItem, db, User, Products
from config import ApplicationConfig
from flask_cors import CORS
from flask_session import Session
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import stripe
from flask_login import LoginManager, login_user, login_required, current_user, logout_user


app = Flask(__name__)
app.config.from_object(ApplicationConfig())

CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "allow_headers": ["Content-Type", "Authorization"], "methods": ["GET", "POST", "OPTIONS"]}}, supports_credentials=True)
stripe.api_key = 'sk_test_51PpWYO2Lpl1R0iboAGzFAsq0DOYkjPpk6tH85n84fLrYpCDYrA3gcWVTsyWjWj0uGGT71l4ShgH6LOk4RB2SJQ3j002hYGjCIl'



# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Use your email provider's SMTP server
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'awanded75@gmail.com'  # Your email
app.config['MAIL_PASSWORD'] = 'rllv vpzm nonn uubg'
app.config['MAIL_DEFAULT_SENDER'] = 'awanded75@gmail.com'

app.config['REMEMBER_COOKIE_DURATION'] = timedelta(days=14)  # Set remember me cookie duration
app.config['REMEMBER_COOKIE_SECURE'] = True  # Use secure cookies in production
app.config['REMEMBER_COOKIE_HTTPONLY'] = True  # Prevent cookie access through JavaScript

# Initialize Flask-Mail
mail = Mail(app)
s = URLSafeTimedSerializer(app.config['SECRET_KEY'])

# Initialize Flask-Bcrypt
bcrypt = Bcrypt(app)
server_session = Session(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)

# Initialize Flask-SQLAlchemy
db.init_app(app)
with app.app_context():
    db.create_all()

# Initialize Flask-Migrate
migrate = Migrate(app, db) 

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def send_verification_email(email):
    # Generate a secure token for email verification
    token = s.dumps(email, salt='email-verify')
    # Create and send an email with a verification link
    msg = Message('Confirm Your Email', recipients=[email])
    link = url_for('verify_email', token=token, _external=True)
    msg.body = f'Your link is {link}'
    mail.send(msg)

@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None
    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    new_user = User(email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    # Send verification email
    send_verification_email(email)

    return jsonify({
        "message": "User registered successfully. Please check your email to verify your account.",
        "id": new_user.id,
        "email": new_user.email
    }), 201

@app.route('/verify-email/<token>')
def verify_email(token):
    # Verify email using the token from the verification link
    try:
        email = s.loads(token, salt='email-verify', max_age=3600)  # 1 hour expiration
    except SignatureExpired:
        return jsonify({"error": "The verification link has expired"}), 400
    
    # Verifies user does not exist
    user = User.query.filter_by(email=email).first()
    if user:
        user.email_verified = True
        db.session.commit()
        return jsonify({"message": "Email verified successfully"}), 200
    else:
        return jsonify({"error": "User not found"}), 404

# Update your logout route
@app.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    response = make_response(jsonify({"message": "Successfully logged out"}))
    response.delete_cookie('remember_token')  # Clear the remember_token cookie
    return response, 200

# Add an error handler for unauthorized access
@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"error": "Unauthorized access"}), 401

# Update your login route
@app.route("/login", methods=["POST"])
def login_user_route():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user and user.verify_password(password):
        login_user(user, remember=True)
        return jsonify({
            "id": user.id,
            "email": user.email,
            "isAuthenticated": True
        }), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route("/check-login")
def check_login():
    if current_user.is_authenticated:
        return jsonify({"is_authenticated": True, "user_id": current_user.id}), 200
    else:
        return jsonify({"is_authenticated": False}), 200

@app.route("/get-basket", methods=['GET'])
@login_required
def get_basket():
    try:
        basket_items = Basket.query.filter_by(user_id=current_user.id).all()
        basket = []

        for item in basket_items:
            product = item.product
            basket.append({
                'id': product.id,
                'name': product.name,
                'price': float(product.price),
                'quantity': item.quantity,
                'size': item.size,
                'photo': product.photo,
            })
        return jsonify({"basket": basket})
    except Exception as e:
        print(e)   
        return jsonify({"error": "An error occurred while fetching the basket"}), 500

@app.route("/update-basket", methods=["POST", "OPTIONS"])
@login_required
def update_basket():
    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200

    try:
        new_basket = request.json.get("basket")

        Basket.query.filter_by(user_id=current_user.id).delete()
        for item in new_basket:
            basket_item = Basket(
                user_id=current_user.id,
                product_id=item['id'],
                quantity=item['quantity'],
                size=item['size']
            )
            db.session.add(basket_item)
        db.session.commit()

        return jsonify({"message": "Basket updated successfully"})
    except Exception as e:
        app.logger.error(f"Error in update_basket: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "An error occurred while updating the basket"}), 500
    
@app.route("/products", methods=["GET"])
def get_products():
    products = Products.query.all()
    products_data = [{
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': float(product.price),
        'photo': product.photo,
        'type': product.type,
        'sizes': {
            'S': product.scount,
            'M': product.mcount,
            'L': product.lcount,
            'XL': product.xlcount,
            'XXL': product.xxlcount
        }
    } for product in products]
    return jsonify({"products": products_data}), 200



# New route for creating a payment intent
@app.route('/create-payment-intent', methods=['POST'])
@login_required
def create_payment_intent():
    try:
        data = request.json
        amount = data['amount']

        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd'
        )

        return jsonify({
            'clientSecret': intent.client_secret
        })

    except Exception as e:
        return jsonify(error=str(e)), 403

# New route for handling successful payments
@app.route('/payment-success', methods=['POST'])
@login_required
def payment_success():
    try:
        data = request.json
        payment_intent_id = data['paymentIntentId']
        
        # Retrieve the payment intent to verify the payment
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        if payment_intent.status == 'succeeded':
            # Create a new order
            new_order = Order(
                user_id=current_user.id,
                total_amount=payment_intent.amount / 100,  # Convert cents to dollars
                status='paid'
            )
            db.session.add(new_order)
            
            # Add order items
            basket = current_user.basket
            for item in basket:
                order_item = OrderItem(
                    order_id=new_order.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price=item.product.price
                )
                db.session.add(order_item)
            
            # Clear the user's basket
            current_user.basket.clear()
            
            db.session.commit()
            
            return jsonify({'success': True, 'orderId': new_order.id})
        else:
            return jsonify({'error': 'Payment not successful'}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify(error=str(e)), 500

# Update the get_basket route to include product details


if __name__ == '__main__':
    app.run(debug=True)