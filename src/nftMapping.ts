import { NFT } from "../generated/schema";
import { NFTMinted } from "../generated/NFT/NFT";


export function handleNFTMinted(event: NFTMinted): void {
    let nft = NFT.load(event.address.toHexString());

    if(!nft) {
        nft = new NFT(event.address.toHexString());
    }

    nft.creator = event.params.creator;
    nft.name = event.params.name;
    nft.description = event.params.description;
    nft.tokenURI = event.params.tokenURI;
    nft.category = event.params.category.toString();

    nft.save()
}
