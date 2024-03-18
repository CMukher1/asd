/**
 * In UI error messages are translated based on these codes.
 * Follow error code format guidelines from the following doc before creating new error code.
 * doc: https://docs.google.com/document/d/1iZbWMUMqRgVq9bBsfuPfS3lF3RB33roHgSTC0L9oY0M
 */
const Err = {
  /* Authorization Errors */

  // 1100 - Invalid credentials provided for login
  InvalidCredentials: 1100,

  // 1110 - Invalid email address format provided for login
  InvalidLoginEmail: 1110,

  // 1120 - Incorrect password provided for login
  InvalidLoginPassword: 1120,

  // 1130 - User account is inactive and cannot log in
  InactiveUser: 1130,

  // 1140 - User has not accepted latest terms and conditions
  TermsAndConditionsNotAccepted: 1140,

  // 1200 - Validation of auth token failed
  TokenValidationFailed: 1200,

  // 1300 - User has limited access to requested resource
  LimitedAccess: 1300,

  // 1400 - Auth token missing from request
  MissingAuthToken: 1400,

  /* Extended Limited access error */

  // 1311 - User does not have access to requested node
  NodeNotAccessible: 1311,

  // 1312 - Error assigning accessible nodes to user
  InvalidAccessibleNodes: 1312,

  /* Name already exists */

  // 2110 - Email address already exists
  EmailAlreadyExists: 2110,

  // 2210 - Organization name already exists
  OrganizatinAlreadyExists: 2210,

  // 2310 - Site name already exists
  SiteAlreadyExists: 2310,

  // 2410 - Subsite name already exists
  SubsiteAlreadyExists: 2410,

  // 2510 - Solution name already exists
  SolutionAlreadyExists: 2510,

  // 2610 - Feature name already exists
  FeatureAlreadyExists: 2610,

  /* User Conflicts */

  // 2111 - User already invited
  DuplicateInvite: 2111,

  // 2112 - New and confirm passwords do not match
  RepeatedPassword: 2112,

  // 2113 - Incorrect current password provided
  IncorrectCurrPassword: 2113,

  /* Bad Request */

  // 3400 - Validation failed for request body
  ValidationFailed: 3400,

  // 3500 - Request body is empty
  EmptyRequestBody: 3500,

  // 3510 - Missing required parent ID in request
  MissingParentId: 3510,

  // 3600 - Invalid content type in request
  InvalidContentType: 3600,

  // 3700 - Requested route does not exist
  RouteNotFound: 3700,

  // 3800 - Duplicate request received
  DuplicateRequest: 3800,

  // 3900 - Invalid node hierarchy in request
  InvalidHierarchy: 3900,

  // 3910 - Invalid subsite hierarchy in request
  InvalidSubSiteHierarchy: 3910,

  // 3920 - Invalid site hierarchy in request
  InvalidSiteHierarchy: 3920,

  // 2000 - Specified user not found
  UserNotFound: 2000,

  /* Server Error */

  // 5000 - Internal server error
  InternalServerError: 5000,

  // 5200 - Database error
  DatabaseError: 5200,

  /* Undefined Code */

  // 9999 - Undefined error code
  UndefinedCode: 9999,
};

export default Err;
