import { pool } from "../../../utils/pg";
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
  try {
    let sql = "SELECT data_json FROM land_parcels WHERE 1=1";
    const params: any[] = [];

    if (query.ulpin) {
      params.push(`%${query.ulpin}%`);
      sql += ` AND ulpin ILIKE $${params.length}`;
    }
    if (query.dag) {
      params.push(`%${query.dag}%`);
      sql += ` AND dag_no ILIKE $${params.length}`;
    }
    if (query.mouza) {
      params.push(`%${query.mouza}%`);
      sql += ` AND (mouza_bn ILIKE $${params.length})`;
    }

    const res = await pool.query(sql, params);
    if (res.rows.length > 0) {
      return res.rows.map((r) => r.data_json as ILandParcel);
    }
  } catch (error) {
    console.warn("DB query failed, fallback to memory:", error);
  }

  // Resilient memory fallback
  let parcels = [...syntheticLandParcels];
  if (query.ulpin) parcels = parcels.filter((p) => p.ulpin.toLowerCase().includes(query.ulpin!.toLowerCase()));
  if (query.mouza) parcels = parcels.filter((p) => p.mouzaBn.includes(query.mouza!) || p.mouzaEn.toLowerCase().includes(query.mouza!.toLowerCase()));
  if (query.dag) parcels = parcels.filter((p) => p.dagNo.includes(query.dag!));
  return parcels;
};

export const getParcelByUlpinOrDag = async (identifier: string) => {
  try {
    const res = await pool.query(
      "SELECT data_json FROM land_parcels WHERE ulpin ILIKE $1 OR dag_no = $1 OR current_khatian_no ILIKE $1 LIMIT 1;",
      [identifier]
    );
    if (res.rows.length > 0) {
      return res.rows[0].data_json as ILandParcel;
    }
  } catch (error) {
    console.warn("DB single query fallback:", error);
  }

  const parcel = syntheticLandParcels.find(
    (p) =>
      p.ulpin.toLowerCase() === identifier.toLowerCase() ||
      p.dagNo === identifier ||
      p.currentKhatianNo.toLowerCase() === identifier.toLowerCase()
  );
  return parcel || null;
};
