import { Item, CollectionCreated as Collection, Event } from "../generated/schema";
import { NFTMinted, Transfer } from "../generated/templates/NFTTemplate/NFTTemplate";
import { EVMNFT } from "../generated/templates";

export function handleNFTCreated(event: NFTMinted): void {
    let collection = Collection.load(event.address.toHex());

    if(collection != null) {
        let entityId = event.address.toHex() + "-" + event.params.tokenId.toString();
        let entity = new Item(entityId);

        entity.tokenId = event.params.tokenId;
        entity.collection = event.address;
    
        entity.timestamp = event.block.timestamp;

        entity.save();        
    }
}

export function handleTransfer(event: Transfer): void {
    let collection = Collection.load(event.address.toHex());
}
