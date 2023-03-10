import { NFTMinted as NFTMintedEvent, Transfer as TransferEvent } from "../generated/ExampleNFT/ExampleNFT";
import { FilterNFT, TxnNFT } from "../generated/schema";
import { Match, RegExp } from "assemblyscript-regex";
import { log } from "@graphprotocol/graph-ts";

export function handleNFTMinted(event: NFTMintedEvent): void {
  let indexLogNft = event.logIndex.toString();
  let nftId = event.transaction.hash.toHex() + indexLogNft;
  let nftLogs = event.transactionLogIndex.toHex();
  let nft = FilterNFT.load(nftId);

  if(!nft) {
    nft = new FilterNFT(nftId);

    log.info("NFT mint event indexed succesfully", [nftLogs]);
  } else {
    log.error("Error: Indexing nft mint function event", [nftLogs]);
  }

  nft.totalRevenue = event.params.totalRevenue;
  nft.totalSales = event.params.totalSales;
  nft.owner = event.params.owner;
  nft.creator = nft.owner;
  nft.isActive = event.params.isActive;
  nft.price = event.params.price;
  nft.royaltyPercentage = event.params.percentage;
  nft.name = event.params.name;
  nft.description = event.params.description;
  nft.tokenURI = event.params.tokenURI;
  nft.tokenId = event.params.tokenId;

  const CID = "QmWsAKJsUobK4wTM8u8h7yP5Kcy3h5eL5oSTZDyyPw74SJ";
  const ipfsURL = `https://commerxe.mypinata.cloud/ipfs/${CID}`;

  nft.currency = "cxe";
  nft.ratings = "";
  nft.image = ipfsURL;
  nft.comments = "";

  nft.timestamp = event.block.timestamp;

  nft.save();
}

export function handleTransferNFT(event: TransferEvent): void {
    let indexLogNftTnx = event.logIndex.toString();
    let nftTxnId = event.transaction.hash.toHex() + indexLogNftTnx;
    let nftTxnLogs = event.transactionLogIndex.toHex();
    let nftTxn = TxnNFT.load(nftTxnId);
  
    if(!nftTxn) {
      nftTxn = new TxnNFT(nftTxnId);

      log.info("NFT transaction event indexed succesfully", [nftTxnLogs]);
    } else {
      log.error("Error: Indexing nft transaction function event", [nftTxnLogs]);
    }

    nftTxn.tokenId = event.params.tokenId;
    nftTxn.seller = event.params.from;
    nftTxn.buyer = event.params.to;
    nftTxn.timestamp = event.block.timestamp;

    nftTxn.save();
}