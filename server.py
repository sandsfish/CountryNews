from flask import render_template
from flask import request
from flask import Flask, jsonify

import ConfigParser
import datetime
import requests
import copy
import json
import os

# from mediacloudlandscape.landscape import *
import mediacloud

# base directory for relative paths
basedir = os.path.dirname(os.path.abspath(__file__))

# logging setup
import logging
logging.basicConfig(filename=os.path.join(basedir, 'log', 'landscape.log'), level=logging.DEBUG)

config = ConfigParser.ConfigParser()
config.read(os.path.join(basedir, 'app.config'))
api_key = config.get('mediacloud', 'key')

logging.info('MediaCloud API Initializing...')
mc = mediacloud.api.MediaCloud(api_key)
print(mc)
logging.info('MediaCloud API Initialized.')

mc_admin = mediacloud.api.AdminMediaCloud(mc)
print(mc_admin)

mexico_cid = 1350

app = Flask(__name__)

@app.route('/')
def index():
    return '<h1>PartNews Root</h1>'

# static render example:
# @app.route('/landscape/<int:controversy_id>/<int:dump_id>/<int:timeslice_id>')
@app.route('/mexico')
def landscape():
	# create_landscape(controversy_id, dump_id, timeslice_id)
	# top_words = wordcount(mexico_cid)
	# return render_template('mexico.html', top=top_words)
	return render_template('mexico.html')


# TODO: Cache identical calls to Media Cloud. JavaScript data management if we get that far? But at least don't have to wait for the call every single dev cycle.
@app.route('/wordcount')
def wordcount(cid, num_words=50):
	top_words = []
	top_words = mc.wordCount('{~ controversy:%s }' % (cid), num_words=num_words)
	print(top_words)
	# return(json.dumps(top_words))
	return(top_words)

@app.route('/sentences')
def sentences():
	terms = request.args.get('terms')
	print("- AJAX QUERY PARAM: {0}".format(terms))
	sentenceList = [
		{ 'term': "things look good!" }, 
		{ 'term': "wow, it\'s working! now make an api call!" }
	]
	return(jsonify(results=sentenceList))
	# mc.sentences()
	# return(wordcount(mexico_cid))

# Media Cloud API :: storyList(self, solr_query='', solr_filter='', last_processed_stories_id=0, rows=20):
@app.route('/stories_raw')
def stories_raw():
	terms = request.args.get('terms')
	query = '{~ controversy:' + str(mexico_cid) + '} AND ' + terms
	stories = mc.storyList(query, rows=100)

	return(jsonify(results=stories));

# Media Cloud API :: storyList(self, solr_query='', solr_filter='', last_processed_stories_id=0, rows=20):
@app.route('/sentences_raw')
def sentences_raw():
	terms = request.args.get('terms')
	query = '{~ controversy:' + str(mexico_cid) + '} AND ' + terms
	stories = mc_admin.sentenceList(query, rows=100)

	return(jsonify(results=sentences));


if __name__ == '__main__':
    app.run(debug=True)
