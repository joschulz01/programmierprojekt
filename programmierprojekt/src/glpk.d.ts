
declare module 'glpk.js' {
    export const GLP_MAX: number;
    export const GLP_MIN: number;
    export const GLP_FX: number;
    export const GLP_LO: number;
    export const GLP_UP: number;
    export const GLP_DB: number;
    export const GLP_FR: number;
    export const GLP_LE: number;
    export const GLP_GE: number;
    
    export function glp_create_prob(): unknown;
    export function glp_set_obj_dir(prob: unknown, dir: number): void;
    export function glp_set_obj_name(prob: unknown, name: string): void;
    export function glp_add_cols(prob: unknown, n: number): number;
    export function glp_set_col_name(prob: unknown, col: number, name: string): void;
    export function glp_set_col_bnds(prob: unknown, col: number, type: number, lb: number, ub: number): void;
    export function glp_add_rows(prob: unknown, n: number): number;
    export function glp_set_row_name(prob: unknown, row: number, name: string): void;
    export function glp_set_row_bnds(prob: unknown, row: number, sense: number, lb: number, ub: number): void;
    export function glp_set_mat_row(prob: unknown, row: number, ne: number, col: number[], val: number[]): void;
    export function glp_simplex(prob: unknown, params: unknown): void;
    export function glp_get_num_cols(prob: unknown): number;
    export function glp_get_col_name(prob: unknown, col: number): string;
    export function glp_get_col_prim(prob: unknown, col: number): number;
    export function glp_delete_prob(prob: unknown): void;
  }
  