export interface NppesRequest {
    lastName: string;
    firstName?: string;
    city?: string;
    state?: string;
  }
  
  export interface NppesResponse {
    result_count: number;
    results: Provider[];
  }
  
  export interface Provider {
    number: string;
    basic: {
      first_name: string;
      last_name: string;
      credential?: string;
      sole_proprietor: string;
      gender: string;
      enumeration_date: string;
      last_updated: string;
    };
    addresses: Address[];
    taxonomies: Taxonomy[];
  }
  
  export interface Address {
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postal_code: string;
    telephone_number?: string;
    address_type: 'LOCATION' | 'MAILING';
  }
  
  export interface Taxonomy {
    code: string;
    desc: string;
    primary: boolean;
    state?: string;
    license?: string;
  }