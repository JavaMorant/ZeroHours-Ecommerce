from flask import Flask, jsonify, request, session, url_for
from flask_bcrypt import Bcrypt
from models import Basket, db, User, Products
from config import ApplicationConfig
from flask_cors import CORS
from flask_session import Session
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
import os
from flask_migrate import Migrate
from flask import jsonify, request
from flask import send_from_directory, url_for

from flask_login import LoginManager, login_user, login_required, current_user, logout_user, login_manager


app = Flask(__name__)
app.config.from_object(ApplicationConfig())


# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Use your email provider's SMTP server
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'awanded75@gmail.com'  # Your email
app.config['MAIL_PASSWORD'] = 'rllv vpzm nonn uubg'
app.config['MAIL_DEFAULT_SENDER'] = 'awanded75@gmail.com'

# Initialize Flask-Mail
mail = Mail(app)
s = URLSafeTimedSerializer(app.config['SECRET_KEY'])

# Initialize Flask-Bcrypt
bcrypt = Bcrypt(app)
server_session = Session(app)
CORS(app, supports_credentials=True)

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
    # This function is used by Flask-Login to reload the user object from the user ID stored in the session
    return User.query.get(user_id) 

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
    # Handle user registration
    email = request.json["email"]
    password = request.json["password"]

    # Check if user already exists
    user_exists = User.query.filter_by(email=email).first() is not None
    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    # Create new user with hashed password
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password, email_verified=False)
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

@app.route("/logout", methods=["POST"])
@login_required
def logout():
    # Log out the current user
    logout_user()
    return jsonify({"message": "Successfully logged out"}), 200
    
# Log in the current user
@app.route("/login", methods=["POST"])
def login_user_route():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "User does not exist"}), 404

    if not user.email_verified:
        return jsonify({"error": "Email not verified. Please check your email for the verification link."}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect password"}), 401
    
    login_user(user)
    return jsonify({
        "id": user.id,
        "email": user.email,
        "isAuthenticated": True
    }), 200
    


# Helper function to get all image URLs from the assets/NAME/ folder
def get_hover_images(product_name):
    folder_path = os.path.join('../frontend/public/Assets/img/', product_name)
    if not os.path.exists(folder_path):
        print("none")
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
    print("Received request to /products") 
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
    
    print("Returning products:", product_list)
    return jsonify(product_list)

@app.route('/Assets/img/<product_name>/<filename>')
def serve_hover_image(product_name, filename):
    folder_path = os.path.join('Assets/img', product_name)
    return send_from_directory(folder_path, filename)


# Check if the user is currently logged in
@app.route("/check-login")
def check_login():
    return jsonify({"isLoggedIn": current_user.is_authenticated})

# Retrieve the current user's basket
@app.route("/api/get-basket")
@login_required
def get_basket():
    try:
        basket_items = Basket.query.filter_by(user_id=current_user.id).all()
        basket = []
        for item in basket_items:
            product = Products.query.get(item.product_id)
            if product:
                basket.append({
                    'id': product.id,
                    'name': product.name,
                    'price': float(product.price),
                    'quantity': item.quantity,
                    'photo': product.photo,
                    # Add other necessary product details
                })
        return jsonify({"basket": basket})
    except Exception as e:
        app.logger.error(f"Error in get_basket: {str(e)}")
        return jsonify({"error": "An error occurred while fetching the basket"}), 500
    
# Update the current user's basket
@app.route("/api/update-basket", methods=["POST"])
@login_required
def update_basket():
    try:
        new_basket = request.json.get("basket")
        
        # Clear existing basket
        Basket.query.filter_by(user_id=current_user.id).delete()
        
        # Add new items to basket
        for item in new_basket:
            basket_item = Basket(
                user_id=current_user.id,
                product_id=item['id'],
                quantity=item['quantity']
            )
            db.session.add(basket_item)
        
        db.session.commit()
        return jsonify({"message": "Basket updated successfully"})
    except Exception as e:
        app.logger.error(f"Error in update_basket: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "An error occurred while updating the basket"}), 500

@app.route("/api/add-to-basket", methods=["POST"])
@login_required
def add_to_basket():
    product_id = request.json.get("product_id")
    quantity = request.json.get("quantity", 1)
    
    existing_item = Basket.query.filter_by(user_id=current_user.id, product_id=product_id).first()
    
    if existing_item:
        existing_item.quantity += quantity
    else:
        new_item = Basket(user_id=current_user.id, product_id=product_id, quantity=quantity)
        db.session.add(new_item)
    
    db.session.commit()
    return jsonify({"message": "Item added to basket successfully"})

if __name__ == '__main__':
    app.run(debug=True)