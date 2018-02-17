"""
Scrape subdirectories for meta tags and create a navigation menu for Blogs
"""

import os
import json
from bs4 import BeautifulSoup


def get_dirs(base_dir):
    """
    List subdirectories in base_dir sorted by name.
    """
    dirs = list(os.walk(base_dir))[0][1]
    dirs.sort(key=int)
    dirs.reverse()
    return dirs


def get_meta(base_dir, meta):
    """
    get meta tags for each subdirectory
    """
    dirs = get_dirs(base_dir)
    contents = {}
    for _dir in dirs:
        index_file = os.path.join(base_dir, _dir, 'index.html')
        with open(index_file, encoding='utf-8') as file:
            index = file.read()
        soup = BeautifulSoup(index, 'html5lib')
        contents[_dir] = {'link': f'/{base_dir}/{_dir}'}
        for tag in meta:
            contents[_dir][tag] = soup.find('meta', property=meta[tag])['content']
    return contents


def to_json(base_dir, contents):
    with open(os.path.join(os.getcwd(), 'templates', 'pages', base_dir, 'map.json'), 'w') as file:
        json.dump(contents, file)

if __name__ == '__main__':
    metas = {
        'title': 'og:title',
        'desc': 'og:description',
        'date': 'og:published_time',
             }
    blogs = get_meta('blog', metas)
    to_json('blog', blogs)

    projects = get_meta('project', metas)
    to_json('project', projects)
        
