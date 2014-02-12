# -*- coding: utf-8 -*-
"""
Pelican Search
============

A Pelican plugin to provide client-side javascript for your pelican
pages and articles.

Copyright 2014 Bernhard Scheirle
Copyright 2014 Florian Jacob
Copyright 2014 Simon Dreher
"""

from __future__ import unicode_literals

import os.path
import json
from bs4 import BeautifulSoup
from codecs import open

from pelican import signals


class Pelican_Search_JSON_Generator(object):

    """

    """
    def __init__(self, context, settings, path, theme, output_path, *args):
        self.output_path = output_path
        self.context = context
        self.siteurl = settings.get('SITEURL')
        self.json_nodes = []

    def create_json_node(self, page):
        if getattr(page, 'status', 'published') != 'published':
            return

        node = {}

        soup_title = BeautifulSoup(page.title.replace('&nbsp;', ' '))
        node['title'] = soup_title.get_text(separator=' ', strip=True)

        soup_text = BeautifulSoup(page.content)
        page_text = soup_text.get_text(separator=' ', strip=True)
        node['content'] = ' '.join(page_text.split())

        if hasattr(page, 'category'):
            node['category'] = page.category.name
        else:
            node['category'] = ''

        node['tags'] = [tag.name for tag in page.tags]

        node['url'] = self.siteurl + '/' + page.url

        self.json_nodes.append(node)

    def generate_output(self, writer):
        path = os.path.join(self.output_path, 'pelican_search_content.js')

        pagesAndArticles = self.context['pages'] + self.context['articles']

        for article in self.context['articles']:
            pagesAndArticles += article.translations

        for x in pagesAndArticles:
            self.create_json_node(x)

        with open(path, 'w', encoding='utf-8') as fd:
            fd.write('var data = ')
            json.dump(self.json_nodes, fd)


def get_generators(generators):
    return Pelican_Search_JSON_Generator


def register():
    signals.get_generators.connect(get_generators)
