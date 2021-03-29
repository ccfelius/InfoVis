### EXAMPLE CODE TO PROCESS PYTHON TO JSON ###

import pandas as pd
import json

# INPUT PARAMETERS
# Name of output file
outputname = "batch2"
# Amount of related topics
related = 20

with open("soc-redditHyperlinks-body.tsv") as f:
    reddit = pd.read_csv(f, sep='\t')

# Data processing of subreddit Drama
drama = reddit[reddit["SOURCE_SUBREDDIT"] == "subredditdrama"]
drama_target = set(list(drama['TARGET_SUBREDDIT'].value_counts()[:related].index))
all_nodes = drama_target.union(set(['subredditdrama']))
drama_ = reddit[reddit["SOURCE_SUBREDDIT"].isin(all_nodes)]

graph = {'nodes': [], 'links': []}
names = {}

for i, node in enumerate(all_nodes):
    # Dictionary that refers to ID of the node
    names[node] = i
    # Val is size of outgoing edges in the subset drama
    val = len(drama_[drama_["SOURCE_SUBREDDIT"] == node])
    graph['nodes'].append({"id": i, "name": node, "value": val})


# loop through the set of subreddits
for sr in all_nodes:
    subset = reddit[reddit['SOURCE_SUBREDDIT'] == sr]
    for target_ in drama_target:
        if sr == target_:
            continue
        subset_t = subset[subset['TARGET_SUBREDDIT'] == target_]
        if len(subset_t) == 0:
            # print(f"{sr} has no links to {target_}")
            continue
        sentiment = subset_t["LINK_SENTIMENT"].sum()
        graph['links'].append({"source": names[sr], "target": int(names[target_]), "value": int(sentiment)})

with open(f'WebL/data/{outputname}.json', 'w') as outfile:
    json.dump(graph, outfile)

