from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import groq

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
jwt = JWTManager(app)
CORS(app)

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/bug_tracker')
client = MongoClient(MONGO_URI)
db = client.bug_tracker

# Groq client
groq_api_key = os.getenv('GROQ_API_KEY')
groq_client = None
if groq_api_key and groq_api_key != 'test-key':
    try:
        groq_client = groq.Groq(api_key=groq_api_key)
    except Exception as e:
        print(f"Warning: Could not initialize Groq client: {e}")

# Helper function to serialize MongoDB documents
def serialize_doc(doc):
    if doc:
        doc['_id'] = str(doc['_id'])
        return doc
    return None

def serialize_docs(docs):
    return [serialize_doc(doc) for doc in docs]

# Authentication routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validation
        if not data.get('email') or not data.get('password') or not data.get('name'):
            return jsonify({'error': 'Email, password, and name are required'}), 400
        
        # Check if user already exists
        if db.users.find_one({'email': data['email']}):
            return jsonify({'error': 'User already exists'}), 400
        
        # Create user
        user_data = {
            'name': data['name'],
            'email': data['email'],
            'password': generate_password_hash(data['password']),
            'created_at': datetime.utcnow()
        }
        
        result = db.users.insert_one(user_data)
        
        # Create access token
        access_token = create_access_token(identity=str(result.inserted_id))
        
        return jsonify({
            'message': 'User created successfully',
            'access_token': access_token,
            'user': {
                'id': str(result.inserted_id),
                'name': data['name'],
                'email': data['email']
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        user = db.users.find_one({'email': data['email']})
        
        if not user or not check_password_hash(user['password'], data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(identity=str(user['_id']))
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Bug routes
@app.route('/api/bugs', methods=['GET'])
@jwt_required()
def get_bugs():
    try:
        # Get query parameters for filtering
        status = request.args.get('status')
        severity = request.args.get('severity')
        tags = request.args.get('tags')
        
        # Build query
        query = {}
        if status:
            query['status'] = status
        if severity:
            query['severity'] = severity
        if tags:
            tag_list = tags.split(',')
            query['tags'] = {'$in': tag_list}
        
        bugs = list(db.bugs.find(query).sort('created_at', -1))
        return jsonify(serialize_docs(bugs)), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bugs', methods=['POST'])
@jwt_required()
def create_bug():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        # Validation
        required_fields = ['title', 'description', 'severity']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Generate AI tags
        ai_tags = generate_ai_tags(data['title'], data['description'])
        
        bug_data = {
            'title': data['title'],
            'description': data['description'],
            'severity': data['severity'],
            'status': data.get('status', 'Open'),
            'assigned_to': data.get('assigned_to'),
            'tags': ai_tags,
            'created_by': user_id,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = db.bugs.insert_one(bug_data)
        bug_data['_id'] = str(result.inserted_id)
        
        return jsonify(serialize_doc(bug_data)), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bugs/<bug_id>', methods=['PUT'])
@jwt_required()
def update_bug(bug_id):
    try:
        data = request.get_json()
        
        # Build update data
        update_data = {
            'updated_at': datetime.utcnow()
        }
        
        allowed_fields = ['title', 'description', 'severity', 'status', 'assigned_to', 'tags']
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        result = db.bugs.update_one(
            {'_id': ObjectId(bug_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Bug not found'}), 404
        
        updated_bug = db.bugs.find_one({'_id': ObjectId(bug_id)})
        return jsonify(serialize_doc(updated_bug)), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bugs/<bug_id>', methods=['DELETE'])
@jwt_required()
def delete_bug(bug_id):
    try:
        result = db.bugs.delete_one({'_id': ObjectId(bug_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Bug not found'}), 404
        
        return jsonify({'message': 'Bug deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_ai_tags(title, description):
    """Generate tags using Groq AI"""
    if not groq_client:
        # Fallback to simple keyword-based tagging when Groq is not available
        return generate_fallback_tags(title, description)

    try:
        prompt = f"""Identify relevant tags for the following bug report. Return 3-5 tags only as a comma-separated list.
Bug Title: "{title}"
Description: "{description}"

Return only the tags, separated by commas. Examples of good tags: UI, Performance, API, Security, Mobile, Database, Authentication, Frontend, Backend, Critical, Enhancement"""

        response = groq_client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=100,
            temperature=0.3
        )

        tags_text = response.choices[0].message.content.strip()
        tags = [tag.strip() for tag in tags_text.split(',')]
        return tags[:5]  # Limit to 5 tags

    except Exception as e:
        print(f"Error generating AI tags: {e}")
        return generate_fallback_tags(title, description)

def generate_fallback_tags(title, description):
    """Generate tags using simple keyword matching when AI is not available"""
    text = (title + " " + description).lower()
    tags = []

    # Define keyword mappings
    keyword_mappings = {
        'UI': ['ui', 'interface', 'button', 'form', 'display', 'layout', 'design'],
        'Performance': ['slow', 'performance', 'speed', 'lag', 'timeout', 'loading'],
        'API': ['api', 'endpoint', 'request', 'response', 'server', 'backend'],
        'Database': ['database', 'db', 'query', 'data', 'sql', 'mongodb'],
        'Authentication': ['login', 'auth', 'password', 'user', 'session', 'token'],
        'Mobile': ['mobile', 'phone', 'android', 'ios', 'responsive'],
        'Security': ['security', 'vulnerability', 'xss', 'sql injection', 'csrf'],
        'Frontend': ['frontend', 'react', 'javascript', 'css', 'html'],
        'Backend': ['backend', 'server', 'python', 'flask', 'node'],
        'Critical': ['critical', 'crash', 'error', 'broken', 'fail']
    }

    for tag, keywords in keyword_mappings.items():
        if any(keyword in text for keyword in keywords):
            tags.append(tag)

    return tags[:5] if tags else ['General']

@app.route('/api/users', methods=['GET'])
@jwt_required()
def get_users():
    """Get all users for assignment dropdown"""
    try:
        users = list(db.users.find({}, {'password': 0}))  # Exclude password
        return jsonify(serialize_docs(users)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
