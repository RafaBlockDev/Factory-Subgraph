import { BigInt, Entity } from "@graphprotocol/graph-ts";
import { CollectionDeployed as CollectionDeployedEvent } from "../generated/CollectionNFT/CollectionNFT"
import { Transfer } from "../generated/templates/EVMNFT/EVMNFT";
import { EVMNFT as EVMNFTTemplate } from "../generated/templates";
import { Collection } from "../generated/schema";

export function handleCollectionCreated(event: CollectionDeployedEvent): void {
    //marketPhysicalNFT.tokenURI = '/' + event.params.tokenId.toString() + '.json';
    //const tokenIpfsHash = ipfshash + token.tokenURI
    //token.ipfsURI = tokenIpfsHash
    //TokenMetadataTemplate.create(tokenIpfsHash)
    let collectionNFT = Collection.load(event.params.collection.toHexString());    
    let defaultValue = false;
    let defaultNumber = (0).toString();
    let defaultSale = new BigInt(2);
    let setValue = true;

    if(!collectionNFT) {
        collectionNFT = new Collection(event.params.collection.toHexString());
    }

    collectionNFT.name = event.params.name;
    collectionNFT.description = event.params.description;
    collectionNFT.owner = event.params.owner;
    collectionNFT.creator = collectionNFT.owner;
    collectionNFT.tokenURI = event.params.initBaseURI;
    collectionNFT.price = event.params.price;
    collectionNFT.totalSupply = event.params.totalSupply;
    collectionNFT.totalSales = defaultSale;
    collectionNFT.isActive = setValue;
    collectionNFT.subCategory = defaultNumber;
    collectionNFT.soldOut = defaultValue;

    //collectionNFT.nft = event.address.toString();

    // Set values without know use case or context
    collectionNFT.comments = "";
    collectionNFT.ratings = "";
    collectionNFT.tags = "";
    
    // Get number block
    collectionNFT.block = event.block.number;
    // Get timestamp in UNIX
    collectionNFT.timestamp = event.block.timestamp;
    // Get LogIndex
    collectionNFT.logIndex = event.transactionLogIndex;
    // Keys not hardoded in front
    collectionNFT.currency = "cxe";
    collectionNFT.categoryId = "2";
    collectionNFT.category = "nft-collections";
    collectionNFT.address = event.params.collection;

    //let nft = Item.load(event.address.toHexString());

    EVMNFTTemplate.create(event.params.collection)

    collectionNFT.save();
}