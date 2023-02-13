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
 * Information given by user when they RSVP
 */
type rsvpData = {
	isGoing: boolean;
	diet?: string;
	associates?: Array<primaryData>;
};

/**
 * Combination of information provided during an RSVP submission
 */
type rsvpSubmissionData = primaryData & contactData & rsvpData;

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
 * Information about a user
 */
type guestData = primaryData & contactData & rsvpData & assignmentData;

export { primaryData, contactData, rsvpData, rsvpSubmissionData, assignmentData, guestData };
