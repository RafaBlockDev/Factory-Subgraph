import { SubscriptionMinted as SubscriptionCreatedEvent, SubscriptionPaid, SubscriptionNFT as SubscriptionNFTEvent } from "../generated/SubscriptionNFT/SubscriptionNFT";
import { SubscriptionNFT, SubscriptionPaidNFT } from "../generated/schema";
import { Match, RegExp } from "assemblyscript-regex";
import { log, ipfs, json, JSONValue, Bytes } from "@graphprotocol/graph-ts";
import { jsonToString, parseTokenURI } from "./assembly/parsing";

export function handleSubscriptionMinted(event: SubscriptionCreatedEvent): void {
  let indexLogSubscription = event.logIndex.toString();
  let subscriptionId = event.transaction.hash.toHex() + indexLogSubscription;
  let subscriptionLogs = event.transactionLogIndex.toHex();
  let subscription = SubscriptionNFT.load(subscriptionId);
  let defaultValue = false;

  if (!subscription) {
    subscription = new SubscriptionNFT(subscriptionId);

    log.info("Subscription event indexed succesfully", [subscriptionLogs]);
  } else {
    log.error("Error: Indexing subscription mint function events", [subscriptionLogs]);
  }

  subscription.tokenId = event.params.tokenId;
  subscription.tokenURI = event.params.tokenURI;
  subscription.totalSales = event.params.revenue;
  subscription.name = event.params.name;
  subscription.description = event.params.description;
  subscription.creator = subscription.owner;
  subscription.owner = subscription.creator;
  subscription.price = event.params.price;
  subscription.royaltyPercentage = event.params.royaltyPercentage;
  subscription.quantity = event.params.tokenId;
  subscription.totalRevenue = event.params.revenue;
  subscription.subCategory = event.params.category.toString();
  subscription.isActive = event.params.isActive;
  subscription.soldOut = defaultValue;

  let regex = new RegExp("(Q[a-zA-Z0-9]{45})", "g");
  let match: Match | null = regex.exec(event.params.tokenURI);

  const CID = "QmWsAKJsUobK4wTM8u8h7yP5Kcy3h5eL5oSTZDyyPw74SJ";
  const ipfsURL = `https://commerxe.mypinata.cloud/ipfs/${CID}`;

  if (match != null) {
    const ipfsHash = match.matches[0];
    //subscription.image = ipfsHash;
    subscription.image = ipfsURL;

    log.info("IPFS detected, IPFS Hash: {}", [ipfsHash]);

  } else {
    log.critical("Critical: No IPFS detected, IPFS Hash: {}", [ipfsURL]);
  }

  // Set values without know use case or context
  subscription.comments = "";
  subscription.ratings = "";
  subscription.tags = "";

  // Get number block
  subscription.block = event.block.number;
  // Get timestamp in UNIX
  subscription.timestamp = event.block.timestamp;
  // Get LogIndex
  subscription.logIndex = event.transactionLogIndex;
  // Keys not hardoded in front
  subscription.currency = "cxe";
  subscription.categoryId = "4";
  subscription.category = "subscription";

  subscription.save();
}

export function handleSubscriptionPaid(event: SubscriptionPaid): void {
  let indexLogSubscription = event.logIndex.toString();
  let subscriptionId = event.transaction.hash.toHex() + indexLogSubscription;
  let subscriptionIdLogs = event.transactionLogIndex.toHexString()
  let subscriptionPaid = SubscriptionPaidNFT.load(subscriptionId);

  if(!subscriptionPaid) {
    subscriptionPaid = new SubscriptionPaidNFT(subscriptionId);

    log.info("Subscription payment event indexed succesfully", [subscriptionIdLogs]);
  } else {
    log.error("Error: Indexing subscription payment function event", [subscriptionIdLogs]);
  }

  subscriptionPaid.tokenId = event.params.tokenId;
  subscriptionPaid.seller = event.params.seller;
  subscriptionPaid.buyer = event.params.buyer;
  subscriptionPaid.price = event.params.price;
  subscriptionPaid.currency = "cxe";
  subscriptionPaid.timestamp = event.block.timestamp;

  subscriptionPaid.save();
}
