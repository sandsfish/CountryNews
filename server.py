from flask import render_template
from flask import request
from flask import Flask, jsonify
from werkzeug.contrib.cache import SimpleCache

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

cache = SimpleCache()
cache_timeout = 24 * 60

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
nigeria_cid = 1348


app = Flask(__name__)

@app.route('/')
def index():
    return '<h1>PartNews Root</h1>'

@app.route('/about')
def about():
	return render_template('about.html')

@app.route('/countrynews.js')
def countrynews():
	cid = request.args.get('topic_id')
	return render_template('countrynews.js', topic_id=cid)

# static render example:
# @app.route('/landscape/<int:controversy_id>/<int:dump_id>/<int:timeslice_id>')
@app.route('/country/<string:country>')
def country(country):
	# create_landscape(controversy_id, dump_id, timeslice_id)
	
	if(country == 'mexico'):
		return render_template('mexico.html', topic_id=mexico_cid, title="MEXICO", background="mexico-city-background.jpg")
	if(country == 'nigeria'):
		return render_template('mexico.html', topic_id=nigeria_cid, title="NIGERIA", background="nigeria-lagos-background.jpg")

	# Need to also change background image and country name
	# Pass these as parameters? 
	# Or store them in some location?


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

@app.route('/top_stories/<int:cid>')
def top_stories(cid):
	topicStoriesAPI = 'https://api.mediacloud.org/api/v2/topics/{0}/stories/list?limit=100&key={1}&sort=social'.format(cid, api_key)
	stories = cache.get(topicStoriesAPI)

	if stories is None:
		print('Cache Miss')
		stories_response = requests.get(topicStoriesAPI)
		stories = stories_response.text
		cache.set(topicStoriesAPI, stories, timeout=cache_timeout)
	return(stories)


@app.route('/top_media/<int:cid>')
def top_media(cid):
	topicMediaAPI = 'https://api.mediacloud.org/api/v2/topics/{0}/media/list?limit=100&key={1}'.format(cid, api_key)
	media = cache.get(topicMediaAPI)

	if media is None:
		print('Cache Miss')
		media_response = requests.get(topicMediaAPI)
		media = media_response.text
		cache.set(topicMediaAPI, media, timeout=cache_timeout)
	return(media)

@app.route('/top_words/<int:cid>')
def top_words(cid):
	topicWordsAPI = 'https://api.mediacloud.org/api/v2/topics/{0}/wc/list?key={1}'.format(cid, api_key)
	words = cache.get(topicWordsAPI)

	if words is None:
		print('Cache Miss')
		words_response = requests.get(topicWordsAPI)
		words = words_response.text
		cache.set(topicWordsAPI, words, timeout=cache_timeout)
	return(words)

@app.route('/story/<int:id>')
def story(id):
	story = mc.story(id)
	return(jsonify(story))

if __name__ == '__main__':
    app.run(debug=True)
