import { Item, Mint } from "../generated/schema";
import { Transfer } from "../generated/templates/NFTTemplate/NFTTemplate";

export function handleNFTCreated(event: Transfer): void {
    let nft = Item.load(event.address.toHexString() + "_" + event.params.tokenId.toString());

    if(!nft) {
        nft = new Item(event.address.toHexString() + "_" + event.params.tokenId.toString());
        nft.collection = event.address;
        nft.from = event.params.from;
        nft.tokenId = event.params.tokenId;
        
        let mint = new Mint(event.address.toHexString() + "_" + event.params.tokenId.toString());

        if(!mint) {
            mint = new Mint(event.address.toHexString());
        }

        mint.nft = event.address.toHexString() + "_" + event.params.tokenId.toString()
        mint.timestamp = event.block.timestamp;
        mint.save();
    }

    nft.to = event.params.to;
    nft.save()
}

/**
 * 
 * type Token @entity {
  id: ID!
  tokenID: BigInt!
  contentURI: String
  tokenIPFSPath: String
  name: String!
  createdAtTimestamp: BigInt!
  creator: User!
  owner: User!
}

type User @entity {
  id: ID!
  tokens: [Token!]! @derivedFrom(field: "owner")
  created: [Token!]! @derivedFrom(field: "creator")
}
 */