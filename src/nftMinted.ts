import { Item, CollectionCreated as Collection } from "../generated/schema";
import { NFTMinted, Transfer } from "../generated/templates/NFTTemplate/NFTTemplate";
import { EVMNFT } from "../generated/templates";

export function handleNFTCreated(event: NFTMinted): void {
    let nft = Item.load(event.address.toHexString());

    if(!nft) {
        let nft = new Item(event.address.toHexString() + "-" + event.params.tokenId.toString());
        nft.collection = event.address.toHexString()
        nft.tokenId = event.params.tokenId;
        nft.timestamp = event.block.timestamp;
        nft.logIndex = event.logIndex;
        nft.save()
    }
}