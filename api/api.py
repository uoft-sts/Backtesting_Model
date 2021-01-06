from flask import Flask, request, redirect, render_template
from index_setter import set_index
from werkzeug.utils import secure_filename
from file_reader import File_Reader, Roll_Dates_First_Of_Month, Roll_Dates_Last_Trading_Day
import time
import csv
import os
import logging

UPLOAD_FOLDER = './data/'
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
@app.route('/result', methods=['GET', 'POST'])
def result():
    daterange_from = request.form.get('daterange_from')
    daterange_to = request.form.get('daterange_to')
    underlying = request.form.get('underlying')
    expmonth = request.form.get('expmonth')
    input_path = '/Users/kev/Documents/GitHub/Backtesting_Model/api/data/'
    output_path = '/Users/kev/Documents/GitHub/Backtesting_Model/api/data/'
    if 'file' in request.files:
        f = request.files.get('file')
        f_name = []
        for f in request.files.getlist('file'):
            #f.save(secure_filename(f.filename))
            f.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(f.filename)))          
            f_name.append(f.filename)
            set_index(input_path, output_path)
            a = Roll_Dates_Last_Trading_Day(underlying, expmonth, 
                              input_file_path = '/Users/kev/Documents/GitHub/Backtesting_Model/api/data/',
                              output_file_path = '/Users/kev/Desktop/sample.csv')
            df = a.expiration_filter()
            df_ = a.fit_transform(df)
            print(df_)
            #with open(os.path.join("./data/", f.filename)) as csv_file:
            #    reader = csv.reader(csv_file)
                
    return '''<h1>Underlying: {}</h1>
            <h1>Expiration Month: {}</h1>
            <h1>Date starts at: {}</h1>
            <h1>Date ends at: {}</h1>
            <h1>Files: {}</h1>'''.format(underlying, expmonth, daterange_from, daterange_to, f_name)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

if __name__ == "__main__":
    app.run()
