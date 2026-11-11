/**
 * Host half of 特效二.
 *
 * All rendering lives in the browser half and attaches to the base
 * dsh-reasoning-module slider; the Host entry exists so the Loader can mount
 * the package as a component row. The Host-side exclusivity rule in
 * dsh-reasoning-module matches every `reasoning-fx-*` patch id, so this row
 * participates in "at most one reasoning effect enabled" automatically.
 */
export function apply() {}
