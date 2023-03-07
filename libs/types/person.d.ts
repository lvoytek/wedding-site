import { RecursivePartial } from "./utils";

/**
 * Information needed to define a user
 */
type primaryData = {
	firstName: string;
	lastName: string;
	uuid: string;
};

/**
 * Information needed to contact and interact with a user
 */
type contactData = {
	email: string;
	googleAuthId?: string;
};

/**
 * Information provided by us to define guest assignments
 */
type assignmentData = {
	table: number;
	isInGroomishParty: boolean;
	isInBridalParty: boolean;
	isFamily: boolean;
	pokemon: string;
};

/**
 * Information given by user when they RSVP
 */
type rsvpData = {
	isGoing: boolean;
	diet?: string;
	associates?: Array<RecursivePartial<guestData>>;
};


/**
 * The information that defines and identifies a guest
 */
type guestIdentity = primaryData & contactData;

/**
 * Combination of information provided during an RSVP submission
 */
type submissionData = guestIdentity & rsvpData;

/**
 * Information about a user
 */
type guestData = submissionData & assignmentData;

export { primaryData, contactData, assignmentData, rsvpData, guestIdentity, submissionData, guestData };
