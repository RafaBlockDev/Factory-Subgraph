import { NFTMarket } from "../generated/schema";
import { Item } from "../generated/Market/Market";

export function handleNFTCreated(event: Item): void {
    let nft = NFTMarket.load(event.address.toHexString());

    if(!nft) {
        nft = new NFTMarket(event.address.toHexString());
    }
    nft.nftAddress = event.params.nftContract;
    nft.owner = event.params.owner;
    nft.creator = event.params.creator;
    nft.name = event.params.name;
    nft.description = event.params.description;
    nft.tokenURI = event.params.tokenURI;
    nft.tokenId = event.params.tokenId;
    nft.price = event.params.price;
    nft.royalty = event.params.royalty;
    nft.category = event.params.category.toString();
    
    nft.save()
}