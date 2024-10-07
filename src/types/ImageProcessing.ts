// src/types/ImageProcessing.ts
export interface ImageProcessingResponse {
    status: string;
    message: string;
    response: Array<{
      reg_no: string;
      owner_name: string;
      model: string;
      state: string;
      reg_type_descr: string;
      vehicle_class_desc: string;
      reg_upto: string;
      vehicle_pucc_details: unknown; // Adjust type as necessary
    }>;
  }
  