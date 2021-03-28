### EXAMPLE CODE TO PROCESS PYTHON TO JSON ###

import pandas as pd
import json

with open("soc-redditHyperlinks-body.tsv") as f:
    reddit = pd.read_csv(f, sep='\t')

# Data processing of subreddit Drama

drama = reddit[reddit["SOURCE_SUBREDDIT"] == "subredditdrama" ]
drama_target = set(list(drama['TARGET_SUBREDDIT'].value_counts()[:5].index))
all_nodes = drama_target.union(set(['subredditdrama']))
print(drama_target)

graph = {'nodes': [], 'links': []}
names = {}

for i, node in enumerate(all_nodes):
    names[node] = i
    graph['nodes'].append({"id": i, "name": node})

# then all connections from subredditdrama
sr = names["subredditdrama"]

for target_ in drama_target:
    sentiment = drama[drama['TARGET_SUBREDDIT'] == target_]["LINK_SENTIMENT"].sum()
    graph['links'].append({"source": sr, "target": int(names[target_]), "value": int(sentiment)})

with open('test.json', 'w') as outfile:
    json.dump(graph, outfile)

