# Commerxe Subgraph API

**How to use the subgraph** 
First we have the following information schema, about the queries that have the API, you can find it in [subgraph API query information](https://www.figma.com/file/7pzPnBJGiPG2jHaDN9zKNH/Subgraph-API). 

The subgraph is getting the information through events for each function, specially is consuming the mint function events. 

NOTE: This repositorie is built to deploy each time a commit is pushed to main branch. So, is not necessary to deploy the subgraph before push to main or to a pull request.

**Run the project**

To run the project:
```
yarn install
#or 
npm install --save
```
 
Then you need to install graph CLO globally with NPM or Yarn:
```
npm install -g @graphprotocol/graph-cli
#or 
yarn global add @graphprotocol/graph-cli
```

Then you have packages installed, please authenticate through CLI:
```
graph auth --product hosted-service 157aa23a5ba644a8bbbed8dd094ba1a6
```

And finally you commit changes, fdeploy subgraph: 
```
graph deploy --product hosted-service rafablockdev/cxe-subgraph
```

**Endpoint**
The endpoint [commerxe Subgraph](https://api.thegraph.com/subgraphs/name/rafablockdev/cxe-subgraph) has the schemas to index all smart contract commerxe core information.
