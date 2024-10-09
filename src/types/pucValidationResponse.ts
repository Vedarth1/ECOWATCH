// Define VehiclePUCCDetails interface
export interface VehiclePUCCDetails {
    op_dt: string;
    pucc_centreno: string;
    pucc_from: string;
    pucc_no: string;
    pucc_upto: string;
  }
  
  // Define PUCValidationResult interface
  export interface PUCValidationResult {
    message: string;
    model: string;
    owner_name: string;
    reg_no: string;
    reg_type_descr: string;
    reg_upto: string;
    state: string;
    vehicle_class_desc: string;
    vehicle_pucc_details: VehiclePUCCDetails;
  }
  
  // Define PUCValidationResponse interface
  export interface PUCValidationResponse {
    message: string;
    response: PUCValidationResult[];
    status: string;
  }
  