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
    length: number;
    map(arg0: (result: { message: string | number | bigint | boolean | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | import("react").ReactPortal | Promise<import("react").AwaitedReactNode> | null | undefined; model: string | number | bigint | boolean | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | import("react").ReactPortal | Promise<import("react").AwaitedReactNode> | null | undefined; owner_name: string | number | bigint | boolean | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | import("react").ReactPortal | Promise<import("react").AwaitedReactNode> | null | undefined; reg_no: string | number | bigint | boolean | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | import("react").ReactPortal | Promise<import("react").AwaitedReactNode> | null | undefined; reg_type_descr: string | number | bigint | boolean | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | import("react").ReactPortal | Promise<import("react").AwaitedReactNode> | null | undefined; reg_upto: string | number | bigint | boolean | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | import("react").ReactPortal | Promise<import("react").AwaitedReactNode> | null | undefined; state: string | number | bigint | boolean | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | import("react").ReactPortal | Promise<import("react").AwaitedReactNode> | null | undefined; vehicle_class_desc: string | number | bigint | boolean | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | import("react").ReactPortal | Promise<import("react").AwaitedReactNode> | null | undefined; vehicle_pucc_details: { op_dt: string | number | bigint | boolean | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | import("react").ReactPortal | Promise<import("react").AwaitedReactNode> | null | undefined; pucc_centreno: string | number | bigint | boolean | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | import("react").ReactPortal | Promise<import("react").AwaitedReactNode> | null | undefined; pucc_from: string | number | bigint | boolean | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | import("react").ReactPortal | Promise<import("react").AwaitedReactNode> | null | undefined; pucc_no: string | number | bigint | boolean | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | import("react").ReactPortal | Promise<import("react").AwaitedReactNode> | null | undefined; pucc_upto: string | number | bigint | boolean | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | import("react").ReactPortal | Promise<import("react").AwaitedReactNode> | null | undefined; }; }, index: import("react").Key | null | undefined) => import("react").JSX.Element): import("react").ReactNode;
    data: PUCValidationResponse | null;
    message: string;
    response: PUCValidationResult[];
    status: string;
  }
  