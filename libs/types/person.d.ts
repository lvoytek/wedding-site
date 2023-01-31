/**
 * Information needed to define a user
 */
type primaryData = {
	firstName: string,
	lastName: string,
	uuid: string,
};

/**
 * Information needed to contact and interact with a user
 */
type contactData = {
	email: string,
	googleAuthId: string
};

/**
 * Information given by user when they RSVP
 */
type rsvpData = primaryData & contactData & {
	isGoing: boolean,
	diet: string,
	plusOne?: primaryData,
	associates?: Array<primaryData>
};

/**
 * Information given by us to a user based on assignments while at the venue
 */
type assignmentData = {
	table: number,
	isInGroomishParty: boolean,
	isInBridalParty: boolean,
	isFamily: boolean,
	pokemon: string
};

/**
 * Information about a user
 */
type guestData = rsvpData & assignmentData;

export {primaryData, contactData, rsvpData, assignmentData, guestData};
