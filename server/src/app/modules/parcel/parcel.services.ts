import { ILandParcel, syntheticLandParcels } from "../../../data/land-records";

export const getAllParcels = async (query: {
  division?: string;
  district?: string;
  upazila?: string;
  mouza?: string;
  khatian?: string;
  dag?: string;
  ulpin?: string;
}) => {
  let parcels = [...syntheticLandParcels];

  if (query.ulpin) {
    parcels = parcels.filter((p) => p.ulpin.toLowerCase().includes(query.ulpin!.toLowerCase()));
  }

  if (query.division) {
    parcels = parcels.filter(
      (p) =>
        p.divisionBn.includes(query.division!) ||
        p.divisionEn.toLowerCase().includes(query.division!.toLowerCase())
    );
  }

  if (query.upazila) {
    parcels = parcels.filter(
      (p) =>
        p.upazilaBn.includes(query.upazila!) ||
        p.upazilaEn.toLowerCase().includes(query.upazila!.toLowerCase())
    );
  }

  if (query.mouza) {
    parcels = parcels.filter(
      (p) =>
        p.mouzaBn.includes(query.mouza!) ||
        p.mouzaEn.toLowerCase().includes(query.mouza!.toLowerCase())
    );
  }

  if (query.dag) {
    parcels = parcels.filter((p) => p.dagNo.includes(query.dag!));
  }

  if (query.khatian) {
    parcels = parcels.filter((p) => p.currentKhatianNo.includes(query.khatian!));
  }

  return parcels;
};

export const getParcelByUlpinOrDag = async (identifier: string) => {
  const parcel = syntheticLandParcels.find(
    (p) =>
      p.ulpin.toLowerCase() === identifier.toLowerCase() ||
      p.dagNo === identifier ||
      p.currentKhatianNo.toLowerCase() === identifier.toLowerCase()
  );

  return parcel || null;
};
