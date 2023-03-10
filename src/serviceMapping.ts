import { ServiceMinted as ServiceMintedEvent, ServiceRented } from "../generated/ServicesNFT/ServicesNFT";
import { ServiceNFT, ServiceRent } from "../generated/schema";
import { Match, RegExp } from "assemblyscript-regex";
import { log } from "@graphprotocol/graph-ts";

export function handleServiceMinted(event: ServiceMintedEvent): void {
  let logIndexService = event.logIndex.toString();
  let servicesNFTId = event.transaction.hash.toHex() + logIndexService;
  let servicesNFTLogs = event.transactionLogIndex.toHex();
  let servicesNFT = ServiceNFT.load(servicesNFTId);
  let defaultValue = false;

  if (!servicesNFT) {
    servicesNFT = new ServiceNFT(servicesNFTId);

    log.info("Service NFT mint event indexed succesfully", [servicesNFTLogs]);
  } else {
    log.error("Error: Indexing subscription payment function event", [servicesNFTLogs]);
  }

  servicesNFT.creator = servicesNFT.creator;
  servicesNFT.owner = servicesNFT.creator;
  servicesNFT.totalSales = servicesNFT.totalRevenue;
  servicesNFT.name = event.params.name;
  servicesNFT.description = event.params.description;
  servicesNFT.subCategory = event.params.category.toString();
  servicesNFT.price = event.params.price;
  servicesNFT.tokenURI = event.params.tokenURI;
  servicesNFT.tokenId = event.params.tokenId;
  servicesNFT.quantity = event.params.tokenId;
  servicesNFT.royaltyPercentage = event.params.royaltyPercentage;
  servicesNFT.totalRevenue = event.params.revenue;
  servicesNFT.isActive = event.params.isActive;
  servicesNFT.soldOut = defaultValue;

  let regex = new RegExp("(Q[a-zA-Z0-9]{45})", "g");
  let match: Match | null = regex.exec(event.params.tokenURI);

  const CID = "QmWsAKJsUobK4wTM8u8h7yP5Kcy3h5eL5oSTZDyyPw74SJ";
  const ipfsURL = `https://commerxe.mypinata.cloud/ipfs/${CID}`;

  if (match != null) {
    const ipfsHash = match.matches[0];
    //servicesNFT.image = ipfsHash;
    servicesNFT.image = ipfsURL;

    log.info("IPFS detected, IPFS Hash: {}", [ipfsHash]);

  } else {
    log.critical("Critical: No IPFS detected, IPFS Hash: {}", [servicesNFT.image]);
  }

  // Set values without know use case or context
  servicesNFT.comments = "";
  servicesNFT.ratings = "";
  servicesNFT.tags = "";

  // Get number block
  servicesNFT.block = event.block.number;
  // Get timestamp in UNIX
  servicesNFT.timestamp = event.block.timestamp;
  // Get LogIndex
  servicesNFT.logIndex = event.transactionLogIndex;
  // Keys not hardoded in front
  servicesNFT.currency = "cxe";
  servicesNFT.categoryId = "3";
  servicesNFT.category = "services";
  
  servicesNFT.save();
}

export function handleServiceRented(event: ServiceRented): void {
  let logIndexNFT = event.logIndex.toString();
  let nftRentId = event.transaction.hash.toHex() + logIndexNFT;
  let nftRentLogs = event.transactionLogIndex.toHex();
  let nftRent = ServiceRent.load(nftRentId);

  if(!nftRent) {
    nftRent = new ServiceRent(nftRentId);

    log.info("Service NFT rent event indexed succesfully", [nftRentLogs]);
  } else {
    log.error("Error: Indexing subscription payment function event", [nftRentLogs]);
  }

  nftRent.tokenId = event.params.tokenId;
  nftRent.seller = event.params.seller;
  nftRent.buyer = event.params.buyer;
  nftRent.price = event.params.price;
  nftRent.currency = "cxe";
  nftRent.timestamp = event.block.timestamp;

  nftRent.save();
}