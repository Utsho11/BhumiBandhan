import { pool } from "../../../utils/pg";
import { ILandParcel, syntheticLandParcels } from "../../../data/land-records";
import { getSearchVariants, isDagMatch } from "../../../utils/digitConverter";

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
      const uVariants = getSearchVariants(query.ulpin);
      const orClauses = uVariants.map((v) => {
        params.push(`%${v}%`);
        return `ulpin ILIKE $${params.length}`;
      });
      sql += ` AND (${orClauses.join(" OR ")})`;
    }
    if (query.dag) {
      const dVariants = getSearchVariants(query.dag);
      const orClauses = dVariants.map((v) => {
        params.push(v);
        params.push(`%${v}%`);
        return `(dag_no = $${params.length - 1} OR dag_no ILIKE $${params.length})`;
      });
      sql += ` AND (${orClauses.join(" OR ")})`;
    }
    if (query.mouza) {
      params.push(`%${query.mouza}%`);
      sql += ` AND (mouza_bn ILIKE $${params.length} OR mouza_en ILIKE $${params.length})`;
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
  if (query.ulpin) {
    const uVariants = getSearchVariants(query.ulpin);
    parcels = parcels.filter((p) =>
      uVariants.some((v) => p.ulpin.toLowerCase().includes(v.toLowerCase()))
    );
  }
  if (query.mouza) {
    const m = query.mouza.toLowerCase();
    parcels = parcels.filter(
      (p) =>
        p.mouzaBn.toLowerCase().includes(m) ||
        m.includes(p.mouzaBn.toLowerCase()) ||
        p.mouzaEn.toLowerCase().includes(m)
    );
  }
  if (query.dag) {
    parcels = parcels.filter((p) => isDagMatch(p.dagNo, query.dag));
  }
  return parcels;
};

export const getParcelByUlpinOrDag = async (identifier: string) => {
  const variants = getSearchVariants(identifier);

  try {
    for (const v of variants) {
      const res = await pool.query(
        "SELECT data_json FROM land_parcels WHERE ulpin ILIKE $1 OR dag_no = $1 OR current_khatian_no ILIKE $1 LIMIT 1;",
        [v]
      );
      if (res.rows.length > 0) {
        return res.rows[0].data_json as ILandParcel;
      }
    }
  } catch (error) {
    console.warn("DB single query fallback:", error);
  }

  const parcel = syntheticLandParcels.find(
    (p) =>
      variants.some((v) => p.ulpin.toLowerCase() === v.toLowerCase()) ||
      isDagMatch(p.dagNo, identifier) ||
      variants.some((v) => p.currentKhatianNo.toLowerCase().includes(v.toLowerCase()))
  );
  return parcel || null;
};
