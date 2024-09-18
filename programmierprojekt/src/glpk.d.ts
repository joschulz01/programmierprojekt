
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
    
    export function glp_create_prob(): any;
    export function glp_set_obj_dir(prob: any, dir: number): void;
    export function glp_set_obj_name(prob: any, name: string): void;
    export function glp_add_cols(prob: any, n: number): number;
    export function glp_set_col_name(prob: any, col: number, name: string): void;
    export function glp_set_col_bnds(prob: any, col: number, type: number, lb: number, ub: number): void;
    export function glp_add_rows(prob: any, n: number): number;
    export function glp_set_row_name(prob: any, row: number, name: string): void;
    export function glp_set_row_bnds(prob: any, row: number, sense: number, lb: number, ub: number): void;
    export function glp_set_mat_row(prob: any, row: number, ne: number, col: number[], val: number[]): void;
    export function glp_simplex(prob: any, params: any): void;
    export function glp_get_num_cols(prob: any): number;
    export function glp_get_col_name(prob: any, col: number): string;
    export function glp_get_col_prim(prob: any, col: number): number;
    export function glp_delete_prob(prob: any): void;
  }
  