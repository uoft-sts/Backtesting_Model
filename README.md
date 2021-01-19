# STS Backtesting Model

## Scripts to get it running

In the project directory, you can start the React frontend by going to **Terminal** or **Command Prompt**:

### `npm install`

Installs NPM -- node packages into the project folder
(Only need to install once)

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

Next, we start the backend Flask API and we must run it in a **NEW Terminal** or **Command Prompt**:

### `cd api`

Goes into api folder which is the backend (flask) folder

For Mac:

### `python3 -m venv venv`
### `source venv/bin/activate`

For Windows:

### `python -m venv venv`
### `venv\Scripts\activate`

Sets up the virtual environment (venv) and activates it\
Note: you only need to run the second activate script for the second time and afterwards

### `brew install ta-lib `

Installs ta-lib package
(Only need to install once)


### `pip install flask python-dotenv pandas matplotlib numpy ta-lib`

Installs all necessary packages, then we are good to run
(Only need to install once)


### `flask run`

Starts the backend


## After Running

We can send csv files and specify date range on the react frontend on localhost:3000\
Then the data in csv will be sent to the backend terminal.
