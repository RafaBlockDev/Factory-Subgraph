import { Item } from "../generated/schema";
import { Transfer } from "../generated/templates/NFTTemplate/NFTTemplate";

export function handleNFTCreated(event: Transfer): void {
    let nft = Item.load(event.address.toHexString());

    if(!nft) {
        nft = new Item(event.address.toHexString() + "-" + event.params.tokenId.toString());
        nft.collection = event.address;
        nft.from = event.params.from;
        nft.to = event.params.to;
        nft.amount = event.params.tokenId;
        nft.save()
    }
}