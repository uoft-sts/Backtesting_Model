from flask import Flask, request, redirect, render_template
from werkzeug.utils import secure_filename
import time
import csv

app = Flask(__name__)


@app.route('/result', methods=['GET', 'POST'])
def result():
	daterange_from = request.form.get('daterange_from')
	daterange_to = request.form.get('daterange_to')
	f = request.files['myfile']
	f.save(secure_filename(f.filename))

	with open(f.filename) as csv_file:
		reader = csv.reader(csv_file)
		for row in reader:
			print(row)
	
	return '''<h1>Date starts at: {}</h1>
              <h1>Date ends at: {}</h1>
              <h1>File name is: {}</h1>'''.format(daterange_from, daterange_to, f.filename)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

if __name__ == "__main__":
    app.run()
