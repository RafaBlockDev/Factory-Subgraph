import { Item } from "../generated/schema";
import { NFTMinted } from "../generated/templates/NFTTemplate/NFTTemplate";

export function handleNFTCreated(event: NFTMinted): void {
    let nft = Item.load(event.address.toHexString());

    if(!nft) {
        let nft = new Item(event.address.toHexString() + "-" + event.params.tokenId.toHexString());
        nft.collection = event.address.toHexString()
        nft.tokenId = event.params.tokenId;
        nft.timestamp = event.block.timestamp;
        nft.logIndex = event.logIndex;
        nft.save()
    }
}