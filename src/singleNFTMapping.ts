import { MarketItemCreated, ItemSold } from "../generated/SingleDigitalNFT/SingleDigitalNFT"
import { SingleNFT, NFTCategory, NftItemSold } from "../generated/schema"
import { Match, RegExp } from "assemblyscript-regex";
import { log } from "@graphprotocol/graph-ts";

export function handleMarketItemCreated(event: MarketItemCreated): void {
  let indexLogNFT = event.logIndex.toString();
  let nftId = event.transaction.hash.toHexString() + indexLogNFT;
  let nftLogs = event.transactionLogIndex.toHex();

  let nftCategoryId = nftId;
  let defaultValue = false;

  let marketSingleNFT = SingleNFT.load(nftId);
  let categoryNFT = NFTCategory.load(nftCategoryId);

  if (!marketSingleNFT) {
    marketSingleNFT = new SingleNFT(nftId);

    log.info("NFT event indexed succesfully", [nftLogs]);
  } else {
    log.error("Error: Indexing NFT mint function events", [nftLogs]);
  }

  marketSingleNFT.tokenId = event.params.tokenId;
  marketSingleNFT.tokenURI = event.params.tokenURI;
  marketSingleNFT.totalSales = event.params.revenue;
  marketSingleNFT.name = event.params.name;
  marketSingleNFT.description = event.params.description;
  marketSingleNFT.owner = event.params.owner;
  marketSingleNFT.creator = marketSingleNFT.owner;
  marketSingleNFT.price = event.params.price;
  marketSingleNFT.royaltyPercentage = event.params.percentage;
  marketSingleNFT.quantity = event.params.total;
  marketSingleNFT.totalRevenue = event.params.revenue;
  marketSingleNFT.subCategory = event.params.setCategory.toString();
  marketSingleNFT.isActive = event.params.sold;
  marketSingleNFT.soldOut = defaultValue;

  let regex = new RegExp("(Q[a-zA-Z0-9]{45})", "g");
  let match: Match | null = regex.exec(event.params.tokenURI);

  const CID = "QmWsAKJsUobK4wTM8u8h7yP5Kcy3h5eL5oSTZDyyPw74SJ";
  const ipfsURL = `https://commerxe.mypinata.cloud/ipfs/${CID}`;

  if (match != null) {
    const ipfsHash = match.matches[0];
    //marketSingleNFT.image = ipfsHash;
    marketSingleNFT.image = ipfsURL;

    log.info("IPFS detected, IPFS Hash: {}", [ipfsHash]);

  } else {
    log.critical("Critical: No IPFS detected, IPFS Hash: {}", [marketSingleNFT.image]);
  }

  // Set values without know use case or context
  marketSingleNFT.comments = "";
  marketSingleNFT.ratings = "";
  marketSingleNFT.tags = "";

  // Get number block
  marketSingleNFT.block = event.block.number;
  // Get timestamp in UNIX
  marketSingleNFT.timestamp = event.block.timestamp;
  // Get LogIndex
  marketSingleNFT.logIndex = event.transactionLogIndex;
  // Keys not hardoded in front
  marketSingleNFT.currency = "cxe";
  marketSingleNFT.categoryId = "1";
  marketSingleNFT.category = "nft";

  if(!categoryNFT) {
    categoryNFT = new NFTCategory(nftCategoryId);
    categoryNFT.nft = marketSingleNFT.id;
    categoryNFT.save();
    
    log.info("Category indexed succesfully", [nftLogs]);
  } else {
    log.critical("Critical: category no indexed", [nftLogs]);
  }

  marketSingleNFT.save();
}

export function handleItemSold(event: ItemSold): void {
  let indexLogNftId = event.logIndex.toString();
  let nftIdIndex = event.transaction.hash.toHexString() + indexLogNftId; 
  let nftIdLogs = event.transactionLogIndex.toHex();

  let nft = NftItemSold.load(nftIdIndex);

  if(!nft) {
    nft = new NftItemSold(nftIdIndex);

    log.info("NFT sold function indexed succesfully", [nftIdLogs])
  } else {
    log.error("Error: NFT sold event not indexed", [nftIdLogs]);
  }

  nft.currency = "cxe";
  nft.tokenId = event.params.tokenId;
  nft.price = event.params.price;
  nft.seller = event.params.seller;
  nft.buyer = event.params.buyer;
  nft.timestamp = event.block.timestamp;

  nft.save();
}