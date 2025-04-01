import sqlite3
import datetime
import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS


app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", os.urandom(24))



def get_db_connection():
    conn = sqlite3.connect('library.db')
    conn.execute("PRAGMA foreign_keys = ON")  # Enforce foreign key constraints
    conn.row_factory = sqlite3.Row  # lets us use column names
    return conn

# ---------------------- REGISTER PATRON & AUTO LOGIN ----------------------
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    contact = data.get('contact')
    email = data.get('email')
    membership_date = datetime.date.today().isoformat()

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Patron WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'A patron with this email already exists.'}), 400

    cursor.execute("SELECT patronID FROM Patron WHERE patronID LIKE 'P%' ORDER BY patronID DESC LIMIT 1")
    row = cursor.fetchone()
    if row:
        last_patron_id = row['patronID']
        new_number = int(last_patron_id[1:]) + 1
        new_patron_id = "P" + str(new_number).zfill(3)
    else:
        new_patron_id = "P001"

    try:
        cursor.execute("""
            INSERT INTO Patron (patronID, firstName, lastName, contactInfo, membershipDate, email)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (new_patron_id, first_name, last_name, contact, membership_date, email))
        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'error': str(e)}), 400

    conn.close()

    session['patronID'] = new_patron_id
    return jsonify({'message': 'Registration successful', 'patronID': new_patron_id}), 200


# ---------------------- LOGIN (using Patron ID or email) ----------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    patron_id = data.get('patronID')
    email = data.get('email')

    conn = get_db_connection()
    cursor = conn.cursor()

    if patron_id:
        cursor.execute("SELECT * FROM Patron WHERE patronID = ?", (patron_id,))
    elif email:
        cursor.execute("SELECT * FROM Patron WHERE email = ?", (email,))
    else:
        conn.close()
        return jsonify({'error': 'No Patron ID or email provided'}), 400

    patron = cursor.fetchone()
    conn.close()

    if not patron:
        return jsonify({'error': 'Patron not found'}), 404

    session['patronID'] = patron['patronID']
    return jsonify({
        'message': 'Login successful',
        'patronID': patron['patronID'],
        'firstName': patron['firstName'],
        'lastName': patron['lastName']
    }), 200

# ---------------------- CHECK SESSION (to verify login status) ----------------------
@app.route('/check_session', methods=['GET'])
def check_session():
    patron_id = session.get('patronID')
    if patron_id:
        return jsonify({'loggedIn': True, 'patronID': patron_id}), 200
    else:
        return jsonify({'loggedIn': False}), 200
    
# ---------------------- FIND ITEM ----------------------
@app.route('/find_item', methods=['GET'])
def find_item():
    keyword = request.args.get('keyword', '')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT *
        FROM Library_Item
        WHERE title LIKE ? OR genre LIKE ? OR authorArtist LIKE ?
    """, (f'%{keyword}%', f'%{keyword}%', f'%{keyword}%'))
    items = cursor.fetchall()
    conn.close()
    result = [dict(item) for item in items]
    return jsonify(result)

# ---------------------- BORROW ITEM ----------------------
@app.route('/borrow_item', methods=['POST'])
def borrow_item():
    patron_id = session.get('patronID')
    if not patron_id:
        return jsonify({'error': 'Not logged in'}), 401
    data = request.get_json()
    item_id = data.get('itemId')
    borrow_date = data.get('borrowDate')
    due_date = data.get('dueDate')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM Patron WHERE patronID = ?", (patron_id,))
    if not cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Patron ID not found. Please register first.'}), 400

    cursor.execute("SELECT availabilityStatus FROM Library_Item WHERE itemID = ?", (item_id,))
    result = cursor.fetchone()
    if not result:
        conn.close()
        return jsonify({'error': 'Item not found.'}), 400
    if result['availabilityStatus'] != "Available":
        conn.close()
        return jsonify({'error': 'Item is not available.'}), 400
    
    transaction_id = "T" + datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    
    try:
        cursor.execute("""
            INSERT INTO Borrowing_Transaction (transactionID, patronID, itemID, borrowDate, dueDate, returnDate, fineAmount)
            VALUES (?, ?, ?, ?, ?, NULL, 0.00)
        """, (transaction_id, patron_id, item_id, borrow_date, due_date))
        cursor.execute("""
            UPDATE Library_Item SET availabilityStatus = 'Borrowed' WHERE itemID = ?
        """, (item_id,))
        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'error': str(e)}), 400
        
    conn.close()
    return jsonify({'message': 'Item successfully borrowed', 'transactionId': transaction_id}), 200

# ---------------------- RETURN ITEM ----------------------
@app.route('/return_item', methods=['POST'])
def return_item():

    data = request.get_json()
    transaction_id = data.get('transactionId')
    return_date = data.get('returnDate')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT itemID FROM Borrowing_Transaction WHERE transactionID = ?", (transaction_id,))
    result = cursor.fetchone()
    
    if not result:
        conn.close()
        return jsonify({'error': 'Transaction not found.'}), 400
    
    item_id = result['itemID']
    
    try:
        cursor.execute("""
            UPDATE Borrowing_Transaction
            SET returnDate = ?
            WHERE transactionID = ?
        """, (return_date, transaction_id))
        cursor.execute("""
            UPDATE Library_Item
            SET availabilityStatus = 'Available'
            WHERE itemID = ?
        """, (item_id,))
        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'error': str(e)}), 400
        
    conn.close()
    return jsonify({'message': 'Item successfully returned'}), 200

# ---------------------- DONATE ITEM ----------------------
@app.route('/donate_item', methods=['POST'])
def donate_item():
    data = request.get_json()
    title = data.get('title')
    item_type = data.get('type')
    genre = data.get('genre')
    authorArtist = data.get('authorArtist')
    publisher = data.get('publisher')
    publicationDate = data.get('publicationDate')
    isbnIssn = data.get('isbnIssn')
    availabilityStatus = "Available"  # default val

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT itemID FROM Library_Item
        WHERE itemID LIKE 'L%' 
        ORDER BY itemID DESC LIMIT 1
    """)
    row = cursor.fetchone()
    if row:
        last_id = row['itemID']
        next_num = int(last_id[1:]) + 1
        next_itemID = "L" + str(next_num).zfill(3)
    else:
        next_itemID = "L001"

    try:
        cursor.execute("""
            INSERT INTO Library_Item (itemID, title, type, genre, authorArtist, publisher, publicationDate, isbnIssn, availabilityStatus)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
        next_itemID, title, item_type, genre, authorArtist, publisher, publicationDate, isbnIssn, availabilityStatus))
        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'error': str(e)}), 400

    conn.close()
    return jsonify({'message': f'Item "{title}" donated successfully with ID {next_itemID}'}), 200


# ---------------------- PLACEHOLDER ENDPOINTS ----------------------
@app.route('/find_event', methods=['GET'])
def find_event():
    return jsonify({'message': 'find_event endpoint not implemented yet'}), 200

@app.route('/register_event', methods=['POST'])
def register_event():
    return jsonify({'message': 'register_event endpoint not implemented yet'}), 200

@app.route('/volunteer', methods=['POST'])
def volunteer():
    return jsonify({'message': 'volunteer endpoint not implemented yet'}), 200

@app.route('/ask_help', methods=['POST'])
def ask_help():
    return jsonify({'message': 'ask_help endpoint not implemented yet'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
