import sqlite3
import datetime
from flask import Flask, request, jsonify
from flask_cors import  CORS

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('library.db')
    conn.execute("PRAGMA foreign_keys = ON")  # Enforce foreign key constraints
    conn.row_factory = sqlite3.Row  # lets us use column names
    return conn

# ---------------------- REGISTER PATRON ----------------------
# def register_patron():
#     print("\n--- Register as a New Patron ---")
#     patron_id = input("Enter your Patron ID (or type 'back' to return): ")
#     if patron_id.lower() == 'back':
#         return

#     first_name = input("First Name: ")
#     last_name = input("Last Name: ")
#     contact = input("Contact Info (e.g., phone or email): ")
#     membership_date = input("Membership Date (YYYY-MM-DD): ")
#     email = input("Email Address: ")

#     try:
#         cursor.execute("""
#             INSERT INTO Patron (patronID, firstName, lastName, contactInfo, membershipDate, email)
#             VALUES (?, ?, ?, ?, ?, ?)
#         """, (patron_id, first_name, last_name, contact, membership_date, email))
#         conn.commit()
#         print("Patron registered successfully.")
#     except Exception as e:
#         print("Error registering patron:", e)

# ---------------------- FIND ITEM ----------------------
@app.route('/find_item', methods=['GET'])
def find_item():
    keyword = request.args.get('keyword', '')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT itemID, title, type, genre, availabilityStatus
        FROM Library_Item
        WHERE title LIKE ? OR genre LIKE ?
    """, (f'%{keyword}%', f'%{keyword}%'))
    items = cursor.fetchall()
    conn.close()
    result = [dict(item) for item in items]
    return jsonify(result)

# ---------------------- BORROW ITEM ----------------------
@app.route('/borrow_item', methods=['POST'])
def borrow_item():
    data = request.get_json()
    patron_id = data.get('patronId')
    item_id = data.get('itemId')
    borrow_date = data.get('borrowDate')
    due_date = data.get('dueDate')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Validate Patron ID
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
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO Library_Item (title, type, genre, availabilityStatus)
            VALUES (?, ?, ?, 'Available')
        """, (title, item_type, genre))
        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'error': str(e)}), 400
        
    conn.close()
    return jsonify({'message': f'Item "{title}" donated successfully'}), 200

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
