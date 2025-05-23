# 1. Prerequisites

Before starting, ensure you have the following installed:

- **Node.js:**  
  Version **22.14.0 (LTS)** is recommended.  
  [Download Node.js](https://nodejs.org/en)
  
- **Python:**  
  Python **3.8+** is required. Verify that both Python and pip are installed.  
  For Windows, ensure you can run `py --version` in your terminal.

# 2. Clone the git repo
Run this in your terminal: `git clone https://github.com/TyBrassington/cmpt354-miniproject.git`

# 3. Navigate to library database frontend directory
Run this in your terminal: `cd library-database`

# 4. Install legacy dependencies
Run this in your terminal: `npm install`

# 5. Start the development server
Run this in your terminal: `npm run dev`
This command executes two processes:

- **Vite:** Starts the frontend development server.

- **Flask:** Runs the Python backend from the root directory.

**Note:** Please make sure you do not have any processes such as Jupyter Notebook open on Port 5000

## For macOS/Linux Users
If you experience issues with the Python command on macOS or Linux, modify the `package.json` file in the `library-database` directory:
Open `package.json` and locate the **scripts** section.
Change the dev and postinstall scripts from:

`"postinstall": "python -m pip install -r ../requirements.txt",`

`"dev": "concurrently \"vite\" \"cd .. && py library_app.py\""`

to:

`"postinstall": "python3 -m pip install -r ../requirements.txt",`

`"dev": "concurrently \"vite\" \"cd .. && python3 library_app.py\""`

# Additional notes

Please note that in order to use most functions of the library database, you need to create an account or login. If you dont wish to create an account, login using the following email:

`tybrass@sfu.ca`

This email already has existing transactions and is registered for some events already. Please feel free to play around with the application's features using this account.