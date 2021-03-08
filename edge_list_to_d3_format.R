data = read.csv('edge_list.csv', header=TRUE)


# Transform it in a graph format
library(igraph)
network=graph_from_data_frame(d=data, directed=F)

# Transform it in a JSON format for d3.js
library(d3r)
data_json <- d3_igraph(network)

# Save this file
write(data_json, "data.json")
