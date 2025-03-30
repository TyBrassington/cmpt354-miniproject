import sqlite3
import datetime


def get_db_connection():
    conn = sqlite3.connect('library.db')
    conn.execute("PRAGMA foreign_keys = ON")  # Enforce foreign key constraints
    conn.row_factory = sqlite3.Row  # lets us use column names
    return conn

# ---------------------- REGISTER PATRON ----------------------
def register_patron():
    print("\n--- Register as a New Patron ---")
    patron_id = input("Enter your Patron ID (or type 'back' to return): ")
    if patron_id.lower() == 'back':
        return

    first_name = input("First Name: ")
    last_name = input("Last Name: ")
    contact = input("Contact Info (e.g., phone or email): ")
    membership_date = input("Membership Date (YYYY-MM-DD): ")
    email = input("Email Address: ")

    try:
        cursor.execute("""
            INSERT INTO Patron (patronID, firstName, lastName, contactInfo, membershipDate, email)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (patron_id, first_name, last_name, contact, membership_date, email))
        conn.commit()
        print("Patron registered successfully.")
    except Exception as e:
        print("Error registering patron:", e)

# ---------------------- FIND ITEM ----------------------
def find_item():
    keyword = input("Enter title or keyword: ")
    cursor.execute("""
        SELECT itemID, title, type, genre, availabilityStatus 
        FROM Library_Item 
        WHERE title LIKE ? OR genre LIKE ?
    """, (f'%{keyword}%', f'%{keyword}%'))

    results = cursor.fetchall()
    if results:
        for row in results:
            print(f"ID: {row[0]}, Title: {row[1]}, Type: {row[2]}, Genre: {row[3]}, Status: {row[4]}")
    else:
        print("No items found.")

# ---------------------- BORROW ITEM ----------------------
def borrow_item():
    patron_id = input("Enter your Patron ID: ")
    item_id = input("Enter the Item ID you want to borrow: ")

    # Validate Patron ID
    cursor.execute("SELECT * FROM Patron WHERE patronID = ?", (patron_id,))
    if not cursor.fetchone():
        print("Error: Patron ID not found. Please register first using Option 0.")
        return

    # Check item availability
    cursor.execute("SELECT availabilityStatus FROM Library_Item WHERE itemID = ?", (item_id,))
    result = cursor.fetchone()
    if not result:
        print("Item not found.")
        return
    if result[0] != "Available":
        print("Sorry, this item is not available.")
        return

    borrow_date = input("Enter borrow date (YYYY-MM-DD): ")
    due_date = input("Enter due date (YYYY-MM-DD): ")
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
        print(f"Item successfully borrowed. Transaction ID: {transaction_id}")
    except Exception as e:
        print("Error during borrowing:", e)

# ---------------------- RETURN ITEM ----------------------
def return_item():
    transaction_id = input("Enter your transaction ID: ")
    return_date = input("Enter return date (YYYY-MM-DD): ")

    cursor.execute("""
        SELECT itemID FROM Borrowing_Transaction WHERE transactionID = ?
    """, (transaction_id,))
    result = cursor.fetchone()

    if not result:
        print("Transaction not found.")
        return

    item_id = result[0]

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
        print("Item successfully returned.")
    except Exception as e:
        print("Error during return:", e)

# ---------------------- MAIN LOOP ----------------------
while True:
    menu()
    choice = input("Choose an option: ")

    if choice == '0':
        register_patron()
    elif choice == '1':
        find_item()
    elif choice == '2':
        borrow_item()
    elif choice == '3':
        return_item()
    elif choice == '9':
        print("Goodbye!")
        break
    else:
        print("Feature not implemented yet.")
