export interface UserData {
    /**
     * A temporary unique identifier for the user.
     */
    temporaryId: string;
  
    /**
     * Classifications for the user, such as country and channel.
     */
    classifications: {
      /**
       * Country code (e.g., 'dk' for Denmark).
       */
      country: string;
  
      /**
       * Channel of the user (e.g., 'B2C', 'B2B').
       */
      channel: string;
      Persona:string;
    };
  
    /**
     * Identifiers for the user, can be extended as needed.
     */
    identifiers: Record<string, unknown>;
  
    /**
     * Additional data related to the user.
     */
    data: Record<string, unknown>;
  
    /**
     * The user's email address.
     */
    email: string;
  }